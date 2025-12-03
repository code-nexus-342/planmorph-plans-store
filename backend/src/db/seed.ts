#!/usr/bin/env ts-node
import { Pool } from 'pg';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { getPoolConfig } from './index';

dotenv.config();

const pool = new Pool(getPoolConfig());

async function seed() {
  try {
    console.log('Starting database seeding...');
    
    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 10);
    const adminResult = await pool.query(
      'INSERT INTO users (email, password_hash, role) VALUES ($1, $2, $3) ON CONFLICT (email) DO NOTHING RETURNING id',
      ['admin@planmorph.com', adminPassword, 'admin']
    );
    console.log('✓ Admin user created (email: admin@planmorph.com, password: admin123)');

    // Create test architect
    const architectPassword = await bcrypt.hash('architect123', 10);
    const architectResult = await pool.query(
      'INSERT INTO users (email, password_hash, role) VALUES ($1, $2, $3) ON CONFLICT (email) DO NOTHING RETURNING id',
      ['architect@test.com', architectPassword, 'architect']
    );
    
    if (architectResult.rows.length > 0) {
      const architectId = architectResult.rows[0].id;
      
      // Create architect profile
      await pool.query(
        `INSERT INTO architect_profiles 
        (user_id, full_name, phone_number, bio, experience_years, status) 
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (user_id) DO NOTHING`,
        [
          architectId,
          'John Architect',
          '+1234567890',
          'Experienced architect with 10+ years in residential design',
          10,
          'approved'
        ]
      );
      console.log('✓ Test architect created (email: architect@test.com, password: architect123)');

      // Create sample design
      const designResult = await pool.query(
        `INSERT INTO designs 
        (architect_id, title, description, price, specifications, status) 
        VALUES ($1, $2, $3, $4, $5, $6) 
        RETURNING id`,
        [
          architectId,
          'Modern Villa with Pool',
          'A stunning modern villa featuring open-plan living, floor-to-ceiling windows, and a luxury infinity pool. Perfect for families seeking contemporary luxury.',
          125000,
          JSON.stringify({
            bedrooms: 4,
            bathrooms: 3,
            sqft: 3500,
            stories: 2,
            garage: 2
          }),
          'published'
        ]
      );
      
      const designId = designResult.rows[0].id;
      
      // Add sample media (you would need actual image URLs)
      await pool.query(
        `INSERT INTO design_media (design_id, url, type, is_preview) VALUES 
        ($1, 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800', 'image', true),
        ($1, 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800', 'image', false),
        ($1, 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800', 'image', false)`,
        [designId]
      );
      
      console.log('✓ Sample design created');
    }

    // Create test client
    const clientPassword = await bcrypt.hash('client123', 10);
    await pool.query(
      'INSERT INTO users (email, password_hash, role) VALUES ($1, $2, $3) ON CONFLICT (email) DO NOTHING',
      ['client@test.com', clientPassword, 'client']
    );
    console.log('✓ Test client created (email: client@test.com, password: client123)');

    console.log('\n✓ Database seeded successfully');
    console.log('\nTest Accounts:');
    console.log('  Admin: admin@planmorph.com / admin123');
    console.log('  Architect: architect@test.com / architect123');
    console.log('  Client: client@test.com / client123');
    
    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    await pool.end();
    process.exit(1);
  }
}

seed();
