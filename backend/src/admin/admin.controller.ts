import { Request, Response } from 'express';
import pool from '../db';
import bcrypt from 'bcryptjs';

// ============================================
// LEGACY FUNCTIONS (for backward compatibility)
// ============================================

export const getArchitectApplications = async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`
      SELECT * FROM architect_applications
      WHERE status = 'pending'
      ORDER BY created_at ASC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const approveArchitect = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!['approved', 'rejected'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }

  try {
    await pool.query('BEGIN');

    const appResult = await pool.query('SELECT * FROM architect_applications WHERE id = $1', [id]);
    const application = appResult.rows[0];

    if (!application) {
      await pool.query('ROLLBACK');
      return res.status(404).json({ message: 'Application not found' });
    }

    if (status === 'rejected') {
      await pool.query('UPDATE architect_applications SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2', ['rejected', id]);
      await pool.query('COMMIT');
      return res.json({ message: 'Application rejected' });
    }

    const password = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(password, 10);

    const emailCheck = await pool.query('SELECT id FROM users WHERE email = $1', [application.email]);
    if (emailCheck.rows.length > 0) {
      await pool.query('ROLLBACK');
      return res.status(409).json({ message: 'Email already associated with an account' });
    }

    const userResult = await pool.query(
      'INSERT INTO users (email, password_hash, role, is_verified) VALUES ($1, $2, $3, $4) RETURNING id',
      [application.email, hashedPassword, 'architect', true]
    );
    const userId = userResult.rows[0].id;

    await pool.query(
      `INSERT INTO architect_profiles 
      (user_id, full_name, phone_number, bio, experience_years, portfolio_url, cv_url, id_document_url, status) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [userId, application.full_name, application.phone_number, application.bio, application.experience_years, application.portfolio_url, application.cv_url, application.id_document_url, 'approved']
    );

    await pool.query('UPDATE architect_applications SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2', ['approved', id]);

    await pool.query('COMMIT');

    console.log(`[MOCK EMAIL] To: ${application.email}, Credentials - Email: ${application.email}, Password: ${password}`);

    res.json({ message: 'Application approved and account created' });
  } catch (error) {
    await pool.query('ROLLBACK');
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getUsers = async (req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT id, email, role, created_at FROM users ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getDesigns = async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`
      SELECT d.*, u.email as architect_email
      FROM designs d
      JOIN users u ON d.architect_id = u.id
      ORDER BY d.created_at DESC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// ============================================
// NEW ENHANCED FUNCTIONS
// ============================================


// Get comprehensive analytics for admin dashboard
export const getAnalytics = async (req: Request, res: Response) => {
  try {
    // Get user statistics
    const userStats = await pool.query(`
      SELECT 
        COUNT(*) as total_users,
        COUNT(CASE WHEN role = 'client' THEN 1 END) as clients,
        COUNT(CASE WHEN role = 'architect' THEN 1 END) as architects,
        COUNT(CASE WHEN role = 'finance_manager' THEN 1 END) as finance_managers,
        COUNT(CASE WHEN role = 'hr_manager' THEN 1 END) as hr_managers,
        COUNT(CASE WHEN role = 'civil_engineer' THEN 1 END) as civil_engineers,
        COUNT(CASE WHEN role = 'surveyor' THEN 1 END) as surveyors,
        COUNT(CASE WHEN created_at >= NOW() - INTERVAL '30 days' THEN 1 END) as new_users_30d
      FROM users
    `);

    // Get design statistics
    const designStats = await pool.query(`
      SELECT 
        COUNT(*) as total_designs,
        COUNT(CASE WHEN status = 'published' THEN 1 END) as published_designs,
        COUNT(CASE WHEN status = 'draft' THEN 1 END) as draft_designs,
        COUNT(CASE WHEN created_at >= NOW() - INTERVAL '30 days' THEN 1 END) as new_designs_30d
      FROM designs
    `);

    // Get application statistics
    const appStats = await pool.query(`
      SELECT 
        COUNT(*) as total_applications,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_applications,
        COUNT(CASE WHEN status = 'approved' THEN 1 END) as approved_applications,
        COUNT(CASE WHEN status = 'rejected' THEN 1 END) as rejected_applications
      FROM role_applications
    `);

    // Get purchase/revenue statistics
    const revenueStats = await pool.query(`
      SELECT 
        COUNT(*) as total_purchases,
        COALESCE(SUM(amount), 0) as total_revenue,
        COALESCE(SUM(CASE WHEN created_at >= NOW() - INTERVAL '30 days' THEN amount ELSE 0 END), 0) as revenue_30d
      FROM purchases
    `);

    // Get professional activity counts
    const activityStats = await pool.query(`
      SELECT 
        COUNT(*) as total_activities,
        COUNT(CASE WHEN created_at >= NOW() - INTERVAL '7 days' THEN 1 END) as activities_7d
      FROM professional_activities
    `);

    // Get user growth over last 12 months
    const userGrowth = await pool.query(`
      SELECT 
        TO_CHAR(DATE_TRUNC('month', created_at), 'Mon YYYY') as month,
        COUNT(*) as count
      FROM users
      WHERE created_at >= NOW() - INTERVAL '12 months'
      GROUP BY DATE_TRUNC('month', created_at)
      ORDER BY DATE_TRUNC('month', created_at)
    `);

    // Get application trends over last 6 months
    const applicationTrends = await pool.query(`
      SELECT 
        TO_CHAR(DATE_TRUNC('month', created_at), 'Mon YYYY') as month,
        COUNT(*) as count,
        status
      FROM role_applications
      WHERE created_at >= NOW() - INTERVAL '6 months'
      GROUP BY DATE_TRUNC('month', created_at), status
      ORDER BY DATE_TRUNC('month', created_at)
    `);

    // Get recent activities
    const recentActivities = await pool.query(`
      SELECT 
        pa.id,
        pa.activity_type,
        pa.entity_type,
        pa.description,
        pa.created_at,
        u.email as user_email,
        pp.full_name as user_name
      FROM professional_activities pa
      JOIN users u ON pa.user_id = u.id
      LEFT JOIN professional_profiles pp ON pa.user_id = pp.user_id
      ORDER BY pa.created_at DESC
      LIMIT 20
    `);

    res.json({
      overview: {
        users: userStats.rows[0],
        designs: designStats.rows[0],
        applications: appStats.rows[0],
        revenue: revenueStats.rows[0],
        activities: activityStats.rows[0]
      },
      trends: {
        userGrowth: userGrowth.rows,
        applicationTrends: applicationTrends.rows
      },
      recentActivities: recentActivities.rows
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get all professionals with their profiles
export const getProfessionals = async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`
      SELECT 
        u.id,
        u.email,
        u.role,
        u.created_at,
        pp.full_name,
        pp.role_type,
        pp.phone_number,
        pp.department,
        pp.experience_years,
        pp.hire_date,
        pp.is_active,
        (SELECT COUNT(*) FROM professional_activities WHERE user_id = u.id) as activity_count
      FROM users u
      LEFT JOIN professional_profiles pp ON u.id = pp.user_id
      WHERE u.role IN ('architect', 'finance_manager', 'hr_manager', 'civil_engineer', 'surveyor')
      ORDER BY u.created_at DESC
    `);
    
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get all job roles (admin view)
export const getJobRoles = async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`
      SELECT 
        jr.*,
        u.email as created_by_email,
        (SELECT COUNT(*) FROM role_applications WHERE role_id = jr.id) as application_count
      FROM job_roles jr
      LEFT JOIN users u ON jr.created_by = u.id
      ORDER BY jr.created_at DESC
    `);
    
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Create job role
export const createJobRole = async (req: Request, res: Response) => {
  const {
    title,
    role_type,
    description,
    requirements,
    responsibilities,
    qualifications,
    department,
    status
  } = req.body;

  const userId = (req as any).user.id;

  if (!title || !role_type || !description) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO job_roles 
      (title, role_type, description, requirements, responsibilities, qualifications, department, status, created_by)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *`,
      [title, role_type, description, requirements || [], responsibilities || [], qualifications || [], department, status || 'draft', userId]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update job role
export const updateJobRole = async (req: Request, res: Response) => {
  const { id } = req.params;
  const {
    title,
    role_type,
    description,
    requirements,
    responsibilities,
    qualifications,
    department,
    status
  } = req.body;

  try {
    const result = await pool.query(
      `UPDATE job_roles 
      SET title = COALESCE($1, title),
          role_type = COALESCE($2, role_type),
          description = COALESCE($3, description),
          requirements = COALESCE($4, requirements),
          responsibilities = COALESCE($5, responsibilities),
          qualifications = COALESCE($6, qualifications),
          department = COALESCE($7, department),
          status = COALESCE($8, status),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $9
      RETURNING *`,
      [title, role_type, description, requirements, responsibilities, qualifications, department, status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Job role not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete job role
export const deleteJobRole = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const result = await pool.query('DELETE FROM job_roles WHERE id = $1 RETURNING id', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Job role not found' });
    }

    res.json({ message: 'Job role deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get all role applications
export const getRoleApplications = async (req: Request, res: Response) => {
  const { status, role_id } = req.query;

  try {
    let query = `
      SELECT 
        ra.*,
        jr.title as role_title,
        jr.role_type
      FROM role_applications ra
      JOIN job_roles jr ON ra.role_id = jr.id
      WHERE 1=1
    `;
    const params: any[] = [];

    if (status) {
      params.push(status);
      query += ` AND ra.status = $${params.length}`;
    }

    if (role_id) {
      params.push(role_id);
      query += ` AND ra.role_id = $${params.length}`;
    }

    query += ' ORDER BY ra.created_at DESC';

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Approve role application
export const approveRoleApplication = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { review_notes } = req.body;
  const reviewerId = (req as any).user.id;

  try {
    await pool.query('BEGIN');

    // Get application details
    const appResult = await pool.query(`
      SELECT ra.*, jr.role_type 
      FROM role_applications ra
      JOIN job_roles jr ON ra.role_id = jr.id
      WHERE ra.id = $1
    `, [id]);
    
    const application = appResult.rows[0];

    if (!application) {
      await pool.query('ROLLBACK');
      return res.status(404).json({ message: 'Application not found' });
    }

    if (application.status !== 'pending') {
      await pool.query('ROLLBACK');
      return res.status(400).json({ message: 'Application has already been reviewed' });
    }

    // Check if email already exists
    const emailCheck = await pool.query('SELECT id FROM users WHERE email = $1', [application.email]);
    if (emailCheck.rows.length > 0) {
      await pool.query('ROLLBACK');
      return res.status(409).json({ message: 'Email already associated with an account' });
    }

    // Generate random password
    const password = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user account
    const userResult = await pool.query(
      'INSERT INTO users (email, password_hash, role, is_verified) VALUES ($1, $2, $3, $4) RETURNING id',
      [application.email, hashedPassword, application.role_type, true]
    );
    const userId = userResult.rows[0].id;

    // Create professional profile
    await pool.query(
      `INSERT INTO professional_profiles 
      (user_id, role_type, full_name, phone_number, bio, experience_years, portfolio_url, hire_date, is_active)
      VALUES ($1, $2, $3, $4, $5, $6, $7, CURRENT_DATE, $8)`,
      [userId, application.role_type, application.full_name, application.phone_number, application.bio, application.experience_years, application.portfolio_url, true]
    );

    // Update application status
    await pool.query(
      'UPDATE role_applications SET status = $1, reviewed_by = $2, review_notes = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4',
      ['approved', reviewerId, review_notes, id]
    );

    // Log activity
    await pool.query(
      `INSERT INTO professional_activities (user_id, activity_type, entity_type, entity_id, description)
      VALUES ($1, $2, $3, $4, $5)`,
      [reviewerId, 'approve', 'application', id, `Approved application for ${application.full_name}`]
    );

    await pool.query('COMMIT');

    // Mock sending email with credentials
    console.log(`[MOCK EMAIL] To: ${application.email}, Credentials - Email: ${application.email}, Password: ${password}`);

    res.json({ message: 'Application approved and account created', user_id: userId });
  } catch (error) {
    await pool.query('ROLLBACK');
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Reject role application
export const rejectRoleApplication = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { review_notes } = req.body;
  const reviewerId = (req as any).user.id;

  try {
    const result = await pool.query(
      'UPDATE role_applications SET status = $1, reviewed_by = $2, review_notes = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4 RETURNING *',
      ['rejected', reviewerId, review_notes, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Log activity
    await pool.query(
      `INSERT INTO professional_activities (user_id, activity_type, entity_type, entity_id, description)
      VALUES ($1, $2, $3, $4, $5)`,
      [reviewerId, 'reject', 'application', id, `Rejected application for ${result.rows[0].full_name}`]
    );

    res.json({ message: 'Application rejected' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
