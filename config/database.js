const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: 5432,
    max: 20,
    connectionTimeoutMillis: 10000,
    retry: {
        max: 10,
        backoff: 'exponential'
    }
});

async function initializeDatabase() {
    const client = await pool.connect();
    try {
      await client.query(`
        DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'users') THEN
        CREATE TABLE users (
            id SERIAL PRIMARY KEY,
            username VARCHAR(255) NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'blogs') THEN
        CREATE TABLE blogs (
            id SERIAL PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            content TEXT NOT NULL,
            user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'comments') THEN
        CREATE TABLE comments (
            id SERIAL PRIMARY KEY,
            content TEXT NOT NULL,
            user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
            blog_id INTEGER REFERENCES blogs(id) ON DELETE CASCADE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    END IF;
END $$;
      `);
    } finally {
      client.release();
    }
  }
  
  initializeDatabase().catch(console.error);
// Add connection verification
pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
});

// Verify connection
const verifyConnection = async () => {
    try {
        const client = await pool.connect();
        console.log('Database connection successful');
        client.release();
    } catch (err) {
        console.error('Database connection error:', err);
        // Wait and retry
        setTimeout(verifyConnection, 5000);
    }
};

verifyConnection();

module.exports = pool;