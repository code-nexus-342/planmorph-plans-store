import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

import { URL } from 'url';
import { execSync } from 'child_process';

export const getPoolConfig = () => {
  const connectionString = process.env.DATABASE_URL;
  
  // Default config if no connection string or parsing fails
  const defaultConfig = {
    connectionString,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  };

  if (!connectionString) return defaultConfig;

  try {
    const url = new URL(connectionString);
    const host = url.hostname;
    let ip = host;

    // Resolve hostname to IPv4 to avoid IPv6 issues
    if (host && host !== 'localhost' && host !== '127.0.0.1') {
      try {
        // Use node's dns module synchronously via execSync to ensure we get an IPv4 address
        // This is necessary because Neon/AWS sometimes resolves to IPv6 which fails with some network configs
        const resolveCmd = `node -e 'require("dns").lookup("${host}", {family: 4}, (err, addr) => console.log(addr))'`;
        const resolvedIp = execSync(resolveCmd).toString().trim();
        
        if (resolvedIp && /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(resolvedIp)) {
          ip = resolvedIp;
          console.log(`[DB] Resolved ${host} to ${ip}`);
        } else {
            console.warn('[DB] No IPv4 address found via dns lookup');
        }
      } catch (e) {
        console.warn('[DB] DNS resolution failed, using original host');
      }
    }

    return {
      host: ip,
      port: parseInt(url.port || '5432'),
      database: url.pathname.slice(1),
      user: url.username,
      password: url.password,
      ssl: {
        servername: host, // SNI requires the original hostname
        rejectUnauthorized: true
      },
      connectionTimeoutMillis: 30000
    };
  } catch (error) {
    console.error('[DB] Error parsing DATABASE_URL', error);
    return defaultConfig;
  }
};

const pool = new Pool(getPoolConfig());

export const query = (text: string, params?: any[]) => pool.query(text, params);

export default pool;
