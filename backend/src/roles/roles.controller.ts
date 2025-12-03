import { Request, Response } from 'express';
import pool from '../db';

// Get public job roles (open positions)
export const getPublicJobRoles = async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`
      SELECT id, title, role_type, description, requirements, responsibilities, 
             qualifications, department, created_at
      FROM job_roles
      WHERE status = 'open'
      ORDER BY created_at DESC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get single job role details
export const getJobRole = async (req: Request, res: Response) => {
  const { id } = req.params;
  
  try {
    const result = await pool.query(`
      SELECT id, title, role_type, description, requirements, responsibilities, 
             qualifications, department, created_at
      FROM job_roles
      WHERE id = $1 AND status = 'open'
    `, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Job role not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Submit role application
export const submitRoleApplication = async (req: Request, res: Response) => {
  const {
    role_id,
    full_name,
    email,
    phone_number,
    bio,
    experience_years,
    portfolio_url,
    cv_url,
    certificates_urls,
    id_document_url,
    cover_letter
  } = req.body;

  // Validation
  if (!role_id || !full_name || !email || !cv_url) {
    return res.status(400).json({ 
      message: 'Missing required fields: role_id, full_name, email, cv_url' 
    });
  }

  try {
    // Check if role exists and is open
    const roleCheck = await pool.query(
      'SELECT id FROM job_roles WHERE id = $1 AND status = $2',
      [role_id, 'open']
    );

    if (roleCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Job role not found or not accepting applications' });
    }

    // Check for duplicate application
    const duplicateCheck = await pool.query(
      'SELECT id FROM role_applications WHERE email = $1 AND role_id = $2 AND status = $3',
      [email, role_id, 'pending']
    );

    if (duplicateCheck.rows.length > 0) {
      return res.status(409).json({ 
        message: 'You have already applied for this position. Please wait for review.' 
      });
    }

    const result = await pool.query(
      `INSERT INTO role_applications 
      (role_id, full_name, email, phone_number, bio, experience_years, 
       portfolio_url, cv_url, certificates_urls, id_document_url, cover_letter, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING id`,
      [
        role_id,
        full_name,
        email,
        phone_number,
        bio,
        experience_years || 0,
        portfolio_url,
        cv_url,
        certificates_urls || [],
        id_document_url,
        cover_letter,
        'pending'
      ]
    );

    res.status(201).json({ 
      message: 'Application submitted successfully',
      application_id: result.rows[0].id
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
