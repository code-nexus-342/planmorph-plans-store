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
        // Force role to client, ignore input role
        const { email, password } = registerSchema.parse(req.body);
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Generate 8-char alphanumeric code
        const verificationCode = Math.random().toString(36).substring(2, 10).toUpperCase();
        const verificationExpiresAt = new Date(Date.now() + 20 * 60 * 1000); // 20 mins

        const result = await pool.query(
            'INSERT INTO users (email, password_hash, role, verification_code, verification_expires_at) VALUES ($1, $2, $3, $4, $5) RETURNING id, email, role',
            [email, hashedPassword, 'client', verificationCode, verificationExpiresAt]
        );

        const user = result.rows[0];
        
        // Mock sending email
        console.log(`[MOCK EMAIL] To: ${email}, Code: ${verificationCode}`);

        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET as string, { expiresIn: '1h' });

        res.status(201).json({ user, token, message: 'Registration successful. Please verify your email.' });
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

export const verifyEmail = async (req: Request, res: Response) => {
    const { email, code } = req.body;

    try {
        const result = await pool.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );
        
        const user = result.rows[0];
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.is_verified) {
            return res.status(400).json({ message: 'Email already verified' });
        }

        if (user.verification_code !== code) {
            return res.status(400).json({ message: 'Invalid verification code' });
        }

        if (new Date() > new Date(user.verification_expires_at)) {
            return res.status(400).json({ message: 'Verification code expired' });
        }

        await pool.query(
            'UPDATE users SET is_verified = TRUE, verification_code = NULL, verification_expires_at = NULL WHERE id = $1',
            [user.id]
        );

        res.json({ message: 'Email verified successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const resendVerification = async (req: Request, res: Response) => {
    const { email } = req.body;

    try {
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        const user = result.rows[0];

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.is_verified) {
            return res.status(400).json({ message: 'Email already verified' });
        }

        // Generate new code
        const verificationCode = Math.random().toString(36).substring(2, 10).toUpperCase();
        const verificationExpiresAt = new Date(Date.now() + 20 * 60 * 1000); // 20 mins

        await pool.query(
            'UPDATE users SET verification_code = $1, verification_expires_at = $2 WHERE id = $3',
            [verificationCode, verificationExpiresAt, user.id]
        );

        // Mock sending email
        console.log(`[MOCK EMAIL] Resend To: ${email}, Code: ${verificationCode}`);

        res.json({ message: 'Verification code resent successfully' });
    } catch (error) {
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

        if (user.role === 'client' && !user.is_verified) {
            // Check for dormancy (24 hours)
            const createdDate = new Date(user.created_at);
            const now = new Date();
            const hoursSinceCreation = (now.getTime() - createdDate.getTime()) / (1000 * 60 * 60);

            if (hoursSinceCreation > 24) {
                return res.status(403).json({ 
                    message: 'Account is dormant due to lack of verification. Please contact support.' 
                });
            }
            
            // Allow login but frontend should show verification banner
        }

        if (user.role === 'architect') {
            // Architects are verified by admin approval process, but we can double check status if needed
            // The previous logic checked architect_profiles status. 
            // With new flow, if they have an account, they are approved.
            // But let's keep the profile check just in case.
            const profileResult = await pool.query(
                'SELECT status FROM architect_profiles WHERE user_id = $1',
                [user.id]
            );
            
            const profile = profileResult.rows[0];
            if (!profile || profile.status !== 'approved') {
                return res.status(403).json({ 
                    message: 'Your account is pending verification. Please wait for admin approval.' 
                });
            }
        }

        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET as string, { expiresIn: '1h' });

        res.json({ 
            user: { 
                id: user.id, 
                email: user.email, 
                role: user.role,
                is_verified: user.is_verified 
            }, 
            token 
        });
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
