import dotenv from 'dotenv';
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from './schema';

dotenv.config();

if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not set');
}

const sql = neon(process.env.DATABASE_URL);
const database = drizzle(sql, {
    schema,
});

export { database };
