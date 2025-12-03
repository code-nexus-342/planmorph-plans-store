import { Client } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const url = process.env.DATABASE_URL;
console.log('Testing connection to:', url?.replace(/:[^:]*@/, ':****@'));

async function testConfig(name: string, config: any) {
  console.log(`\n--- Testing Config: ${name} ---`);
  const client = new Client(config);
  try {
    await client.connect();
    console.log(`✅ Success with ${name}!`);
    const res = await client.query('SELECT version()');
    console.log('Version:', res.rows[0].version);
    await client.end();
    return true;
  } catch (err: any) {
    console.log(`❌ Failed with ${name}:`, err.message);
    if (client) {
        try { await client.end(); } catch (e) {}
    }
    return false;
  }
}

async function run() {
  // Test 7: IP with Endpoint ID (Bypass DNS/IPv6)
  const endpointId = 'ep-spring-voice-ahz9vjb9';
  const ip = '18.215.6.120';
  
  // Test 8: Hardcoded Password + Correct Options Format
  await testConfig('Hardcoded Password + Options', {
    host: ip,
    user: 'neondb_owner',
    password: 'npg_LGvxP0m4MVBb',
    database: 'neondb',
    port: 5432,
    ssl: { rejectUnauthorized: false },
    options: `endpoint=${endpointId}`, // Try without -c
    connectionTimeoutMillis: 10000,
  });

  // Test 9: DNS Lookup IPv4
  const dns = require('dns').promises;
  try {
      const { address } = await dns.lookup('ep-spring-voice-ahz9vjb9-pooler.c-3.us-east-1.aws.neon.tech', { family: 4 });
      console.log('Resolved IPv4:', address);
      await testConfig('Resolved IPv4 + Options', {
        host: address,
        user: 'neondb_owner',
        password: 'npg_LGvxP0m4MVBb',
        database: 'neondb',
        port: 5432,
        ssl: { rejectUnauthorized: false },
        options: `endpoint=${endpointId}`,
        connectionTimeoutMillis: 10000,
      });
  } catch (e: any) {
      console.log('DNS Lookup failed:', e.message);
  }

  // Test 10: User@Endpoint format
  await testConfig('User@Endpoint Format', {
    host: ip,
    user: `neondb_owner@${endpointId}`,
    password: 'npg_LGvxP0m4MVBb',
    database: 'neondb',
    port: 5432,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 10000,
  });
}

run();
