import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { ArrowLeft, Briefcase } from 'lucide-react';
import { getProfessionalRoles, applyAsProfessional } from '../../services/professionals.service';

const Apply: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [roles, setRoles] = useState<any[]>([]);
  const [isCustomRole, setIsCustomRole] = useState(false);
  
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone_number: '',
    role_id: '',
    custom_role: '',
    bio: '',
    experience_years: '',
    portfolio_url: '',
    cv_url: '',
    id_document_url: ''
  });

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const data = await getProfessionalRoles();
        setRoles(data);
      } catch (err) {
        console.error('Failed to fetch roles', err);
      }
    };
    fetchRoles();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (name === 'role_id') {
      setIsCustomRole(value === 'other');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const payload: any = {
        ...formData,
        experience_years: formData.experience_years ? parseInt(formData.experience_years) : undefined,
        role_id: formData.role_id === 'other' ? undefined : parseInt(formData.role_id)
      };

      if (formData.role_id !== 'other') {
        delete payload.custom_role;
      }

      await applyAsProfessional(payload);

      setSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to submit application');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center p-8 glass-panel border border-white/10 shadow-glow max-w-md mx-auto mt-20 rounded-2xl">
        <div className="flex justify-center mb-6">
          <div className="h-16 w-16 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 border border-green-500/30">
            <Briefcase size={32} />
          </div>
        </div>
        <h2 className="text-2xl font-heading font-bold text-white mb-4">Application Submitted!</h2>
        <p className="text-text-secondary mb-8">
          Thank you for applying to join PlanMorph. Our team will review your application and contact you via email with your login credentials once approved.
        </p>
        <Link to="/">
          <Button className="w-full bg-primary text-background hover:bg-primary/90 shadow-glow border-none">
            Return Home
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 mb-20 px-4">
      <Link to="/login" className="inline-flex items-center text-text-secondary hover:text-white mb-8 transition-colors">
        <ArrowLeft size={20} className="mr-2" /> Back to Login
      </Link>

      <div className="glass-panel border border-white/10 shadow-glow p-8 md:p-12 rounded-2xl">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-heading font-bold text-white mb-2">Join as a Professional</h2>
          <p className="text-text-secondary">Apply to become a verified professional on PlanMorph</p>
        </div>

        {error && (
          <div className="mb-6 bg-red-500/20 border border-red-500/30 p-4 text-sm text-red-400 text-center rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Input
              label="Full Name"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              required
            />
            <Input
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Input
              label="Phone Number"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
            />
            <Input
              label="Years of Experience"
              type="number"
              name="experience_years"
              value={formData.experience_years}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-white">Professional Role</label>
            <select
              name="role_id"
              value={formData.role_id}
              onChange={handleChange}
              className="w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary"
              required
            >
              <option value="" className="bg-background">Select your role</option>
              {roles.map((role) => (
                <option key={role.id} value={role.id} className="bg-background">{role.name}</option>
              ))}
              <option value="other" className="bg-background">Other (Specify)</option>
            </select>
          </div>

          {isCustomRole && (
            <Input
              label="Specify Role"
              name="custom_role"
              value={formData.custom_role}
              onChange={handleChange}
              required
              placeholder="e.g. Electrical Engineer"
            />
          )}

          <div>
            <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">Professional Bio</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows={4}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white placeholder-text-secondary/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all"
              placeholder="Tell us about your expertise..."
            />
          </div>

          <Input
            label="Portfolio URL"
            type="url"
            name="portfolio_url"
            value={formData.portfolio_url}
            onChange={handleChange}
            placeholder="https://..."
          />

          <div className="grid md:grid-cols-2 gap-6">
            <Input
              label="CV / Resume URL"
              type="url"
              name="cv_url"
              value={formData.cv_url}
              onChange={handleChange}
              placeholder="https://..."
            />
            <Input
              label="ID Document URL"
              type="url"
              name="id_document_url"
              value={formData.id_document_url}
              onChange={handleChange}
              placeholder="https://..."
            />
          </div>

          <Button 
            type="submit" 
            className="w-full mt-4 bg-primary text-background hover:bg-primary/90 shadow-glow border-none" 
            isLoading={isLoading}
          >
            Submit Application
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Apply;
