import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import pool from '../db';

const registerSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
    role: z.enum(['client', 'architect']).default('client')
});

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string()
});

const architectProfileSchema = z.object({
    full_name: z.string().min(1),
    phone_number: z.string().optional(),
    bio: z.string().optional(),
    experience_years: z.number().int().nonnegative().optional(),
    portfolio_url: z.string().url().optional(),
    cv_url: z.string().url().optional(),
    id_document_url: z.string().url().optional()
});

export const register = async (req: Request, res: Response) => {
    try {
        const { email, password, role } = registerSchema.parse(req.body);
        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await pool.query(
            'INSERT INTO users (email, password_hash, role) VALUES ($1, $2, $3) RETURNING id, email, role',
            [email, hashedPassword, role]
        );

        const user = result.rows[0];
        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET as string, { expiresIn: '1h' });

        res.status(201).json({ user, token });
    } catch (error: any) {
        if (error.code === '23505') { // Unique violation
            return res.status(409).json({ message: 'Email already exists' });
        }
        if (error instanceof z.ZodError) {
            return res.status(400).json({ errors: error.errors });
        }
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = loginSchema.parse(req.body);

        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        const user = result.rows[0];

        if (!user || !(await bcrypt.compare(password, user.password_hash))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET as string, { expiresIn: '1h' });

        res.json({ user: { id: user.id, email: user.email, role: user.role }, token });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ errors: error.errors });
        }
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const applyAsArchitect = async (req: Request, res: Response) => {
    const userId = (req as any).user.id;

    try {
        const profileData = architectProfileSchema.parse(req.body);

        // Update user role to architect if not already
        await pool.query(
            'UPDATE users SET role = $1 WHERE id = $2',
            ['architect', userId]
        );

        // Insert or update architect profile
        await pool.query(
            `INSERT INTO architect_profiles 
            (user_id, full_name, phone_number, bio, experience_years, portfolio_url, cv_url, id_document_url, status) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            ON CONFLICT (user_id) DO UPDATE SET
            full_name = EXCLUDED.full_name,
            phone_number = EXCLUDED.phone_number,
            bio = EXCLUDED.bio,
            experience_years = EXCLUDED.experience_years,
            portfolio_url = EXCLUDED.portfolio_url,
            cv_url = EXCLUDED.cv_url,
            id_document_url = EXCLUDED.id_document_url,
            status = 'pending',
            updated_at = CURRENT_TIMESTAMP`,
            [
                userId,
                profileData.full_name,
                profileData.phone_number || null,
                profileData.bio || null,
                profileData.experience_years || null,
                profileData.portfolio_url || null,
                profileData.cv_url || null,
                profileData.id_document_url || null,
                'pending'
            ]
        );

        res.status(200).json({ message: 'Application submitted successfully' });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ errors: error.errors });
        }
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getCurrentUser = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        
        const result = await pool.query(
            'SELECT id, email, role, created_at FROM users WHERE id = $1',
            [userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
