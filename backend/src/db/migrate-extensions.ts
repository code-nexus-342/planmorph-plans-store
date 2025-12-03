import pool from './index';
import fs from 'fs';
import path from 'path';

async function migrateExtensions() {
  try {
    console.log('Starting schema extensions migration...');
    
    const schemaPath = path.join(__dirname, 'schema-extensions.sql');
    const schema = fs.readFileSync(schemaPath, 'utf-8');
    
    await pool.query(schema);
    
    console.log('Schema extensions migration completed successfully!');
    console.log('\nNew tables created:');
    console.log('  - job_roles');
    console.log('  - role_applications');
    console.log('  - professional_profiles');
    console.log('  - professional_activities');
    console.log('  - analytics_metrics');
    console.log('  - financial_records');
    console.log('  - hr_records');
    console.log('  - survey_records');
    console.log('  - structural_drawings');
    console.log('\nRun "npm run seed:extensions" to populate initial data');
    
    process.exit(0);
  } catch (error) {
    console.error('Error running schema extensions migration:', error);
    process.exit(1);
  }
}

migrateExtensions();
