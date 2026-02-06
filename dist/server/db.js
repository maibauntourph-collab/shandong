import { MongoClient } from 'mongodb';
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/outcatering';
let db = null;
let client = null;
export const connectDB = async () => {
    if (db)
        return db;
    try {
        client = new MongoClient(MONGODB_URI);
        await client.connect();
        db = client.db();
        console.log('📦 Connected to MongoDB');
        // Create indexes
        await createIndexes(db);
        return db;
    }
    catch (error) {
        console.error('MongoDB connection error:', error);
        throw error;
    }
};
export const getDB = () => {
    if (!db)
        throw new Error('Database not connected');
    return db;
};
const createIndexes = async (database) => {
    // Inquiries indexes
    await database.collection('inquiries').createIndex({ createdAt: -1 });
    await database.collection('inquiries').createIndex({ status: 1 });
    await database.collection('inquiries').createIndex({ email: 1 });
    // Chat sessions indexes
    await database.collection('chatSessions').createIndex({ sessionId: 1 }, { unique: true });
    await database.collection('chatSessions').createIndex({ createdAt: -1 });
    // Documents indexes
    await database.collection('documents').createIndex({ uploadedAt: -1 });
    // Admin users indexes
    await database.collection('adminUsers').createIndex({ username: 1 }, { unique: true });
    // Notices (게시판) indexes
    await database.collection('notices').createIndex({ createdAt: -1 });
    await database.collection('notices').createIndex({ isPublished: 1 });
    console.log('📇 Database indexes created');
};
export const closeDB = async () => {
    if (client) {
        await client.close();
        db = null;
        client = null;
        console.log('📦 MongoDB connection closed');
    }
};
