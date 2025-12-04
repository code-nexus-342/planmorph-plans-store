import { Request, Response } from 'express';
import pool from '../db';
import bcrypt from 'bcryptjs';

// ============================================
// LEGACY FUNCTIONS (for backward compatibility)
// ============================================

export const getArchitectApplications = async (req: Request, res: Response) => {
  // Deprecated, redirecting to getRoleApplications logic if needed or just returning empty
  try {
    const result = await pool.query(`
      SELECT * FROM professional_applications
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
    // Deprecated wrapper around approveRoleApplication
    return approveRoleApplication(req, res);
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
      JOIN users u ON d.professional_id = u.id
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
        COUNT(CASE WHEN role = 'professional' THEN 1 END) as professionals,
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
      FROM professional_applications
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

    // Get most purchased designs
    const topDesigns = await pool.query(`
      SELECT 
        d.id,
        d.title,
        d.price,
        COUNT(p.id) as purchase_count,
        SUM(p.amount) as total_revenue,
        (SELECT url FROM design_media dm WHERE dm.design_id = d.id AND dm.is_preview = true LIMIT 1) as preview_url,
        prof.full_name as architect_name
      FROM designs d
      JOIN purchases p ON d.id = p.design_id
      JOIN professionals prof ON d.professional_id = prof.id
      GROUP BY d.id, prof.full_name
      ORDER BY purchase_count DESC
      LIMIT 5
    `);

    // Get professional role breakdown
    const roleBreakdown = await pool.query(`
      SELECT 
        pr.name as role_name,
        COUNT(p.user_id) as count
      FROM professionals p
      JOIN professional_roles pr ON p.professional_role_id = pr.id
      GROUP BY pr.name
      ORDER BY count DESC
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
      FROM professional_applications
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
        p.full_name as user_name
      FROM professional_activities pa
      JOIN users u ON pa.user_id = u.id
      LEFT JOIN professionals p ON pa.user_id = p.user_id
      ORDER BY pa.created_at DESC
      LIMIT 20
    `);

    res.json({
      overview: {
        users: userStats.rows[0],
        designs: designStats.rows[0],
        applications: appStats.rows[0],
        revenue: revenueStats.rows[0],
        activities: activityStats.rows[0],
        roleBreakdown: roleBreakdown.rows
      },
      trends: {
        userGrowth: userGrowth.rows,
        applicationTrends: applicationTrends.rows
      },
      recentActivities: recentActivities.rows,
      topDesigns: topDesigns.rows
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
        p.full_name,
        pr.name as role_name,
        p.phone_number,
        p.experience_years,
        p.status,
        (SELECT COUNT(*) FROM professional_activities WHERE user_id = u.id) as activity_count
      FROM users u
      LEFT JOIN professionals p ON u.id = p.user_id
      LEFT JOIN professional_roles pr ON p.professional_role_id = pr.id
      WHERE u.role = 'professional'
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
        pr.*,
        (SELECT COUNT(*) FROM professional_applications WHERE professional_role_id = pr.id) as application_count
      FROM professional_roles pr
      ORDER BY pr.created_at DESC
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
    name,
    description
  } = req.body;

  if (!name) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO professional_roles 
      (name, description)
      VALUES ($1, $2)
      RETURNING *`,
      [name, description]
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
    name,
    description,
    is_active
  } = req.body;

  try {
    const result = await pool.query(
      `UPDATE professional_roles 
      SET name = COALESCE($1, name),
          description = COALESCE($2, description),
          is_active = COALESCE($3, is_active)
      WHERE id = $4
      RETURNING *`,
      [name, description, is_active, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Role not found' });
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
    const result = await pool.query('DELETE FROM professional_roles WHERE id = $1 RETURNING id', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Role not found' });
    }

    res.json({ message: 'Role deleted successfully' });
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
        pa.*,
        pr.name as role_name
      FROM professional_applications pa
      LEFT JOIN professional_roles pr ON pa.professional_role_id = pr.id
      WHERE 1=1
    `;
    const params: any[] = [];

    if (status) {
      params.push(status);
      query += ` AND pa.status = $${params.length}`;
    }

    if (role_id) {
      params.push(role_id);
      query += ` AND pa.professional_role_id = $${params.length}`;
    }

    query += ' ORDER BY pa.created_at DESC';

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Approve role application (2-step)
export const approveRoleApplication = async (req: Request, res: Response) => {
  const { id } = req.params;
  const reviewerId = (req as any).user.id; // This is user_id from token

  try {
    await pool.query('BEGIN');

    // Get application details
    const appResult = await pool.query(`
      SELECT pa.*, pr.name as role_name
      FROM professional_applications pa
      LEFT JOIN professional_roles pr ON pa.professional_role_id = pr.id
      WHERE pa.id = $1
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

    // Check if already approved by this admin
    if (application.approved_by && application.approved_by.includes(reviewerId)) {
        await pool.query('ROLLBACK');
        return res.status(400).json({ message: 'You have already approved this application' });
    }

    // Add admin to approved_by
    const updateResult = await pool.query(
        'UPDATE professional_applications SET approved_by = array_append(approved_by, $1) WHERE id = $2 RETURNING approved_by',
        [reviewerId, id]
    );

    const approvedBy = updateResult.rows[0].approved_by;

    // Check if we have 2 approvals
    if (approvedBy.length < 2) {
        await pool.query('COMMIT');
        return res.json({ message: 'Approval recorded. One more approval needed.', approvals: approvedBy.length });
    }

    // Proceed with final approval (create professional account)

    // Check if email already exists in professionals table
    const emailCheck = await pool.query('SELECT id FROM professionals WHERE email = $1', [application.email]);
    if (emailCheck.rows.length > 0) {
      await pool.query('ROLLBACK');
      return res.status(409).json({ message: 'Email already associated with a professional account' });
    }

    // Handle custom role creation if needed
    let roleId = application.professional_role_id;
    if (!roleId && application.custom_role_name) {
        // Create new role
        const newRole = await pool.query(
            'INSERT INTO professional_roles (name, description) VALUES ($1, $2) RETURNING id',
            [application.custom_role_name, 'Custom role created from application']
        );
        roleId = newRole.rows[0].id;
    }

    // Generate random password
    const password = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create professional profile directly
    const profResult = await pool.query(
      `INSERT INTO professionals 
      (email, password_hash, professional_role_id, full_name, phone_number, bio, experience_years, portfolio_url, cv_url, id_document_url, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING id`,
      [application.email, hashedPassword, roleId, application.full_name, application.phone_number, application.bio, application.experience_years, application.portfolio_url, application.cv_url, application.id_document_url, 'approved']
    );
    const professionalId = profResult.rows[0].id;

    // Update application status
    await pool.query(
      'UPDATE professional_applications SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
      ['approved', id]
    );

    // Log activity
    await pool.query(
      `INSERT INTO professional_activities (user_id, activity_type, entity_type, entity_id, description)
      VALUES ($1, $2, $3, $4, $5)`,
      [reviewerId, 'approve', 'application', id, `Final approval for application ${application.full_name}`]
    );

    await pool.query('COMMIT');

    // Mock sending email with credentials
    console.log(`[MOCK EMAIL] To: ${application.email}, Credentials - Email: ${application.email}, Password: ${password}`);

    res.json({ message: 'Application fully approved and professional account created', professional_id: professionalId });
  } catch (error) {
    await pool.query('ROLLBACK');
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Reject role application (2-step)
export const rejectRoleApplication = async (req: Request, res: Response) => {
  const { id } = req.params;
  const reviewerId = (req as any).user.id;

  try {
    // Check if already rejected by this admin
    const appCheck = await pool.query('SELECT rejected_by, status FROM professional_applications WHERE id = $1', [id]);
    if (appCheck.rows.length === 0) {
        return res.status(404).json({ message: 'Application not found' });
    }
    
    if (appCheck.rows[0].status !== 'pending') {
        return res.status(400).json({ message: 'Application has already been reviewed' });
    }

    if (appCheck.rows[0].rejected_by && appCheck.rows[0].rejected_by.includes(reviewerId)) {
        return res.status(400).json({ message: 'You have already rejected this application' });
    }

    // Add admin to rejected_by
    const updateResult = await pool.query(
        'UPDATE professional_applications SET rejected_by = array_append(rejected_by, $1) WHERE id = $2 RETURNING rejected_by',
        [reviewerId, id]
    );

    const rejectedBy = updateResult.rows[0].rejected_by;

    // Check if we have 2 rejections
    if (rejectedBy.length < 2) {
        return res.json({ message: 'Rejection recorded. One more rejection needed.', rejections: rejectedBy.length });
    }

    // Finalize rejection
    const result = await pool.query(
      'UPDATE professional_applications SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      ['rejected', id]
    );

    // Log activity
    await pool.query(
      `INSERT INTO professional_activities (user_id, activity_type, entity_type, entity_id, description)
      VALUES ($1, $2, $3, $4, $5)`,
      [reviewerId, 'reject', 'application', id, `Final rejection for application ${result.rows[0].full_name}`]
    );

    res.json({ message: 'Application fully rejected' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
