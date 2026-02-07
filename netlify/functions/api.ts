import serverless from 'serverless-http';
import app from '../../server/app';
import { connectDB } from '../../server/db';

let conn = null;

export const handler = async (event, context) => {
    // Ensure DB connection is established (even if mock)
    if (conn == null) {
        conn = await connectDB();
    }
    return serverless(app)(event, context);
};
