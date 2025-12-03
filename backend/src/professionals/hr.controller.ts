import { Request, Response } from 'express';
import pool from '../db';

// HR Manager Dashboard
export const getHRDashboard = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;

  try {
    // Get employee overview
    const employeeStats = await pool.query(`
      SELECT 
        COUNT(DISTINCT employee_id) as total_employees,
        COUNT(CASE WHEN record_type = 'employee' AND metadata->>'status' = 'active' THEN 1 END) as active_employees,
        COUNT(CASE WHEN record_type = 'employee' AND metadata->>'status' = 'on_leave' THEN 1 END) as on_leave
      FROM hr_records
      WHERE record_type = 'employee'
    `);

    // Get payment statistics
    const paymentStats = await pool.query(`
      SELECT 
        COUNT(*) as total_payments,
        COUNT(CASE WHEN payment_status = 'pending' THEN 1 END) as pending_payments,
        COUNT(CASE WHEN payment_status = 'released' THEN 1 END) as released_payments,
        COALESCE(SUM(CASE WHEN payment_status = 'pending' THEN amount ELSE 0 END), 0) as pending_amount,
        COALESCE(SUM(CASE WHEN payment_status = 'released' THEN amount ELSE 0 END), 0) as released_amount
      FROM hr_records
      WHERE record_type = 'payment'
    `);

    // Get recent hires (last 30 days)
    const recentHires = await pool.query(`
      SELECT *
      FROM hr_records
      WHERE record_type = 'employee' 
        AND created_at >= NOW() - INTERVAL '30 days'
      ORDER BY created_at DESC
      LIMIT 5
    `);

    // Get pending payments
    const pendingPayments = await pool.query(`
      SELECT *
      FROM hr_records
      WHERE record_type = 'payment' 
        AND payment_status = 'pending'
      ORDER BY created_at ASC
      LIMIT 10
    `);

    // Get department breakdown
    const departmentBreakdown = await pool.query(`
      SELECT 
        department,
        COUNT(*) as employee_count
      FROM hr_records
      WHERE record_type = 'employee'
      GROUP BY department
      ORDER BY employee_count DESC
    `);

    res.json({
      employeeStats: employeeStats.rows[0],
      paymentStats: paymentStats.rows[0],
      recentHires: recentHires.rows,
      pendingPayments: pendingPayments.rows,
      departmentBreakdown: departmentBreakdown.rows
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get all employees
export const getEmployees = async (req: Request, res: Response) => {
  const { department, status } = req.query;

  try {
    let query = `SELECT * FROM hr_records WHERE record_type = 'employee'`;
    const params: any[] = [];

    if (department) {
      params.push(department);
      query += ` AND department = $${params.length}`;
    }

    if (status) {
      params.push(status);
      query += ` AND metadata->>'status' = $${params.length}`;
    }

    query += ' ORDER BY created_at DESC';

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Add employee
export const addEmployee = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const { employee_name, position, department, metadata } = req.body;

  if (!employee_name || !position) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO hr_records 
      (created_by, record_type, employee_name, position, department, metadata)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *`,
      [userId, 'employee', employee_name, position, department, { ...metadata, status: 'active' }]
    );

    // Log activity
    await pool.query(
      `INSERT INTO professional_activities (user_id, activity_type, entity_type, entity_id, description)
      VALUES ($1, $2, $3, $4, $5)`,
      [userId, 'create', 'employee', result.rows[0].id, `Added new employee: ${employee_name}`]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update employee
export const updateEmployee = async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = (req as any).user.id;
  const { employee_name, position, department, metadata } = req.body;

  try {
    const result = await pool.query(
      `UPDATE hr_records 
      SET employee_name = COALESCE($1, employee_name),
          position = COALESCE($2, position),
          department = COALESCE($3, department),
          metadata = COALESCE($4, metadata),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $5 AND record_type = 'employee'
      RETURNING *`,
      [employee_name, position, department, metadata, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    // Log activity
    await pool.query(
      `INSERT INTO professional_activities (user_id, activity_type, entity_type, entity_id, description)
      VALUES ($1, $2, $3, $4, $5)`,
      [userId, 'update', 'employee', id, `Updated employee record`]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get payments
export const getPayments = async (req: Request, res: Response) => {
  const { status, employee_id } = req.query;

  try {
    let query = `SELECT * FROM hr_records WHERE record_type = 'payment'`;
    const params: any[] = [];

    if (status) {
      params.push(status);
      query += ` AND payment_status = $${params.length}`;
    }

    if (employee_id) {
      params.push(employee_id);
      query += ` AND employee_id = $${params.length}`;
    }

    query += ' ORDER BY created_at DESC';

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Release payment
export const releasePayment = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const { employee_id, employee_name, amount, description, payment_date } = req.body;

  if (!employee_name || !amount) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    await pool.query('BEGIN');

    // Create payment record
    const result = await pool.query(
      `INSERT INTO hr_records 
      (created_by, record_type, employee_id, employee_name, amount, payment_status, payment_date, description)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *`,
      [userId, 'payment', employee_id, employee_name, amount, 'released', payment_date || new Date(), description]
    );

    // Log activity
    await pool.query(
      `INSERT INTO professional_activities (user_id, activity_type, entity_type, entity_id, description)
      VALUES ($1, $2, $3, $4, $5)`,
      [userId, 'create', 'payment', result.rows[0].id, `Released payment of $${amount} to ${employee_name}`]
    );

    await pool.query('COMMIT');

    res.status(201).json(result.rows[0]);
  } catch (error) {
    await pool.query('ROLLBACK');
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update payment status
export const updatePaymentStatus = async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = (req as any).user.id;
  const { payment_status } = req.body;

  if (!payment_status || !['pending', 'released', 'cancelled'].includes(payment_status)) {
    return res.status(400).json({ message: 'Invalid payment status' });
  }

  try {
    const result = await pool.query(
      `UPDATE hr_records 
      SET payment_status = $1,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $2 AND record_type = 'payment'
      RETURNING *`,
      [payment_status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    // Log activity
    await pool.query(
      `INSERT INTO professional_activities (user_id, activity_type, entity_type, entity_id, description)
      VALUES ($1, $2, $3, $4, $5)`,
      [userId, 'update', 'payment', id, `Updated payment status to ${payment_status}`]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
