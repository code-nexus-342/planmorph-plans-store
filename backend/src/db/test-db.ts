import { Client } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

console.log('Testing connection to:', process.env.DATABASE_URL?.replace(/:[^:]*@/, ':****@'));

// Remove query params that might conflict
const connectionString = process.env.DATABASE_URL?.split('?')[0];

const client = new Client({
  connectionString,
  ssl: { rejectUnauthorized: false },
  connectionTimeoutMillis: 30000, // Increase timeout
});

async function test() {
  try {
    await client.connect();
    console.log('Connected successfully!');
    const res = await client.query('SELECT NOW()');
    console.log('Current time from DB:', res.rows[0]);
    await client.end();
  } catch (err) {
    console.error('Connection failed:', err);
    process.exit(1);
  }
}

test();
