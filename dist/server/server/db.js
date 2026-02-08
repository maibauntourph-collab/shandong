"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.closeDB = exports.getDB = exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// --- In-Memory Mock Database ---
const mockData = {
    adminUsers: [],
    inquiries: [],
    documents: [],
    notices: [], // Added notices collection
    customers: []
};
// Mock Collection Implementation
class MockCollection {
    constructor(name) {
        this.name = name;
        if (!mockData[name])
            mockData[name] = [];
        this.data = mockData[name];
    }
    async findOne(query) {
        // Simple mock implementation for login
        if (query.username) {
            return this.data.find(item => item.username === query.username);
        }
        return this.data.find(item => {
            return Object.keys(query).every(key => item[key] === query[key]);
        });
    }
    find(query = {}) {
        let filtered = this.data.filter(item => {
            return Object.keys(query).every(key => item[key] === query[key]);
        });
        // Helper to create a chainable cursor-like object
        const createCursor = (data) => ({
            sort: (sortOpts) => {
                const sorted = [...data].sort((a, b) => {
                    const key = Object.keys(sortOpts)[0];
                    return sortOpts[key] === 1 ? (a[key] > b[key] ? 1 : -1) : (a[key] < b[key] ? 1 : -1);
                });
                return createCursor(sorted);
            },
            skip: (skipCount) => {
                return createCursor(data.slice(skipCount));
            },
            limit: (limitCount) => {
                return createCursor(data.slice(0, limitCount));
            },
            toArray: async () => data,
            count: async () => data.length
        });
        return createCursor(filtered);
    }
    async insertOne(doc) {
        const newDoc = { ...doc, _id: new mongoose_1.default.Types.ObjectId() };
        this.data.push(newDoc);
        return { insertedId: newDoc._id };
    }
    async updateOne(query, update) {
        const item = await this.findOne(query);
        if (item) {
            // Handle $set
            if (update.$set) {
                Object.assign(item, update.$set);
            }
            // Handle $push
            if (update.$push) {
                for (const key in update.$push) {
                    if (!item[key])
                        item[key] = [];
                    item[key].push(update.$push[key]);
                }
            }
            return { modifiedCount: 1, matchedCount: 1 };
        }
        return { modifiedCount: 0, matchedCount: 0 };
    }
    async deleteOne(query) {
        const index = this.data.findIndex(item => {
            return Object.keys(query).every(key => item[key] === query[key]);
        });
        if (index !== -1) {
            this.data.splice(index, 1);
            return { deletedCount: 1 };
        }
        return { deletedCount: 0 };
    }
    async countDocuments(query = {}) {
        return this.data.filter(item => {
            return Object.keys(query).every(key => item[key] === query[key]);
        }).length;
    }
    // Mock aggregate for dashboard stats
    aggregate(pipeline) {
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
    collection: (name) => new MockCollection(name)
};
const connection = {
    isConnected: false
};
const connectDB = async () => {
    if (connection.isConnected) {
        console.log('Using existing database connection');
        return;
    }
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error('MONGODB_URI not defined');
        }
        const db = await mongoose_1.default.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 5000 // Fail fast if no local DB
        });
        connection.isConnected = db.connections[0].readyState === 1;
        console.log('✅ MongoDB Connected Successfully');
    }
    catch (error) {
        console.error('❌ MONGODB ERROR DETAILS:', error);
        console.warn('⚠️ MongoDB Connection Failed. Falling back to In-Memory Mock Database.');
        console.warn('⚠️ Data will NOT be saved after server restart.');
        // We do NOT set isConnected to false, but we let getDB return the mock.
        // Actually, let's keep isConnected false, but getDB will handle it.
    }
};
exports.connectDB = connectDB;
const getDB = () => {
    if (mongoose_1.default.connection.readyState === 1) {
        return mongoose_1.default.connection.db;
    }
    // Fallback to mock DB if real DB is not connected
    console.log('⚠️ Using In-Memory Mock Database');
    return mockDB;
};
exports.getDB = getDB;
const closeDB = async () => {
    if (connection.isConnected) {
        await mongoose_1.default.disconnect();
        connection.isConnected = false;
        console.log('MongoDB connection closed');
    }
};
exports.closeDB = closeDB;
