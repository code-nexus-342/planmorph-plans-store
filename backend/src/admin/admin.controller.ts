import { Request, Response } from 'express';
import pool from '../db';

export const getArchitectApplications = async (req: Request, res: Response) => {
    try {
        const result = await pool.query(`
            SELECT ap.*, u.email 
            FROM architect_profiles ap
            JOIN users u ON ap.user_id = u.id
            WHERE ap.status = 'pending'
            ORDER BY ap.created_at ASC
        `);
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const approveArchitect = async (req: Request, res: Response) => {
    const { id } = req.params; // This is the user_id
    const { status } = req.body; // 'approved' or 'rejected'

    if (!['approved', 'rejected'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status' });
    }

    try {
        await pool.query('BEGIN');

        const result = await pool.query(
            'UPDATE architect_profiles SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE user_id = $2 RETURNING *',
            [status, id]
        );

        if (result.rows.length === 0) {
            await pool.query('ROLLBACK');
            return res.status(404).json({ message: 'Application not found' });
        }

        // If approved, ensure the user role is 'architect' (it should already be, but good to double check or enforce)
        // Actually, in my design, they register as 'architect' role but are pending.
        // So no role change needed, just status update.

        await pool.query('COMMIT');

        res.json(result.rows[0]);
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
