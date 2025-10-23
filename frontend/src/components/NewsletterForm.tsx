"use client";
import { useState } from "react";
import { Mail } from "lucide-react";
import Cookies from "js-cookie";
import { buildApiUrl, API_ENDPOINTS } from "../lib/api-config";

export default function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  // Check if user has already subscribed (using cookies)
  const hasSubscribed = Cookies.get('newsletter_subscribed') === 'true';

  const handleNewsletterSubmission = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || isSubscribing) return;

    setIsSubscribing(true);
    setSubscriptionStatus('idle');

    try {
      const response = await fetch(buildApiUrl(API_ENDPOINTS.NEWSLETTER.SUBSCRIBE), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setSubscriptionStatus('success');
        setMessage(data.message || 'Successfully subscribed to newsletter!');
        setEmail('');
        
        // Set cookie to remember subscription for 30 days
        Cookies.set('newsletter_subscribed', 'true', { expires: 30 });
        Cookies.set('newsletter_email', email, { expires: 30 });
      } else {
        setSubscriptionStatus('error');
        setMessage(data.error || 'Failed to subscribe to newsletter');
      }
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      setSubscriptionStatus('error');
      setMessage('Network error. Please try again.');
    } finally {
      setIsSubscribing(false);
      
      // Clear message after 5 seconds
      setTimeout(() => {
        setSubscriptionStatus('idle');
        setMessage('');
      }, 5000);
    }
  };

  return (
    <div className="mt-6">
      <h4 className="font-medium mb-3">Stay Updated</h4>
      
      {hasSubscribed ? (
        <div className="p-4 bg-green-900/30 border border-green-700 rounded-lg">
          <p className="text-green-400 text-sm">
            ✓ You're subscribed to our newsletter!
          </p>
        </div>
      ) : (
        <form onSubmit={handleNewsletterSubmission}>
          <div className="flex">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              disabled={isSubscribing}
              className="flex-1 px-4 py-2 bg-slate-800 border border-slate-700 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400 disabled:opacity-50"
            />
            <button 
              type="submit"
              disabled={isSubscribing || !email}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-r-lg transition-colors"
            >
              {isSubscribing ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Mail className="w-4 h-4" />
              )}
            </button>
          </div>
        </form>
      )}
      
      {/* Status message */}
      {message && (
        <div className={`mt-2 p-2 rounded text-sm ${
          subscriptionStatus === 'success' 
            ? 'bg-green-900/30 text-green-400 border border-green-700' 
            : 'bg-red-900/30 text-red-400 border border-red-700'
        }`}>
          {message}
        </div>
      )}
    </div>
  );
}
