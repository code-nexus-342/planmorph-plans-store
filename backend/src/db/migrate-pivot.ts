const { Client } = require('pg');
const dns = require('dns');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function getClientConfig() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error('DATABASE_URL is not set');

  const match = connectionString.match(/postgresql:\/\/([^:]+):([^@]+)@([^/]+)\/([^?]+)/);
  if (!match) throw new Error('Invalid connection string format');

  const [_, user, password, host, database] = match;

  console.log(`Resolving ${host}...`);
  const { address } = await dns.promises.lookup(host, { family: 4 });
  console.log(`Resolved to ${address}`);

  return {
    host: address,
    user,
    password,
    database,
    port: 5432,
    ssl: {
      servername: host,
      rejectUnauthorized: true
    },
    connectionTimeoutMillis: 30000 // Increased timeout
  };
}

async function runPivotMigration() {
  let client;
  try {
    console.log('Starting client-only pivot migration...');
    
    const config = await getClientConfig();
    client = new Client(config);
    await client.connect();
    
    const migrationPath = path.join(__dirname, 'migrations', '002_client_only_pivot.sql');
    const migrationSql = fs.readFileSync(migrationPath, 'utf-8');
    
    // Split statements by semicolon and filter out empty ones
    const statements = migrationSql
      .split(';')
      .map((stmt: string) => stmt.trim())
      .filter((stmt: string) => stmt.length > 0);

    for (const statement of statements) {
      console.log(`Executing: ${statement.substring(0, 50)}...`);
      await client.query(statement);
    }
    
    console.log('✓ Client-only pivot migration completed successfully');
    
    await client.end();
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    if (client) await client.end();
    process.exit(1);
  }
}

runPivotMigration();
