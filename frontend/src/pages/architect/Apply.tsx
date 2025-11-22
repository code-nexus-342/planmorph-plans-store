import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { registerArchitect } from '../../services/auth.service';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const ArchitectApply: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    full_name: '',
    phone_number: '',
    bio: '',
    experience_years: '',
    portfolio_url: '',
    cv_url: '',
    id_document_url: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await registerArchitect({
        full_name: formData.full_name,
        phone_number: formData.phone_number,
        bio: formData.bio,
        experience_years: parseInt(formData.experience_years),
        portfolio_url: formData.portfolio_url,
        cv_url: formData.cv_url,
        id_document_url: formData.id_document_url
      });
      
      alert('Application submitted successfully! Please wait for admin approval.');
      navigate('/architect/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit application');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="text-center py-20">
        <p className="mb-4">Please log in to apply as a professional.</p>
        <Button onClick={() => navigate('/login')}>Login</Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">Apply as Professional</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Fill out the application form below. An admin will review your application.
      </p>

      {error && (
        <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-500 dark:bg-red-900/20">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Full Name *"
          name="full_name"
          value={formData.full_name}
          onChange={handleChange}
          required
        />

        <Input
          label="Phone Number"
          name="phone_number"
          type="tel"
          value={formData.phone_number}
          onChange={handleChange}
        />

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-200">
            Bio
          </label>
          <textarea
            name="bio"
            rows={4}
            className="w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 dark:border-gray-700 dark:text-white"
            value={formData.bio}
            onChange={handleChange}
            placeholder="Tell us about yourself and your experience..."
          />
        </div>

        <Input
          label="Years of Experience *"
          name="experience_years"
          type="number"
          value={formData.experience_years}
          onChange={handleChange}
          required
          min="0"
        />

        <Input
          label="Portfolio URL"
          name="portfolio_url"
          type="url"
          value={formData.portfolio_url}
          onChange={handleChange}
          placeholder="https://yourportfolio.com"
        />

        <Input
          label="CV/Resume URL"
          name="cv_url"
          type="url"
          value={formData.cv_url}
          onChange={handleChange}
          placeholder="https://link-to-your-cv.com"
          helperText="Upload your CV to a cloud service and paste the link here"
        />

        <Input
          label="ID Document URL"
          name="id_document_url"
          type="url"
          value={formData.id_document_url}
          onChange={handleChange}
          placeholder="https://link-to-your-id.com"
          helperText="Upload a scan of your professional ID/license"
        />

        <div className="pt-4">
          <Button type="submit" size="lg" className="w-full" isLoading={loading}>
            Submit Application
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ArchitectApply;
