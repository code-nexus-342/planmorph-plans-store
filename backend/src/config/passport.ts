import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { config } from './index';
import { query } from './database';
import { logger } from '../utils/logger';

// JWT Strategy for API authentication
passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.jwt.secret,
    },
    async (payload, done) => {
      try {
        const userResult = await query(
          'SELECT * FROM users WHERE id = $1',
          [payload.userId]
        );

        if (userResult.rows.length === 0) {
          return done(null, false);
        }

        const user = userResult.rows[0];
        return done(null, user);
      } catch (error) {
        logger.error('JWT Strategy error:', error);
        return done(error, false);
      }
    }
  )
);

// Google OAuth Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: config.google.clientId!,
      clientSecret: config.google.clientSecret!,
      callbackURL: config.google.redirectUri,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        logger.info(`Google OAuth callback for user: ${profile.id}`);

        // Extract user info from Google profile
        const email = profile.emails?.[0]?.value;
        const firstName = profile.name?.givenName || '';
        const lastName = profile.name?.familyName || '';
        const avatarUrl = profile.photos?.[0]?.value;

        if (!email) {
          logger.error('No email found in Google profile');
          return done(new Error('No email found in Google profile'), false);
        }

        // Check if user exists by email or Google ID
        let userResult = await query(
          'SELECT * FROM users WHERE email = $1 OR oauth_provider_id = $2',
          [email, profile.id]
        );

        let user = userResult.rows[0];

        if (!user) {
          // Create new user with email verification required
          logger.info(`Creating new user from Google OAuth: ${email}`);
          
          // Generate email verification OTP
          const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
          const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes from now
          
          const newUserResult = await query(`
            INSERT INTO users (email, first_name, last_name, avatar_url, oauth_provider, oauth_provider_id, is_verified, is_active, role, email_verification_token, email_verification_expires)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
            RETURNING *
          `, [
            email,
            firstName,
            lastName,
            avatarUrl,
            'google',
            profile.id,
            false, // Require email verification even for Google users for security
            true,
            'customer',
            otp,
            expiresAt.toISOString()
          ]);

          if (newUserResult.rows.length === 0) {
            logger.error('Failed to create user from Google OAuth');
            return done(new Error('Failed to create user'), false);
          }

          user = newUserResult.rows[0];
          
          // Send verification email with OTP
          try {
            const { sendOAuthVerificationEmail } = await import('../utils/email');
            await sendOAuthVerificationEmail(email, firstName, otp);
            logger.info(`OAuth verification email sent to: ${email}`);
          } catch (error) {
            logger.error('Failed to send OAuth verification email:', error);
            // Continue without failing - user can request resend
          }
        } else {
          // Update existing user with Google OAuth info if not already set
          if (!user.oauth_provider || user.oauth_provider !== 'google') {
            logger.info(`Updating existing user with Google OAuth info: ${email}`);
            
            await query(`
              UPDATE users 
              SET oauth_provider = $1, oauth_provider_id = $2, avatar_url = COALESCE($3, avatar_url), is_verified = $4, updated_at = $5
              WHERE id = $6
            `, [
              'google',
              profile.id,
              avatarUrl,
              true,
              new Date().toISOString(),
              user.id
            ]);
          }
        }

        logger.info(`Google OAuth successful for user: ${user.id}`);
        return done(null, user);
      } catch (error) {
        logger.error('Google OAuth strategy error:', error);
        return done(error, false);
      }
    }
  )
);

// Serialize user for session
passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id: string, done) => {
  try {
    const userResult = await query(
      'SELECT * FROM users WHERE id = $1',
      [id]
    );

    if (userResult.rows.length === 0) {
      return done(null, false);
    }

    const user = userResult.rows[0];
    done(null, user);
  } catch (error) {
    logger.error('Passport deserialize error:', error);
    done(error, false);
  }
});

export default passport;
