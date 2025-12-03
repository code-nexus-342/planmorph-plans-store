import { Pool } from 'pg';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

async function resetAdmin() {
  try {
    const password = await bcrypt.hash('admin123', 10);
    await pool.query(
      'UPDATE users SET password_hash = $1 WHERE email = $2',
      [password, 'admin@planmorph.com']
    );
    console.log('Admin password reset to: admin123');
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

resetAdmin();
