import { Request, Response } from 'express';
import pool from '../db';

// Finance Manager Dashboard
export const getFinanceDashboard = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;

  try {
    // Get financial overview
    const overview = await pool.query(`
      SELECT 
        COALESCE(SUM(CASE WHEN record_type = 'income' THEN amount ELSE 0 END), 0) as total_income,
        COALESCE(SUM(CASE WHEN record_type = 'expense' THEN amount ELSE 0 END), 0) as total_expenses,
        COALESCE(SUM(CASE WHEN record_type = 'income' THEN amount ELSE -amount END), 0) as net_profit,
        COUNT(CASE WHEN transaction_date >= NOW() - INTERVAL '30 days' THEN 1 END) as recent_transactions
      FROM financial_records
    `);

    // Get monthly trends (last 6 months)
    const trends = await pool.query(`
      SELECT 
        TO_CHAR(DATE_TRUNC('month', transaction_date), 'Mon YYYY') as month,
        record_type,
        SUM(amount) as total
      FROM financial_records
      WHERE transaction_date >= NOW() - INTERVAL '6 months'
      GROUP BY DATE_TRUNC('month', transaction_date), record_type
      ORDER BY DATE_TRUNC('month', transaction_date)
    `);

    // Get recent transactions
    const recentTransactions = await pool.query(`
      SELECT *
      FROM financial_records
      ORDER BY transaction_date DESC, created_at DESC
      LIMIT 10
    `);

    // Get category breakdown
    const categoryBreakdown = await pool.query(`
      SELECT 
        category,
        record_type,
        SUM(amount) as total,
        COUNT(*) as count
      FROM financial_records
      WHERE transaction_date >= NOW() - INTERVAL '30 days'
      GROUP BY category, record_type
      ORDER BY total DESC
    `);

    res.json({
      overview: overview.rows[0],
      trends: trends.rows,
      recentTransactions: recentTransactions.rows,
      categoryBreakdown: categoryBreakdown.rows
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get all financial records
export const getFinancialRecords = async (req: Request, res: Response) => {
  const { record_type, category, start_date, end_date } = req.query;

  try {
    let query = 'SELECT * FROM financial_records WHERE 1=1';
    const params: any[] = [];

    if (record_type) {
      params.push(record_type);
      query += ` AND record_type = $${params.length}`;
    }

    if (category) {
      params.push(category);
      query += ` AND category = $${params.length}`;
    }

    if (start_date) {
      params.push(start_date);
      query += ` AND transaction_date >= $${params.length}`;
    }

    if (end_date) {
      params.push(end_date);
      query += ` AND transaction_date <= $${params.length}`;
    }

    query += ' ORDER BY transaction_date DESC, created_at DESC';

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Create financial record
export const createFinancialRecord = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const { record_type, category, amount, description, transaction_date, reference_number, metadata } = req.body;

  if (!record_type || !amount || !transaction_date) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO financial_records 
      (created_by, record_type, category, amount, description, transaction_date, reference_number, metadata)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *`,
      [userId, record_type, category, amount, description, transaction_date, reference_number, metadata || {}]
    );

    // Log activity
    await pool.query(
      `INSERT INTO professional_activities (user_id, activity_type, entity_type, entity_id, description)
      VALUES ($1, $2, $3, $4, $5)`,
      [userId, 'create', 'financial_record', result.rows[0].id, `Created ${record_type} record: ${description || category}`]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update financial record
export const updateFinancialRecord = async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = (req as any).user.id;
  const { record_type, category, amount, description, transaction_date, reference_number, metadata } = req.body;

  try {
    const result = await pool.query(
      `UPDATE financial_records 
      SET record_type = COALESCE($1, record_type),
          category = COALESCE($2, category),
          amount = COALESCE($3, amount),
          description = COALESCE($4, description),
          transaction_date = COALESCE($5, transaction_date),
          reference_number = COALESCE($6, reference_number),
          metadata = COALESCE($7, metadata),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $8
      RETURNING *`,
      [record_type, category, amount, description, transaction_date, reference_number, metadata, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Financial record not found' });
    }

    // Log activity
    await pool.query(
      `INSERT INTO professional_activities (user_id, activity_type, entity_type, entity_id, description)
      VALUES ($1, $2, $3, $4, $5)`,
      [userId, 'update', 'financial_record', id, `Updated financial record`]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Generate financial report
export const generateFinancialReport = async (req: Request, res: Response) => {
  const { start_date, end_date, report_type } = req.query;

  try {
    const params: any[] = [];
    let dateFilter = '';

    if (start_date && end_date) {
      params.push(start_date, end_date);
      dateFilter = `WHERE transaction_date BETWEEN $1 AND $2`;
    } else {
      // Default to current month
      dateFilter = `WHERE transaction_date >= DATE_TRUNC('month', CURRENT_DATE)`;
    }

    // Summary report
    const summary = await pool.query(`
      SELECT 
        record_type,
        COUNT(*) as transaction_count,
        SUM(amount) as total_amount,
        AVG(amount) as average_amount
      FROM financial_records
      ${dateFilter}
      GROUP BY record_type
    `, params);

    // Category breakdown
    const categoryBreakdown = await pool.query(`
      SELECT 
        category,
        record_type,
        COUNT(*) as count,
        SUM(amount) as total
      FROM financial_records
      ${dateFilter}
      GROUP BY category, record_type
      ORDER BY total DESC
    `, params);

    // Daily trends
    const dailyTrends = await pool.query(`
      SELECT 
        transaction_date::date as date,
        record_type,
        SUM(amount) as total
      FROM financial_records
      ${dateFilter}
      GROUP BY transaction_date::date, record_type
      ORDER BY transaction_date::date
    `, params);

    res.json({
      summary: summary.rows,
      categoryBreakdown: categoryBreakdown.rows,
      dailyTrends: dailyTrends.rows,
      reportPeriod: {
        start: start_date || 'Current month',
        end: end_date || 'Current month'
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
