import { Db } from 'mongodb';
export declare const connectDB: () => Promise<Db>;
export declare const getDB: () => Db;
export declare const closeDB: () => Promise<void>;
