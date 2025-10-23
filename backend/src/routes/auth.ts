import { Router } from 'express';
import {
  register,
  login,
  verifyEmail,
  resendVerification,
  getProfile,
  updateProfile,
  changePassword,
  refreshToken,
  oauthCallback,
  completeOAuthProfile,
  googleAuth,
  googleCallback,
} from '../controllers/authController';
import { authenticate } from '../middleware/auth';
import {
  validateUserRegistration,
  validateUserLogin,
  validateUserUpdate,
} from '../middleware/validation';
import passport from '../config/passport';

const router = Router();

// Public routes
router.post('/register', validateUserRegistration, register);
router.post('/login', validateUserLogin, login);
router.post('/verify-email', verifyEmail);
router.post('/resend-verification', resendVerification);
router.post('/refresh-token', refreshToken);

// OAuth routes
router.post('/oauth/callback', oauthCallback);
router.post('/oauth/complete-profile', completeOAuthProfile);

// Google OAuth routes
router.get('/google', googleAuth);
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/auth?error=oauth_failed' }), googleCallback);

// Protected routes
router.use(authenticate);
router.get('/profile', getProfile);
router.put('/profile', validateUserUpdate, updateProfile);
router.put('/change-password', changePassword);

export default router;
