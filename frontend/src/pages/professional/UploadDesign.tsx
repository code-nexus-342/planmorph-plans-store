import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, X, Image as ImageIcon, FileText, Check } from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { getCategories } from '../../services/categories.service';
import { createDesign } from '../../services/designs.service'; // We might need to update this service or create a professional specific one

const ProfessionalUpload: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    categoryId: '',
    bedrooms: '',
    bathrooms: '',
    area: '',
    width: '',
    depth: '',
    videoUrl: ''
  });

  const [images, setImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [cadFile, setCadFile] = useState<File | null>(null);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };
    fetchCategories();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setImages(prev => [...prev, ...newFiles]);
      
      const newPreviews = newFiles.map(file => URL.createObjectURL(file));
      setPreviewUrls(prev => [...prev, ...newPreviews]);
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const handleCadChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCadFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!agreedToTerms) {
        alert('You must agree to the Terms of Service and AI training consent.');
        setIsLoading(false);
        return;
    }

    if (!cadFile) {
        alert('Please upload a CAD drawing file.');
        setIsLoading(false);
        return;
    }

    try {
      const designData = new FormData();
      designData.append('title', formData.title);
      designData.append('description', formData.description);
      designData.append('price', formData.price);
      designData.append('categoryId', formData.categoryId);
      designData.append('videoUrl', formData.videoUrl);
      
      // Specifications
      const specifications = {
        bedrooms: formData.bedrooms,
        bathrooms: formData.bathrooms,
        sqft: formData.area, // Map 'area' from form to 'sqft' for frontend compatibility
        area: formData.area, // Keep 'area' for backward compatibility if needed
        dimensions: {
          width: formData.width,
          depth: formData.depth
        }
      };
      designData.append('specifications', JSON.stringify(specifications));

      // Images
      images.forEach(image => {
        designData.append('images', image);
      });

      // CAD File
      if (cadFile) {
        designData.append('cadFile', cadFile);
      }

      // We need a service function that handles FormData and sends to the correct endpoint
      // Assuming createDesign handles this or we create a new one in professionals.service
      // For now, let's assume we use a generic createDesign but we might need to ensure it uses the professional auth token
      await createDesign(designData); 
      
      navigate('/professional/dashboard');
    } catch (error) {
      console.error('Upload failed:', error);
      // Show error toast
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold text-white mb-2">Upload New Design</h1>
        <p className="text-text-secondary">Share your architectural masterpiece with the world.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Info */}
        <div className="glass-panel p-6 rounded-2xl border border-white/10 bg-surface/50">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <FileText size={20} className="text-accent" />
            Basic Information
          </h2>
          
          <div className="grid gap-6">
            <Input
              label="Design Title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="e.g. Modern Minimalist Villa"
              required
            />
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-secondary ml-1">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={5}
                className="w-full bg-background/50 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all placeholder:text-text-secondary/30 resize-none"
                placeholder="Describe your design in detail..."
                required
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-text-secondary ml-1">Category</label>
                <select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleInputChange}
                  className="w-full bg-background/50 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all"
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              
              <Input
                label="Price (KES)"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="e.g. 15000"
                required
              />
            </div>
          </div>
        </div>

        {/* Specifications */}
        <div className="glass-panel p-6 rounded-2xl border border-white/10 bg-surface/50">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Check size={20} className="text-accent" />
            Specifications
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <Input
              label="Bedrooms"
              name="bedrooms"
              type="number"
              value={formData.bedrooms}
              onChange={handleInputChange}
              placeholder="e.g. 4"
            />
            <Input
              label="Bathrooms"
              name="bathrooms"
              type="number"
              value={formData.bathrooms}
              onChange={handleInputChange}
              placeholder="e.g. 3"
            />
            <Input
              label="Total Area (sqm)"
              name="area"
              type="number"
              value={formData.area}
              onChange={handleInputChange}
              placeholder="e.g. 250"
            />
          </div>
          
          <div className="grid md:grid-cols-2 gap-6 mt-6">
            <Input
              label="Width (m)"
              name="width"
              type="number"
              value={formData.width}
              onChange={handleInputChange}
              placeholder="e.g. 15"
            />
            <Input
              label="Depth (m)"
              name="depth"
              type="number"
              value={formData.depth}
              onChange={handleInputChange}
              placeholder="e.g. 20"
            />
          </div>
        </div>

        {/* Media */}
        <div className="glass-panel p-6 rounded-2xl border border-white/10 bg-surface/50">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <ImageIcon size={20} className="text-accent" />
            Media
          </h2>

          <div className="mb-6">
            <Input
              label="Video Walkthrough URL (Optional)"
              name="videoUrl"
              value={formData.videoUrl}
              onChange={handleInputChange}
              placeholder="e.g. https://youtube.com/..."
            />
          </div>

          <div className="space-y-4">
            <label className="text-sm font-medium text-text-secondary ml-1">Images (First image will be cover)</label>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              {previewUrls.map((url, index) => (
                <div key={index} className="relative aspect-square rounded-xl overflow-hidden group">
                  <img src={url} alt={`Preview ${index}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
                  >
                    <X size={16} />
                  </button>
                  {index === 0 && (
                    <div className="absolute bottom-0 left-0 right-0 bg-accent/80 text-white text-xs py-1 text-center font-bold">
                      Cover Image
                    </div>
                  )}
                </div>
              ))}
              
              <label className="aspect-square rounded-xl border-2 border-dashed border-white/20 flex flex-col items-center justify-center cursor-pointer hover:border-accent/50 hover:bg-white/5 transition-all group">
                <Upload size={32} className="text-text-secondary group-hover:text-accent mb-2 transition-colors" />
                <span className="text-sm text-text-secondary group-hover:text-white transition-colors">Add Images</span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>

            {/* CAD File Upload */}
            <label className="text-sm font-medium text-text-secondary ml-1 block mb-2">CAD Drawings (PDF)</label>
            <div className="border-2 border-dashed border-white/20 rounded-xl p-6 flex flex-col items-center justify-center text-center hover:border-accent/50 hover:bg-white/5 transition-all">
                {cadFile ? (
                    <div className="flex flex-col items-center gap-4">
                        <div className="flex items-center gap-4">
                            <FileText className="text-accent" size={32} />
                            <div className="text-left">
                                <p className="text-white font-medium">{cadFile.name}</p>
                                <p className="text-xs text-text-secondary">{(cadFile.size / 1024 / 1024).toFixed(2)} MB</p>
                            </div>
                            <button type="button" onClick={() => setCadFile(null)} className="text-red-500 hover:text-red-400">
                                <X size={20} />
                            </button>
                        </div>
                    </div>
                ) : (
                    <label className="cursor-pointer w-full h-full flex flex-col items-center justify-center">
                        <Upload size={32} className="text-text-secondary mb-2" />
                        <p className="text-white font-medium">Click to upload CAD PDF</p>
                        <p className="text-xs text-text-secondary mt-1">Supports .pdf</p>
                        <input 
                            type="file" 
                            accept=".pdf" 
                            onChange={handleCadChange} 
                            className="hidden" 
                        />
                    </label>
                )}
            </div>
            <p className="text-xs text-text-secondary mt-2">
                * Please upload your CAD drawings in PDF format for AI analysis.
            </p>
          </div>
        </div>

        {/* Terms and Consent */}
        <div className="glass-panel p-6 rounded-2xl border border-white/10 bg-surface/50">
            <label className="flex items-start gap-3 cursor-pointer">
                <input 
                    type="checkbox" 
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="mt-1 w-5 h-5 rounded border-white/20 bg-white/5 text-accent focus:ring-accent"
                />
                <span className="text-text-secondary text-sm">
                    I agree to the <a href="/professional/terms" target="_blank" className="text-accent hover:underline">Terms of Service</a> and <a href="/professional/privacy" target="_blank" className="text-accent hover:underline">Privacy Policy</a>. 
                    I explicitly consent to my uploaded CAD drawings (PDF) being used by PlanMorph for AI model training and analysis purposes.
                </span>
            </label>
        </div>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => navigate('/professional/dashboard')}>
            Cancel
          </Button>
          <Button type="submit" className="bg-accent text-background hover:bg-accent/90 shadow-glow" isLoading={isLoading}>
            Publish Design
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProfessionalUpload;
