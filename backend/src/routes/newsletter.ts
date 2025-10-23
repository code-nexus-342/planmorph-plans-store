import express from 'express';
import pool from '../config/database';
import { sendEmail } from '../utils/email';

const router = express.Router();

// Subscribe to newsletter
router.post('/subscribe', async (req, res): Promise<void> => {
  try {
    const { email } = req.body;

    if (!email) {
      res.status(400).json({ 
        error: 'Please enter your email address to continue.' 
      });
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({ 
        error: 'Hmm, that doesn\'t look like a valid email. Please check and try again.' 
      });
      return;
    }

    // Check if already subscribed
    const existingSubscriber = await pool.query(
      'SELECT id FROM newsletter_subscribers WHERE email = $1',
      [email]
    );

    if (existingSubscriber.rows.length > 0) {
      res.status(200).json({ 
        message: '🎉 You\'re already part of our community! Check your inbox for the latest updates.' 
      });
      return;
    }

    // Add to newsletter subscribers
    await pool.query(
      `INSERT INTO newsletter_subscribers (email, subscribed_at, is_active) 
       VALUES ($1, NOW(), true)`,
      [email]
    );

    // Send welcome email
    try {
      await sendEmail({
        to: email,
        subject: '🎉 Welcome to PlanMorph - Your Architectural Journey Begins!',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="margin: 0; padding: 0; background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
            <div style="max-width: 600px; margin: 40px auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);">
              
              <!-- Header with Gradient -->
              <div style="background: linear-gradient(135deg, #00d4ff 0%, #7b2ff7 50%, #ff2e97 100%); padding: 40px 30px; text-align: center;">
                <h1 style="margin: 0; color: white; font-size: 32px; font-weight: bold; text-shadow: 0 2px 10px rgba(0,0,0,0.2);">
                  ✨ Welcome to PlanMorph!
                </h1>
                <p style="margin: 10px 0 0; color: rgba(255,255,255,0.95); font-size: 16px;">
                  Where architectural dreams become reality
                </p>
              </div>
              
              <!-- Content -->
              <div style="padding: 40px 30px;">
                <p style="margin: 0 0 20px; color: #334155; font-size: 16px; line-height: 1.6;">
                  Hey there, design enthusiast! 👋
                </p>
                
                <p style="margin: 0 0 25px; color: #334155; font-size: 16px; line-height: 1.6;">
                  Thank you for joining our community of architects, builders, and dreamers. You're now part of something special!
                </p>
                
                <div style="background: linear-gradient(135deg, #f0f9ff 0%, #f5f3ff 100%); border-left: 4px solid #00d4ff; border-radius: 8px; padding: 20px; margin: 30px 0;">
                  <h3 style="margin: 0 0 15px; color: #0f172a; font-size: 18px;">
                    🎁 Here's what you'll get:
                  </h3>
                  <ul style="margin: 0; padding-left: 20px; color: #475569;">
                    <li style="margin-bottom: 10px; line-height: 1.5;">
                      <strong style="color: #0f172a;">Exclusive House Plans</strong> - First access to our newest designs
                    </li>
                    <li style="margin-bottom: 10px; line-height: 1.5;">
                      <strong style="color: #0f172a;">Design Inspiration</strong> - Weekly tips from top architects
                    </li>
                    <li style="margin-bottom: 10px; line-height: 1.5;">
                      <strong style="color: #0f172a;">Special Offers</strong> - Subscriber-only discounts (up to 30% off!)
                    </li>
                    <li style="margin-bottom: 10px; line-height: 1.5;">
                      <strong style="color: #0f172a;">3D Tours</strong> - Virtual walkthroughs of stunning homes
                    </li>
                    <li style="line-height: 1.5;">
                      <strong style="color: #0f172a;">Trend Reports</strong> - What's hot in architectural design
                    </li>
                  </ul>
                </div>
                
                <p style="margin: 25px 0; color: #334155; font-size: 16px; line-height: 1.6;">
                  We promise to keep things interesting, relevant, and spam-free. Expect your first newsletter within the next 48 hours! 📬
                </p>
                
                <!-- CTA Button -->
                <div style="text-align: center; margin: 35px 0;">
                  <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/plans" 
                     style="display: inline-block; background: linear-gradient(135deg, #00d4ff 0%, #7b2ff7 100%); color: white; text-decoration: none; padding: 16px 40px; border-radius: 12px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 15px rgba(0, 212, 255, 0.3);">
                    🏠 Explore House Plans
                  </a>
                </div>
                
                <p style="margin: 25px 0 0; color: #64748b; font-size: 14px; line-height: 1.6; text-align: center;">
                  Have questions? Just hit reply - we'd love to hear from you!
                </p>
              </div>
              
              <!-- Footer -->
              <div style="background: #f8fafc; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0;">
                <p style="margin: 0 0 10px; color: #64748b; font-size: 13px;">
                  PlanMorph - Architectural Excellence Since 2025
                </p>
                <p style="margin: 0; color: #94a3b8; font-size: 12px;">
                  Not interested anymore? 
                  <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/unsubscribe" 
                     style="color: #64748b; text-decoration: underline;">
                    Unsubscribe here
                  </a>
                </p>
              </div>
              
            </div>
          </body>
          </html>
        `
      });
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError);
      // Don't fail the subscription if email fails
    }

    res.status(201).json({ 
      message: '🎉 Success! Check your inbox for a special welcome gift from us.' 
    });

  } catch (error) {
    console.error('Newsletter subscription error:', error);
    res.status(500).json({ 
      error: 'Oops! Something went wrong on our end. Please try again in a moment.' 
    });
  }
});

// Unsubscribe from newsletter
router.post('/unsubscribe', async (req, res): Promise<void> => {
  try {
    const { email } = req.body;

    if (!email) {
      res.status(400).json({ 
        error: 'Please provide your email address to unsubscribe.' 
      });
      return;
    }

    await pool.query(
      'UPDATE newsletter_subscribers SET is_active = false, unsubscribed_at = NOW() WHERE email = $1',
      [email]
    );

    res.status(200).json({ 
      message: 'You\'ve been unsubscribed. We\'re sad to see you go! 👋' 
    });

  } catch (error) {
    console.error('Newsletter unsubscribe error:', error);
    res.status(500).json({ 
      error: 'Unable to process your request right now. Please try again later.' 
    });
  }
});

export default router;
