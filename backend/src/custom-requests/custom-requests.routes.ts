import express from 'express';
import { Router, Request, Response } from 'express';
import { query } from '../db';

const router = Router();

router.post('/', async (req: Request, res: Response) => {
  try {
    const { fullName, email, phone, projectType, budgetRange, description, plotSize, location } = req.body;

    const result = await query(
      `INSERT INTO custom_design_requests 
      (full_name, email, phone, project_type, budget_range, description, plot_size, location) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
      RETURNING *`,
      [fullName, email, phone, projectType, budgetRange, description, plotSize, location]
    );

    res.status(201).json({ 
      message: 'Custom design request submitted successfully',
      request: result.rows[0]
    });
  } catch (error) {
    console.error('Error submitting custom design request:', error);
    res.status(500).json({ message: 'Failed to submit request' });
  }
});

export default router;
