import nodemailer from 'nodemailer';
import logger from './logger';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendEmail = async (to: string, subject: string, text: string, html?: string) => {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER) {
    logger.warn(`[EMAIL SKIPPED] SMTP not configured. To: ${to}, Subject: ${subject}`);
    logger.info(`[EMAIL CONTENT] ${text}`);
    return;
  }

  try {
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || '"PlanMorph" <noreply@planmorph.com>',
      to,
      subject,
      text,
      html: html || text,
    });

    logger.info(`Email sent: ${info.messageId}`);
  } catch (error) {
    logger.error('Error sending email:', error);
    // Don't throw error to avoid breaking the flow if email fails, but log it critical
  }
};
