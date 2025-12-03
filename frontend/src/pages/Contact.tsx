import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess(false);

    try {
      const response = await fetch('http://localhost:5000/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSuccess(true);
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setError('Failed to send message. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 pt-24">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-heading font-bold text-architect-900 mb-4">Get in Touch</h1>
        <p className="text-gray-500 max-w-2xl mx-auto">
          Have questions about our plans or need assistance with a custom project? Our team is here to help.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto">
        {/* Contact Info */}
        <div className="space-y-8">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-gray-50 border border-gray-200 text-accent-teal">
              <Mail size={24} />
            </div>
            <div>
              <h3 className="font-bold text-architect-900 mb-1">Email Us</h3>
              <p className="text-gray-500 text-sm mb-1">General Inquiries</p>
              <a href="mailto:planmorph@gmail.com" className="text-architect-900 font-bold hover:text-accent-teal transition-colors">
                planmorph@gmail.com
              </a>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 bg-gray-50 border border-gray-200 text-accent-teal">
              <Phone size={24} />
            </div>
            <div>
              <h3 className="font-bold text-architect-900 mb-1">Call Us</h3>
              <p className="text-gray-500 text-sm mb-1">Mon-Fri from 8am to 5pm</p>
              <a href="tel:+254748767396" className="text-architect-900 font-bold hover:text-accent-teal transition-colors">
                +254 748 767 396
              </a>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 bg-gray-50 border border-gray-200 text-accent-teal">
              <MapPin size={24} />
            </div>
            <div>
              <h3 className="font-bold text-architect-900 mb-1">Online Store</h3>
              <p className="text-gray-500 text-sm">
                We are a fully digital platform serving clients across Kenya.
              </p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="md:col-span-2 bg-white border border-gray-200 shadow-soft p-8">
          <h2 className="text-2xl font-heading font-bold text-architect-900 mb-6">Send us a Message</h2>
          
          {success && (
            <div className="mb-6 bg-green-50 border border-green-100 p-4 text-sm text-green-600">
              Message sent successfully! We'll get back to you soon.
            </div>
          )}

          {error && (
            <div className="mb-6 bg-red-50 border border-red-100 p-4 text-sm text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Input
                label="Your Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
              <Input
                label="Email Address"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <Input
              label="Subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
            />
            <div>
              <label className="mb-2 block text-xs font-bold text-gray-500 uppercase tracking-wider">Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={5}
                className="w-full rounded-none border border-gray-200 bg-gray-50 px-4 py-3 text-architect-900 focus:outline-none focus:border-accent-teal focus:ring-1 focus:ring-accent-teal transition-all duration-300"
                placeholder="How can we help you?"
              />
            </div>
            <Button type="submit" className="w-full md:w-auto" isLoading={isLoading}>
              <Send className="mr-2 h-4 w-4" /> Send Message
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
