import dotenv from 'dotenv';
import { defineConfig } from 'drizzle-kit';

dotenv.config();

const config = defineConfig({
    schema: './src/database/schema',
    out: './src/database/migrations',
    dialect: 'postgresql',
    dbCredentials: {
        url: process.env.DATABASE_URL!,
    },
});

export default config;
