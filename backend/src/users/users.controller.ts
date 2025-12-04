import { Request, Response } from 'express';
import { query } from '../db';

export const updateSettings = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { settings } = req.body;

    if (!settings) {
      return res.status(400).json({ message: 'Settings are required' });
    }

    const result = await query(
      'UPDATE users SET settings = $1 WHERE id = $2 RETURNING id, email, role, settings',
      [settings, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: 'Settings updated successfully',
      user: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getSettings = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    const result = await query(
      'SELECT settings FROM users WHERE id = $1',
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      settings: result.rows[0].settings || {}
    });
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
