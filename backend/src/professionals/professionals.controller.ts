import { Request, Response } from 'express';
import pool from '../db';
import { z } from 'zod';

export const getProfessionalDashboardStats = async (req: Request, res: Response) => {
    const professionalId = (req as any).user.id;

    try {
        const stats = {
            totalDesigns: 0,
            totalSales: 0,
            views: 0,
            role: ''
        };

        const designsCount = await pool.query('SELECT COUNT(*) FROM designs WHERE professional_id = $1', [professionalId]);
        stats.totalDesigns = parseInt(designsCount.rows[0].count);

        const roleRes = await pool.query(`
            SELECT pr.name 
            FROM professionals p 
            JOIN professional_roles pr ON p.professional_role_id = pr.id 
            WHERE p.id = $1
        `, [professionalId]);
        
        if (roleRes.rows.length > 0) {
            stats.role = roleRes.rows[0].name;
        }

        res.json(stats);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getProfessionalRoles = async (req: Request, res: Response) => {
    try {
        const result = await pool.query('SELECT * FROM professional_roles WHERE is_active = TRUE ORDER BY name ASC');
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
