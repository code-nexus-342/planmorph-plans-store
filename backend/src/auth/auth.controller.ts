import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import pool from '../db';
import crypto from 'crypto';
import { sendEmail } from '../utils/email';

const registerSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
    role: z.enum(['client', 'architect']).default('client')
});

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string()
});

const professionalApplicationSchema = z.object({
    full_name: z.string().min(1),
    email: z.string().email(),
    phone_number: z.string().optional(),
    role_id: z.number().int().optional(),
    custom_role: z.string().optional(),
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
        
        // Send verification email
        await sendEmail(
            email,
            'Verify your PlanMorph Account',
            `Your verification code is: ${verificationCode}`,
            `
            <h1>Welcome to PlanMorph!</h1>
            <p>Please verify your email address to activate your account.</p>
            <p><strong>Your verification code is: ${verificationCode}</strong></p>
            <p>This code will expire in 20 minutes.</p>
            `
        );

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
    const { token } = req.body;

    try {
        const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);
        const userId = decoded.id;

        await pool.query('UPDATE users SET is_verified = TRUE WHERE id = $1', [userId]);

        res.json({ message: 'Email verified successfully' });
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: 'Invalid or expired token' });
    }
};

export const forgotPassword = async (req: Request, res: Response) => {
    const { email } = req.body;

    try {
        const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userResult.rows.length === 0) {
            // Don't reveal user existence
            return res.json({ message: 'If an account exists, a reset link has been sent.' });
        }

        const token = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date(Date.now() + 20 * 60 * 1000); // 20 minutes

        await pool.query(
            'INSERT INTO password_resets (email, token, user_type, expires_at) VALUES ($1, $2, $3, $4)',
            [email, token, 'client', expiresAt]
        );

        // Mock email sending
        const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${token}`;
        console.log(`[MOCK EMAIL] To: ${email}, Reset Link: ${resetLink}`);

        res.json({ message: 'If an account exists, a reset link has been sent.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const resetPassword = async (req: Request, res: Response) => {
    const { token, password } = req.body;

    try {
        const resetResult = await pool.query(
            'SELECT * FROM password_resets WHERE token = $1 AND user_type = $2 AND expires_at > NOW()',
            [token, 'client']
        );

        if (resetResult.rows.length === 0) {
            return res.status(400).json({ message: 'Invalid or expired reset token' });
        }

        const email = resetResult.rows[0].email;
        const hashedPassword = await bcrypt.hash(password, 10);

        await pool.query('UPDATE users SET password_hash = $1 WHERE email = $2', [hashedPassword, email]);
        
        // Delete used token and any other tokens for this email
        await pool.query('DELETE FROM password_resets WHERE email = $1 AND user_type = $2', [email, 'client']);

        res.json({ message: 'Password reset successfully' });
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

        // Architect role check removed as part of cleanup

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
export const submitProfessionalApplication = async (req: Request, res: Response) => {
    try {
        const data = professionalApplicationSchema.parse(req.body);

        // Check if email already exists in applications or users
        const userCheck = await pool.query('SELECT id FROM users WHERE email = $1', [data.email]);
        if (userCheck.rows.length > 0) {
            return res.status(409).json({ message: 'Email already associated with an account' });
        }

        const appCheck = await pool.query('SELECT id FROM professional_applications WHERE email = $1 AND status = \'pending\'', [data.email]);
        if (appCheck.rows.length > 0) {
            return res.status(409).json({ message: 'You already have a pending application' });
        }

        await pool.query(
            `INSERT INTO professional_applications 
            (full_name, email, phone_number, professional_role_id, custom_role_name, bio, experience_years, portfolio_url, cv_url, id_document_url) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
            [
                data.full_name,
                data.email,
                data.phone_number,
                data.role_id || null,
                data.custom_role || null,
                data.bio,
                data.experience_years,
                data.portfolio_url,
                data.cv_url,
                data.id_document_url
            ]
        );

        res.status(201).json({ message: 'Application submitted successfully. It will be reviewed by an admin.' });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ errors: error.errors });
        }
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
