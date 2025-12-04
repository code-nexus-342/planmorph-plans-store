import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../db';
import crypto from 'crypto';

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query('SELECT * FROM professionals WHERE email = $1', [email]);
    const professional = result.rows[0];

    if (!professional) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (!professional.password_hash) {
        return res.status(401).json({ message: 'Account not fully set up. Please contact support.' });
    }

    const isMatch = await bcrypt.compare(password, professional.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (professional.status !== 'approved') {
        return res.status(403).json({ message: 'Account is not approved yet.' });
    }

    const token = jwt.sign(
      { id: professional.id, role: 'professional', email: professional.email },
      process.env.JWT_SECRET as string,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: professional.id,
        email: professional.email,
        full_name: professional.full_name,
        role: 'professional',
        professional_role_id: professional.professional_role_id
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
    const { email } = req.body;

    try {
        const profResult = await pool.query('SELECT * FROM professionals WHERE email = $1', [email]);
        if (profResult.rows.length === 0) {
            return res.json({ message: 'If an account exists, a reset link has been sent.' });
        }

        const token = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date(Date.now() + 20 * 60 * 1000); // 20 minutes

        await pool.query(
            'INSERT INTO password_resets (email, token, user_type, expires_at) VALUES ($1, $2, $3, $4)',
            [email, token, 'professional', expiresAt]
        );

        // Mock email sending
        const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/professional/reset-password?token=${token}`;
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
            [token, 'professional']
        );

        if (resetResult.rows.length === 0) {
            return res.status(400).json({ message: 'Invalid or expired reset token' });
        }

        const email = resetResult.rows[0].email;
        const hashedPassword = await bcrypt.hash(password, 10);

        await pool.query('UPDATE professionals SET password_hash = $1 WHERE email = $2', [hashedPassword, email]);
        
        await pool.query('DELETE FROM password_resets WHERE email = $1 AND user_type = $2', [email, 'professional']);

        res.json({ message: 'Password reset successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
