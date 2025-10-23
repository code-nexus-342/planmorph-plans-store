"use client";
import { useState, useEffect } from 'react';
import { User, Mail, Lock, Save, Bell, Shield, Palette, AlertCircle, CheckCircle } from 'lucide-react';
import { apiClient } from '../../../lib/api-client';
import { useAuth } from '../../../contexts/AuthContext';
import LoadingSpinner from '../../LoadingSpinner';

interface UserSettings {
  email_notifications: boolean;
  marketing_emails: boolean;
  theme: 'light' | 'dark' | 'auto';
  [key: string]: boolean | string;
}

interface SettingsResponse {
  full_name: string;
  email: string;
  email_notifications: boolean;
  marketing_emails: boolean;
  theme: 'light' | 'dark' | 'auto';
}

export default function SettingsTab() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  
  // Profile Form
  const [profileForm, setProfileForm] = useState({
    full_name: '',
    email: '',
  });

  // Password Form
  const [passwordForm, setPasswordForm] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
  });

  // Settings
  const [settings, setSettings] = useState<UserSettings>({
    email_notifications: true,
    marketing_emails: false,
    theme: 'auto',
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get<SettingsResponse>('/users/settings');
      
      if (response.success && response.data) {
        setProfileForm({
          full_name: response.data.full_name || '',
          email: response.data.email || '',
        });
        setSettings({
          email_notifications: response.data.email_notifications ?? true,
          marketing_emails: response.data.marketing_emails ?? false,
          theme: response.data.theme || 'auto',
        });
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      const response = await apiClient.put('/users/profile', profileForm);
      
      if (response.success) {
        setMessage({ type: 'success', text: 'Profile updated successfully' });
        setTimeout(() => setMessage(null), 3000);
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to update profile' });
      setTimeout(() => setMessage(null), 3000);
    } finally {
      setSaving(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordForm.new_password !== passwordForm.confirm_password) {
      setMessage({ type: 'error', text: 'Passwords do not match' });
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    try {
      setSaving(true);
      const response = await apiClient.put('/users/password', {
        current_password: passwordForm.current_password,
        new_password: passwordForm.new_password,
      });
      
      if (response.success) {
        setMessage({ type: 'success', text: 'Password updated successfully' });
        setPasswordForm({ current_password: '', new_password: '', confirm_password: '' });
        setTimeout(() => setMessage(null), 3000);
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to update password' });
      setTimeout(() => setMessage(null), 3000);
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateSettings = async () => {
    try {
      setSaving(true);
      const response = await apiClient.put('/users/settings', settings);
      
      if (response.success) {
        setMessage({ type: 'success', text: 'Settings updated successfully' });
        setTimeout(() => setMessage(null), 3000);
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to update settings' });
      setTimeout(() => setMessage(null), 3000);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
            <User className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Account Settings</h2>
            <p className="text-sm text-gray-400">Manage your profile and preferences</p>
          </div>
        </div>
      </div>

      {/* Message Toast */}
      {message && (
        <div className={`flex items-center space-x-3 p-4 rounded-xl border ${
          message.type === 'success' 
            ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400' 
            : 'bg-rose-500/10 border-rose-500/50 text-rose-400'
        }`}>
          {message.type === 'success' ? (
            <CheckCircle className="w-5 h-5 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
          )}
          <p className="text-sm font-medium">{message.text}</p>
        </div>
      )}

      {/* Profile Settings */}
      <div className="rounded-2xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <User className="w-5 h-5 text-cyan-400" />
          <h3 className="text-lg font-bold text-white">Profile Information</h3>
        </div>
        
        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
            <input
              type="text"
              value={profileForm.full_name}
              onChange={(e) => setProfileForm({ ...profileForm, full_name: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none transition-colors"
              placeholder="Enter your full name"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
            <input
              type="email"
              value={profileForm.email}
              onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none transition-colors"
              placeholder="Enter your email"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="flex items-center space-x-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-medium hover:shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? <LoadingSpinner size="sm" /> : <Save className="w-4 h-4" />}
            <span>Save Profile</span>
          </button>
        </form>
      </div>

      {/* Password Settings */}
      <div className="rounded-2xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Lock className="w-5 h-5 text-purple-400" />
          <h3 className="text-lg font-bold text-white">Change Password</h3>
        </div>
        
        <form onSubmit={handleUpdatePassword} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Current Password</label>
            <input
              type="password"
              value={passwordForm.current_password}
              onChange={(e) => setPasswordForm({ ...passwordForm, current_password: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none transition-colors"
              placeholder="Enter current password"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">New Password</label>
            <input
              type="password"
              value={passwordForm.new_password}
              onChange={(e) => setPasswordForm({ ...passwordForm, new_password: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none transition-colors"
              placeholder="Enter new password"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Confirm New Password</label>
            <input
              type="password"
              value={passwordForm.confirm_password}
              onChange={(e) => setPasswordForm({ ...passwordForm, confirm_password: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none transition-colors"
              placeholder="Confirm new password"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="flex items-center space-x-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? <LoadingSpinner size="sm" /> : <Lock className="w-4 h-4" />}
            <span>Update Password</span>
          </button>
        </form>
      </div>

      {/* Notification Settings */}
      <div className="rounded-2xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Bell className="w-5 h-5 text-indigo-400" />
          <h3 className="text-lg font-bold text-white">Notifications</h3>
        </div>
        
        <div className="space-y-4">
          <label className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 hover:border-indigo-500/50 cursor-pointer transition-colors">
            <div>
              <p className="font-medium text-white">Email Notifications</p>
              <p className="text-sm text-gray-400">Receive updates about your orders</p>
            </div>
            <input
              type="checkbox"
              checked={settings.email_notifications}
              onChange={(e) => setSettings({ ...settings, email_notifications: e.target.checked })}
              className="w-5 h-5 rounded border-white/20 text-indigo-500 focus:ring-indigo-500"
            />
          </label>

          <label className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 hover:border-indigo-500/50 cursor-pointer transition-colors">
            <div>
              <p className="font-medium text-white">Marketing Emails</p>
              <p className="text-sm text-gray-400">Receive news and special offers</p>
            </div>
            <input
              type="checkbox"
              checked={settings.marketing_emails}
              onChange={(e) => setSettings({ ...settings, marketing_emails: e.target.checked })}
              className="w-5 h-5 rounded border-white/20 text-indigo-500 focus:ring-indigo-500"
            />
          </label>

          <button
            onClick={handleUpdateSettings}
            disabled={saving}
            className="flex items-center space-x-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium hover:shadow-lg hover:shadow-indigo-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? <LoadingSpinner size="sm" /> : <Save className="w-4 h-4" />}
            <span>Save Preferences</span>
          </button>
        </div>
      </div>
    </div>
  );
}
