import nodemailer from 'nodemailer';
import { config } from '../config';
import { logger } from './logger';

// Create email transporter
const createTransporter = () => {
  if (!config.email.user || !config.email.pass) {
    logger.warn('Email configuration missing. Email functionality will be disabled.');
    return null;
  }

  return nodemailer.createTransport({
    host: config.email.host,
    port: config.email.port,
    secure: config.email.port === 465, // true for 465, false for other ports
    auth: {
      user: config.email.user,
      pass: config.email.pass,
    },
  });
};

const transporter = createTransporter();

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export const sendEmail = async (options: EmailOptions): Promise<void> => {
  if (!transporter) {
    logger.error('Email transporter not configured. Cannot send email.');
    throw new Error('Email service not configured');
  }

  try {
    const mailOptions = {
      from: `"PlanMorph" <${config.email.user}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text || options.html.replace(/<[^>]*>/g, ''), // Strip HTML for text version
    };

    const info = await transporter.sendMail(mailOptions);
    logger.info(`Email sent to ${options.to}: ${info.messageId}`);
  } catch (error) {
    logger.error('Failed to send email:', error);
    throw error;
  }
};

export const sendVerificationEmail = async (email: string, otp: string): Promise<void> => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verify Your Email - PlanMorph</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #3b82f6; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background-color: #f8fafc; padding: 30px; border-radius: 0 0 8px 8px; }
        .otp-code { background-color: #1e40af; color: white; font-size: 32px; font-weight: bold; padding: 15px; text-align: center; border-radius: 8px; margin: 20px 0; letter-spacing: 3px; }
        .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Welcome to PlanMorph!</h1>
        </div>
        <div class="content">
          <h2>Verify Your Email Address</h2>
          <p>Thank you for signing up with PlanMorph! To complete your registration, please verify your email address using the verification code below:</p>
          
          <div class="otp-code">${otp}</div>
          
          <p>This verification code will expire in <strong>10 minutes</strong>. If you didn't create an account with PlanMorph, please ignore this email.</p>
          
          <p>Once verified, you'll have access to thousands of beautiful house plans and can start building your dream home!</p>
          
          <p>Best regards,<br>The PlanMorph Team</p>
        </div>
        <div class="footer">
          <p>© 2025 PlanMorph. All rights reserved.</p>
          <p>If you have any questions, contact us at support@planmorph.com</p>
        </div>
      </div>
    </body>
    </html>
  `;

  await sendEmail({
    to: email,
    subject: 'Verify Your Email - PlanMorph',
    html,
  });
};

export const sendWelcomeEmail = async (email: string, firstName: string): Promise<void> => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to PlanMorph!</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #10b981; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background-color: #f0fdf4; padding: 30px; border-radius: 0 0 8px 8px; }
        .cta-button { background-color: #3b82f6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0; }
        .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Welcome to PlanMorph, ${firstName}! 🏠</h1>
        </div>
        <div class="content">
          <p>Congratulations! Your email has been verified and your PlanMorph account is now active.</p>
          
          <p>You now have access to:</p>
          <ul>
            <li>🏗️ Thousands of professional house plans</li>
            <li>🔍 Advanced search and filtering</li>
            <li>💾 Save your favorite plans</li>
            <li>🛒 Easy purchase and download process</li>
            <li>🏆 Plans from top architects</li>
          </ul>
          
          <p>Ready to start exploring? Visit your dashboard to begin browsing plans!</p>
          
          <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard" class="cta-button">Go to Dashboard</a>
          
          <p>Happy building!<br>The PlanMorph Team</p>
        </div>
        <div class="footer">
          <p>© 2025 PlanMorph. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  await sendEmail({
    to: email,
    subject: 'Welcome to PlanMorph - Your Account is Ready!',
    html,
  });
};

// Generate 6-digit OTP
export const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const sendOAuthVerificationEmail = async (email: string, firstName: string, otp: string): Promise<void> => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verify Your Google Account - PlanMorph</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #1a73e8; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background-color: #f8fafc; padding: 30px; border-radius: 0 0 8px 8px; }
        .otp-code { background-color: #1e40af; color: white; font-size: 32px; font-weight: bold; padding: 15px; text-align: center; border-radius: 8px; margin: 20px 0; letter-spacing: 3px; }
        .security-note { background-color: #fef3c7; border: 1px solid #f59e0b; padding: 15px; border-radius: 6px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 14px; }
        .google-icon { display: inline-block; vertical-align: middle; margin-right: 8px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="google-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
          </div>
          <h1>Verify Your Google Account</h1>
        </div>
        <div class="content">
          <p>Hi ${firstName},</p>
          
          <p>Thank you for signing up with PlanMorph using your Google account! For your security, we need to verify that you have access to this email address.</p>
          
          <p>Please enter this verification code in the PlanMorph app:</p>
          
          <div class="otp-code">${otp}</div>
          
          <div class="security-note">
            <strong>🔒 Security Notice:</strong> This additional verification step ensures that only you can access your account, even when signing in with Google. Your account security is our priority.
          </div>
          
          <p><strong>This code will expire in 15 minutes.</strong></p>
          
          <p>If you didn't request this verification, please ignore this email.</p>
          
          <p>Welcome to PlanMorph!<br>The PlanMorph Team</p>
        </div>
        <div class="footer">
          <p>© 2025 PlanMorph. All rights reserved.</p>
          <p>This email was sent because you signed up using Google OAuth</p>
        </div>
      </div>
    </body>
    </html>
  `;

  await sendEmail({
    to: email,
    subject: 'Verify Your Google Account - PlanMorph',
    html,
  });
};
