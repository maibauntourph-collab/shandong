import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// --- In-Memory Mock Database ---
const mockData: any = {
    adminUsers: [],
    inquiries: [],
    documents: [],
    notices: [], // Added notices collection
    customers: []
};

// Mock Collection Implementation
class MockCollection {
    name: string;
    data: any[];

    constructor(name: string) {
        this.name = name;
        if (!mockData[name]) mockData[name] = [];
        this.data = mockData[name];
    }

    async findOne(query: any) {
        // Simple mock implementation for login
        if (query.username) {
            return this.data.find(item => item.username === query.username);
        }
        return this.data.find(item => {
            return Object.keys(query).every(key => item[key] === query[key]);
        });
    }

    find(query: any = {}) {
        let filtered = this.data.filter(item => {
            return Object.keys(query).every(key => item[key] === query[key]);
        });

        // Helper to create a chainable cursor-like object
        const createCursor = (data: any[]) => ({
            sort: (sortOpts: any) => {
                const sorted = [...data].sort((a, b) => {
                    const key = Object.keys(sortOpts)[0];
                    return sortOpts[key] === 1 ? (a[key] > b[key] ? 1 : -1) : (a[key] < b[key] ? 1 : -1);
                });
                return createCursor(sorted);
            },
            skip: (skipCount: number) => {
                return createCursor(data.slice(skipCount));
            },
            limit: (limitCount: number) => {
                return createCursor(data.slice(0, limitCount));
            },
            toArray: async () => data,
            count: async () => data.length
        });

        return createCursor(filtered);
    }

    async insertOne(doc: any) {
        const newDoc = { ...doc, _id: new mongoose.Types.ObjectId() };
        this.data.push(newDoc);
        return { insertedId: newDoc._id };
    }

    async updateOne(query: any, update: any) {
        const item = await this.findOne(query);
        if (item) {
            // Handle $set
            if (update.$set) {
                Object.assign(item, update.$set);
            }
            // Handle $push
            if (update.$push) {
                for (const key in update.$push) {
                    if (!item[key]) item[key] = [];
                    item[key].push(update.$push[key]);
                }
            }
            return { modifiedCount: 1, matchedCount: 1 };
        }
        return { modifiedCount: 0, matchedCount: 0 };
    }

    async deleteOne(query: any) {
        const index = this.data.findIndex(item => {
            return Object.keys(query).every(key => item[key] === query[key]);
        });
        if (index !== -1) {
            this.data.splice(index, 1);
            return { deletedCount: 1 };
        }
        return { deletedCount: 0 };
    }

    async countDocuments(query: any = {}) {
        return this.data.filter(item => {
            return Object.keys(query).every(key => item[key] === query[key]);
        }).length;
    }

    // Mock aggregate for dashboard stats
    aggregate(pipeline: any[]) {
        // Very basic mock for specific aggregations we know exist
        let result = [];
        if (this.name === 'inquiries' && pipeline[0]?.$group?._id === '$email') {
            // Count unique emails
            const uniqueEmails = new Set(this.data.map(i => i.email));
            result = Array.from(uniqueEmails).map(email => ({ _id: email }));
        }

        // Return a cursor-like object, NOT a Promise directly
        return {
            toArray: async () => result
        };
    }
}

// Mock Database Object
const mockDB = {
    collection: (name: string) => new MockCollection(name)
};

// --- Real Connection Logic ---

interface DBConnection {
    isConnected: boolean;
}

const connection: DBConnection = {
    isConnected: false
};

export const connectDB = async (): Promise<void> => {
    if (connection.isConnected) {
        console.log('Using existing database connection');
        return;
    }

    try {
        if (!process.env.MONGODB_URI) {
            throw new Error('MONGODB_URI not defined');
        }
        const db = await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 5000 // Fail fast if no local DB
        });
        connection.isConnected = db.connections[0].readyState === 1;
        console.log('✅ MongoDB Connected Successfully');
    } catch (error) {
        console.error('❌ MONGODB ERROR DETAILS:', error);
        console.warn('⚠️ MongoDB Connection Failed. Falling back to In-Memory Mock Database.');
        console.warn('⚠️ Data will NOT be saved after server restart.');
        // We do NOT set isConnected to false, but we let getDB return the mock.
        // Actually, let's keep isConnected false, but getDB will handle it.
    }
};

export const getDB = (): any => {
    if (mongoose.connection.readyState === 1) {
        return mongoose.connection.db;
    }
    // Fallback to mock DB if real DB is not connected
    console.log('⚠️ Using In-Memory Mock Database');
    return mockDB;
};

export const closeDB = async () => {
    if (connection.isConnected) {
        await mongoose.disconnect();
        connection.isConnected = false;
        console.log('MongoDB connection closed');
    }
};

