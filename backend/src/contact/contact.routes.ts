import express from 'express';
import { Router, Request, Response } from 'express';
import { query } from '../db';

const router = Router();

router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, email, subject, message } = req.body;

    const result = await query(
      `INSERT INTO contact_messages (name, email, subject, message) 
      VALUES ($1, $2, $3, $4) 
      RETURNING *`,
      [name, email, subject, message]
    );

    res.status(201).json({ 
      message: 'Message sent successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error sending contact message:', error);
    res.status(500).json({ message: 'Failed to send message' });
  }
});

export default router;
