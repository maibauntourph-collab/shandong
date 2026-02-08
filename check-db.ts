
import { connectDB, getDB, closeDB } from './server/db.js';
import dotenv from 'dotenv';

dotenv.config();

async function check() {
    console.log('Testing connection...');
    await connectDB();
    const db = getDB();

    if (db && db.constructor.name === 'MockCollection') { // Checking if it's our mock object (which has collection method returning MockCollection)
        // Wait, getDB returns mockDB which has collection method.
        console.log('RESULT: MOCK_DB');
    } else if (db && db.databaseName) {
        console.log('RESULT: REAL_DB connected to ' + db.databaseName);
    } else {
        // My mockDB object has collection method, but no databaseName property.
        // Real mongoose db object has databaseName.
        // MockDB definition: const mockDB = { collection: ... }
        if ((db as any).databaseName) {
            console.log('RESULT: REAL_DB connected to ' + (db as any).databaseName);
        } else {
            console.log('RESULT: MOCK_DB');
        }
    }
    await closeDB();
}

check();
