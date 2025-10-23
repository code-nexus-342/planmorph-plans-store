"use client";
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import OAuthButtons from '../../components/OAuthButtons';
import EmailVerificationForm from '../../components/EmailVerificationForm';
import OAuthProfileCompletion from '../../components/OAuthProfileCompletion';

type AuthStep = 'auth' | 'verification' | 'oauth-completion';

interface OAuthCompletionData {
  email: string;
  firstName: string;
  lastName: string;
  requiresEmailVerification: boolean;
}

// Main Auth Component that uses useSearchParams
function AuthComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentStep, setCurrentStep] = useState<AuthStep>('auth');
  const [isLogin, setIsLogin] = useState(true);
  const [registrationEmail, setRegistrationEmail] = useState('');
  const [oauthCompletionData, setOAuthCompletionData] = useState<OAuthCompletionData | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login, register } = useAuth();

  // Check for OAuth verification requirements on mount
  useEffect(() => {
    const verificationRequired = searchParams.get('verification_required');
    const email = searchParams.get('email');
    const firstName = searchParams.get('first_name');
    const lastName = searchParams.get('last_name');
    const errorParam = searchParams.get('error');

    if (errorParam) {
      if (errorParam === 'oauth_failed') {
        setError('Google authentication failed. Please try again.');
      }
    } else if (verificationRequired === 'true' && email) {
      // OAuth user needs email verification
      setRegistrationEmail(decodeURIComponent(email));
      setCurrentStep('verification');
      setError('');
      
      // Set OAuth completion data for later use
      setOAuthCompletionData({
        email: decodeURIComponent(email),
        firstName: firstName ? decodeURIComponent(firstName) : '',
        lastName: lastName ? decodeURIComponent(lastName) : '',
        requiresEmailVerification: true
      });
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        const result = await login(formData.email, formData.password);
        if (result.success) {
          router.push('/dashboard');
        } else {
          setError(result.error || 'Login failed');
        }
      } else {
        const result = await register({
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone
        });
        
        if (result.success && result.requiresVerification) {
          setRegistrationEmail(result.email || formData.email);
          setCurrentStep('verification');
        } else if (!result.success) {
          setError(result.error || 'Registration failed');
        }
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthSuccess = (userData?: { email: string; firstName: string; lastName: string }) => {
    if (userData) {
      setOAuthCompletionData({
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        requiresEmailVerification: true
      });
      setCurrentStep('oauth-completion');
    } else {
      router.push('/dashboard');
    }
  };

  const handleOAuthRequiresCompletion = (data: { 
    email: string; 
    firstName: string; 
    lastName: string; 
    requiresEmailVerification: boolean; 
    requiresProfileCompletion: boolean; 
    isNewUser?: boolean;
  }) => {
    // Only show profile completion for NEW users who specifically need it
    if (data.isNewUser && data.requiresProfileCompletion) {
      setOAuthCompletionData({
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        requiresEmailVerification: false // OAuth users don't need email verification
      });
      setCurrentStep('oauth-completion');
    } else if (data.requiresEmailVerification) {
      // This case should not happen for OAuth users, but fallback to verification
      setRegistrationEmail(data.email);
      setCurrentStep('verification');
    } else {
      // No additional steps needed - go to dashboard
      router.push('/dashboard');
    }
  };

  const handleOAuthError = (error: string) => {
    setError(error);
  };

  const handleVerificationSuccess = () => {
    router.push('/dashboard');
  };

  const handleOAuthCompletionSuccess = () => {
    router.push('/dashboard');
  };

  const handleBackToAuth = () => {
    setCurrentStep('auth');
    setOAuthCompletionData(null);
    setError('');
  };

  if (currentStep === 'verification') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4">
        <EmailVerificationForm
          email={registrationEmail}
          onBack={handleBackToAuth}
          onSuccess={handleVerificationSuccess}
          isOAuth={oauthCompletionData !== null}
        />
      </div>
    );
  }

  if (currentStep === 'oauth-completion' && oauthCompletionData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4">
        <OAuthProfileCompletion
          email={oauthCompletionData.email}
          initialFirstName={oauthCompletionData.firstName}
          initialLastName={oauthCompletionData.lastName}
          requiresEmailVerification={oauthCompletionData.requiresEmailVerification}
          onBack={handleBackToAuth}
          onSuccess={handleOAuthCompletionSuccess}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p className="text-gray-600">
            {isLogin ? 'Sign in to your PlanMorph account' : 'Join thousands of happy homeowners'}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  required={!isLogin}
                  value={formData.firstName}
                  onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-900 bg-white placeholder-gray-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  required={!isLogin}
                  value={formData.lastName}
                  onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-900 bg-white placeholder-gray-500"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-900 bg-white placeholder-gray-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-900 bg-white placeholder-gray-500"
            />
          </div>

          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number (Optional)
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-900 bg-white placeholder-gray-500"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 rounded-lg transition-all duration-300 transform hover:scale-[1.02] shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
          </button>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          <div className="mt-6">
            <OAuthButtons 
              onSuccess={handleOAuthSuccess}
              onError={handleOAuthError}
              onRequiresCompletion={handleOAuthRequiresCompletion}
            />
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-600">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
            >
              {isLogin ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

// Loading fallback component
function AuthLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    </div>
  );
}

// Main export wrapped with Suspense
export default function AuthPage() {
  return (
    <Suspense fallback={<AuthLoading />}>
      <AuthComponent />
    </Suspense>
  );
}
