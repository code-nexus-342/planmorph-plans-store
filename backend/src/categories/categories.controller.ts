import { Request, Response } from 'express';
import { Pool } from 'pg';
import { getPoolConfig } from '../db';

const pool = new Pool(getPoolConfig());

export const getAllCategories = async (req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM categories ORDER BY id ASC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Failed to fetch categories' });
  }
};
