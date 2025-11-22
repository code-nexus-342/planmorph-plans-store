import React, { useState } from 'react';
import api from '../../services/api';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { useNavigate } from 'react-router-dom';

const UploadDesign: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    bedrooms: '',
    bathrooms: '',
    sqft: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Create Design Entry
      const designRes = await api.post('/architect/designs', {
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        specifications: {
            bedrooms: parseInt(formData.bedrooms),
            bathrooms: parseInt(formData.bathrooms),
            sqft: parseInt(formData.sqft)
        }
      });

      const designId = designRes.data.id;
      console.log('Design created with ID:', designId);

      // 2. Handle File Uploads (Mocking this part for now as we don't have a real file picker logic connected to S3 yet)
      // In a real implementation, we would iterate over selected files, get presigned URLs, upload to S3, then call /architect/media
      
      // For now, just redirect
      navigate('/architect/dashboard');
    } catch (error) {
      console.error('Failed to upload design', error);
      alert('Failed to upload design');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">Upload New Design</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />
        
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-200">Description</label>
          <textarea
            name="description"
            rows={4}
            className="w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 dark:border-gray-700 dark:text-white"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
             <Input
              label="Price ($)"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              required
            />
             <Input
              label="Square Footage"
              name="sqft"
              type="number"
              value={formData.sqft}
              onChange={handleChange}
              required
            />
        </div>

        <div className="grid grid-cols-2 gap-4">
             <Input
              label="Bedrooms"
              name="bedrooms"
              type="number"
              value={formData.bedrooms}
              onChange={handleChange}
              required
            />
             <Input
              label="Bathrooms"
              name="bathrooms"
              type="number"
              value={formData.bathrooms}
              onChange={handleChange}
              required
            />
        </div>

        {/* File Upload Section Placeholder */}
        <div className="rounded-md border-2 border-dashed border-gray-300 p-8 text-center dark:border-gray-700">
            <p className="text-gray-500">File upload functionality will be implemented here (Drag & Drop)</p>
            <p className="text-xs text-gray-400 mt-2">Images, Videos, CAD Files</p>
        </div>

        <div className="flex justify-end gap-4">
            <Button type="button" variant="secondary" onClick={() => navigate('/architect/dashboard')}>Cancel</Button>
            <Button type="submit" isLoading={loading}>Create Design</Button>
        </div>
      </form>
    </div>
  );
};

export default UploadDesign;
