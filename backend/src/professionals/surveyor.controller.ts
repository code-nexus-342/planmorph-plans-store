import { Request, Response } from 'express';
import pool from '../db';

// Surveyor Dashboard
export const getSurveyorDashboard = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;

  try {
    // Get survey statistics
    const surveyStats = await pool.query(`
      SELECT 
        COUNT(*) as total_surveys,
        COUNT(CASE WHEN status = 'in_progress' THEN 1 END) as in_progress,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed,
        COUNT(CASE WHEN status = 'reviewed' THEN 1 END) as reviewed,
        COUNT(CASE WHEN created_at >= NOW() - INTERVAL '30 days' THEN 1 END) as recent_surveys
      FROM survey_records
      WHERE surveyor_id = $1
    `, [userId]);

    // Get recent surveys
    const recentSurveys = await pool.query(`
      SELECT *
      FROM survey_records
      WHERE surveyor_id = $1
      ORDER BY created_at DESC
      LIMIT 10
    `, [userId]);

    // Get surveys by type
    const surveysByType = await pool.query(`
      SELECT 
        survey_type,
        COUNT(*) as count,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_count
      FROM survey_records
      WHERE surveyor_id = $1
      GROUP BY survey_type
      ORDER BY count DESC
    `, [userId]);

    // Get completion rate over time (last 6 months)
    const completionTrends = await pool.query(`
      SELECT 
        TO_CHAR(DATE_TRUNC('month', completion_date), 'Mon YYYY') as month,
        COUNT(*) as completed_count
      FROM survey_records
      WHERE surveyor_id = $1 
        AND completion_date >= NOW() - INTERVAL '6 months'
        AND status = 'completed'
      GROUP BY DATE_TRUNC('month', completion_date)
      ORDER BY DATE_TRUNC('month', completion_date)
    `, [userId]);

    res.json({
      surveyStats: surveyStats.rows[0],
      recentSurveys: recentSurveys.rows,
      surveysByType: surveysByType.rows,
      completionTrends: completionTrends.rows
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get all surveys
export const getSurveys = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const { status, survey_type } = req.query;

  try {
    let query = 'SELECT * FROM survey_records WHERE surveyor_id = $1';
    const params: any[] = [userId];

    if (status) {
      params.push(status);
      query += ` AND status = $${params.length}`;
    }

    if (survey_type) {
      params.push(survey_type);
      query += ` AND survey_type = $${params.length}`;
    }

    query += ' ORDER BY created_at DESC';

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get single survey
export const getSurvey = async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = (req as any).user.id;

  try {
    const result = await pool.query(
      'SELECT * FROM survey_records WHERE id = $1 AND surveyor_id = $2',
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Survey not found or unauthorized' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Create survey
export const createSurvey = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const { title, location, coordinates, survey_type, survey_date, findings, metadata } = req.body;

  if (!title || !location || !survey_type) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO survey_records 
      (surveyor_id, title, location, coordinates, survey_type, survey_date, status, findings, metadata)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *`,
      [userId, title, location, coordinates || {}, survey_type, survey_date || new Date(), 'in_progress', findings, metadata || {}]
    );

    // Log activity
    await pool.query(
      `INSERT INTO professional_activities (user_id, activity_type, entity_type, entity_id, description)
      VALUES ($1, $2, $3, $4, $5)`,
      [userId, 'create', 'survey', result.rows[0].id, `Created new survey: ${title}`]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update survey
export const updateSurvey = async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = (req as any).user.id;
  const { title, location, coordinates, survey_type, survey_date, completion_date, status, report_url, findings, metadata } = req.body;

  try {
    const result = await pool.query(
      `UPDATE survey_records 
      SET title = COALESCE($1, title),
          location = COALESCE($2, location),
          coordinates = COALESCE($3, coordinates),
          survey_type = COALESCE($4, survey_type),
          survey_date = COALESCE($5, survey_date),
          completion_date = COALESCE($6, completion_date),
          status = COALESCE($7, status),
          report_url = COALESCE($8, report_url),
          findings = COALESCE($9, findings),
          metadata = COALESCE($10, metadata),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $11 AND surveyor_id = $12
      RETURNING *`,
      [title, location, coordinates, survey_type, survey_date, completion_date, status, report_url, findings, metadata, id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Survey not found or unauthorized' });
    }

    // Log activity
    await pool.query(
      `INSERT INTO professional_activities (user_id, activity_type, entity_type, entity_id, description)
      VALUES ($1, $2, $3, $4, $5)`,
      [userId, 'update', 'survey', id, `Updated survey`]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Generate survey report
export const generateSurveyReport = async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = (req as any).user.id;

  try {
    const result = await pool.query(
      'SELECT * FROM survey_records WHERE id = $1 AND surveyor_id = $2',
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Survey not found or unauthorized' });
    }

    const survey = result.rows[0];

    // Generate report data
    const report = {
      surveyId: survey.id,
      title: survey.title,
      location: survey.location,
      coordinates: survey.coordinates,
      surveyType: survey.survey_type,
      surveyDate: survey.survey_date,
      completionDate: survey.completion_date,
      status: survey.status,
      findings: survey.findings,
      metadata: survey.metadata,
      generatedAt: new Date(),
      surveyor: {
        id: userId
      }
    };

    res.json(report);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
