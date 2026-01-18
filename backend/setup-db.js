const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
require('dotenv').config();

async function setup() {
    console.log('Starting database setup...');

    // 1. Connect to default 'postgres' db to create project_db if needed
    const adminClient = new Client({
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        database: 'postgres'
    });

    try {
        await adminClient.connect();
        console.log('Connected to postgres instance.');

        const dbName = process.env.DB_NAME || 'project_db';

        // Check if DB exists
        const res = await adminClient.query(`SELECT 1 FROM pg_database WHERE datname = '${dbName}'`);
        if (res.rowCount === 0) {
            console.log(`Database '${dbName}' not found. Creating...`);
            await adminClient.query(`CREATE DATABASE "${dbName}"`);
            console.log(`Database '${dbName}' created.`);
        } else {
            console.log(`Database '${dbName}' already exists.`);
        }
        await adminClient.end();

        // 2. Connect to the project database to apply schema
        const projectClient = new Client({
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            database: dbName
        });

        await projectClient.connect();
        console.log(`Connected to '${dbName}'. Applying schema...`);

        const schemaPath = path.join(__dirname, 'schema.sql');
        const schemaSql = fs.readFileSync(schemaPath, 'utf8');

        await projectClient.query(schemaSql);
        console.log('Schema applied.');

        // 3. Create a test user if one doesn't exist
        const userCheck = await projectClient.query("SELECT * FROM users WHERE email = 'test@example.com'");
        if (userCheck.rowCount === 0) {
            console.log('Creating test user (test@example.com / password123)...');
            const hashedPassword = await bcrypt.hash('password123', 10);
            await projectClient.query(
                `INSERT INTO users (username, email, password) VALUES ($1, $2, $3)`,
                ['testuser', 'test@example.com', hashedPassword]
            );
            console.log('Test user created.');
        } else {
            console.log('Test user already exists.');
        }

        await projectClient.end();
        console.log('✅ Setup completed successfully!');

    } catch (err) {
        console.error('❌ Setup failed:', err.message);
        if (err.code === '28P01') {
            console.error('  -> Authentication failed. Please check DB_USER and DB_PASSWORD in backend/.env');
        } else if (err.code === 'ECONNREFUSED') {
            console.error('  -> Could not connect to PostgreSQL. Is the server running on the specified port?');
        }
        if (adminClient) adminClient.end().catch(() => { });
    }
}

setup();
