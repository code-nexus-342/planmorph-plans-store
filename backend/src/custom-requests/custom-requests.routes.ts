import express from 'express';
import { Router, Request, Response } from 'express';
import { query } from '../db';

const router = Router();

router.post('/', async (req: Request, res: Response) => {
  try {
    const { 
      fullName, name, 
      email, 
      phone, 
      projectType, 
      budgetRange, budget,
      description, 
      plotSize, 
      location,
      bedrooms,
      bathrooms,
      floors
    } = req.body;

    // Map frontend fields to backend expected fields
    const finalFullName = fullName || name;
    const finalBudgetRange = budgetRange || budget;
    
    // Append room details to description if present
    let finalDescription = description;
    const details = [];
    if (bedrooms) details.push(`Bedrooms: ${bedrooms}`);
    if (bathrooms) details.push(`Bathrooms: ${bathrooms}`);
    if (floors) details.push(`Floors: ${floors}`);
    
    if (details.length > 0) {
      finalDescription = `${finalDescription}\n\nAdditional Details:\n${details.join('\n')}`;
    }

    const result = await query(
      `INSERT INTO custom_design_requests 
      (full_name, email, phone, project_type, budget_range, description, plot_size, location) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
      RETURNING *`,
      [finalFullName, email, phone, projectType, finalBudgetRange, finalDescription, plotSize, location]
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
