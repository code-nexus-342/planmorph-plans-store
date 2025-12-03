import { Pool } from 'pg';
import dotenv from 'dotenv';
import { getPoolConfig } from './index';

dotenv.config();

const pool = new Pool(getPoolConfig());

async function listTables() {
  try {
    const res = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    console.log('Tables:', res.rows.map(r => r.table_name));
    
    // Check columns for contact_messages
    const contactCols = await pool.query(`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'contact_messages'
    `);
    console.log('contact_messages columns:', contactCols.rows);

    await pool.end();
  } catch (error) {
    console.error('Error:', error);
    await pool.end();
  }
}

listTables();
