"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.closeDB = exports.getDB = exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const connection = {
    isConnected: false
};
const connectDB = async () => {
    if (connection.isConnected) {
        console.log('Using existing database connection');
        return;
    }
    if (!process.env.MONGODB_URI) {
        console.warn('⚠️ MONGODB_URI not found in environment variables.');
        console.warn('⚠️ Please configure MONGODB_URI in your .env file or Netlify site settings.');
        // In a real scenario, we might want to throw an error or strictly require the DB.
        // For now, we'll log a warning.
        return;
    }
    try {
        const db = await mongoose_1.default.connect(process.env.MONGODB_URI);
        connection.isConnected = db.connections[0].readyState === 1;
        console.log('✅ MongoDB Connected Successfully');
    }
    catch (error) {
        console.error('❌ MongoDB Connection Error:', error);
        // Do not exit process, allowing server to run (maybe in a degraded state or for other routes)
    }
};
exports.connectDB = connectDB;
const getDB = () => {
    // This function is kept for backward compatibility if needed, 
    // but with Mongoose models, we usually import models directly.
    // However, if the rest of the app uses native MongoDB driver patterns (db.collection...),
    // we can return the native db handle from mongoose.
    if (mongoose_1.default.connection.readyState === 1) {
        return mongoose_1.default.connection.db;
    }
    return null;
};
exports.getDB = getDB;
// Keep the mock interfaces/logic if we want a fallback?
// For production-ready, we should strictly use the real DB.
// But to avoid breaking existing code that expects `getDB().collection(...)`,
// we will maintain the `getDB` export to return the mongoose native connection.
// IMPORTANT: The existing code uses `getDB().collection('name').find(...)`.
// Mongoose connection.db supports this.
const closeDB = async () => {
    if (connection.isConnected) {
        await mongoose_1.default.disconnect();
        connection.isConnected = false;
        console.log('MongoDB connection closed');
    }
};
exports.closeDB = closeDB;
