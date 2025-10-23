import { Pool } from 'pg';
import { config } from '../config';

const pool = new Pool({
  connectionString: config.database.url,
  ssl: { rejectUnauthorized: false }
});

async function listTables() {
  try {
    const result = await pool.query(`
      SELECT 
        schemaname,
        tablename,
        tableowner
      FROM pg_tables 
      WHERE schemaname = 'public' 
      ORDER BY tablename;
    `);
    
    console.log('\n✅ Database Tables:\n');
    console.log('Total tables:', result.rows.length);
    console.log('\n');
    
    result.rows.forEach((row, index) => {
      console.log(`${index + 1}. ${row.tablename}`);
    });
    
    console.log('\n');
    
    // Get table row counts
    console.log('📊 Table Row Counts:\n');
    for (const row of result.rows) {
      const countResult = await pool.query(`SELECT COUNT(*) FROM ${row.tablename}`);
      console.log(`${row.tablename}: ${countResult.rows[0].count} rows`);
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await pool.end();
  }
}

listTables();
