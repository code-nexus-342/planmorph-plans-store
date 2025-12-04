import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getDesignById } from '../services/designs.service';
import { getMyPurchases } from '../services/purchase.service';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import { BedDouble, Bath, Ruler, Download, Share2, Heart, FileText, Check, ShoppingCart } from 'lucide-react';

const DesignDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [design, setDesign] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isPurchased, setIsPurchased] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchDesign = async () => {
      if (!id) return;
      try {
        const data = await getDesignById(id);
        setDesign(data);
      } catch (error) {
        console.error('Failed to fetch design', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDesign();
  }, [id]);

  useEffect(() => {
    const checkPurchaseStatus = async () => {
      if (!isAuthenticated || !id) return;
      
      try {
        const purchases = await getMyPurchases();
        const purchased = purchases.some((p: any) => p.design_id === parseInt(id));
        setIsPurchased(purchased);
      } catch (error) {
        console.error('Failed to check purchase status', error);
      }
    };

    checkPurchaseStatus();
  }, [id, isAuthenticated]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-white/10 border-t-primary"></div>
      </div>
    );
  }

  if (!design) {
    return <div className="text-center py-32 text-white font-heading text-2xl">Design not found</div>;
  }

  return (
    <div className="min-h-screen bg-background pt-20 pb-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-16 lg:grid-cols-2">
          {/* Media Gallery */}
          <div className="space-y-6">
            <div className="aspect-[4/3] w-full overflow-hidden bg-surface/50 relative group border border-white/10 rounded-2xl shadow-card">
              {/* Main preview or video */}
              {design.media && design.media.length > 0 ? (
                 <img 
                   src={selectedImage || design.media.find((m: any) => m.is_preview)?.url || design.media[0].url} 
                   alt={design.title} 
                   className="h-full w-full object-cover transition-all duration-500"
                 />
              ) : (
                <div className="flex h-full items-center justify-center text-text-secondary">
                  No Media Available
                </div>
              )}
              
              {/* Video Render Overlay/Button or Separate Section */}
              {design.media && design.media.find((m: any) => m.type === 'video') && (
                  <div className="absolute bottom-4 left-4">
                      <a 
                        href={design.media.find((m: any) => m.type === 'video').url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-primary text-background font-bold rounded-full shadow-glow hover:bg-primary/90 transition-colors"
                      >
                          <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
                          Watch Render
                      </a>
                  </div>
              )}
              
              <div className="absolute top-4 right-4 flex gap-2">
                <button className="p-3 bg-background/80 backdrop-blur-md text-white hover:bg-primary hover:text-background transition-colors shadow-lg rounded-full border border-white/10">
                  <Share2 size={20} />
                </button>
                <button className="p-3 bg-background/80 backdrop-blur-md text-white hover:bg-accent hover:text-white transition-colors shadow-lg rounded-full border border-white/10">
                  <Heart size={20} />
                </button>
              </div>
            </div>
            
            {/* Thumbnails */}
            {design.media && design.media.length > 1 && (
                <div className="grid grid-cols-4 gap-4">
                    {design.media
                        .filter((m: any) => m.type === 'image')
                        .map((media: any, index: number) => (
                        <div 
                            key={index} 
                            onClick={() => setSelectedImage(media.url)}
                            className={`aspect-square bg-surface/50 border cursor-pointer transition-all rounded-lg overflow-hidden ${selectedImage === media.url ? 'border-primary ring-2 ring-primary/20' : 'border-white/10 hover:border-primary/50'}`}
                        >
                            <img src={media.url} alt={`View ${index + 1}`} className="w-full h-full object-cover" />
                        </div>
                    ))}
                </div>
            )}
          </div>

          {/* Details */}
          <div className="space-y-10">
            <div className="border-b border-white/10 pb-8">
                <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-white/5 px-3 py-1 text-xs font-bold text-text-secondary uppercase tracking-wider border border-white/10 backdrop-blur-md">
                  {design.category_name || design.category || 'Uncategorized'}
                </span>
                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary uppercase tracking-wider border border-primary/20 shadow-glow animate-pulse-slow">
                  Verified Plan
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mt-4 leading-tight">{design.title}</h1>
            </div>

            <div className="grid grid-cols-3 gap-4 md:gap-8">
                <div className="text-center p-6 border border-white/10 bg-surface/30 rounded-2xl backdrop-blur-md hover:border-primary/50 transition-colors group">
                    <div className="mb-3 flex justify-center text-text-secondary group-hover:text-primary transition-colors"><BedDouble size={28} strokeWidth={1.5} /></div>
                    <div className="text-3xl font-bold text-white mb-1">{design.specifications?.bedrooms || '-'}</div>
                    <div className="text-xs text-text-secondary uppercase tracking-wider font-bold">Bedrooms</div>
                </div>
                <div className="text-center p-6 border border-white/10 bg-surface/30 rounded-2xl backdrop-blur-md hover:border-primary/50 transition-colors group">
                    <div className="mb-3 flex justify-center text-text-secondary group-hover:text-primary transition-colors"><Bath size={28} strokeWidth={1.5} /></div>
                    <div className="text-3xl font-bold text-white mb-1">{design.specifications?.bathrooms || '-'}</div>
                    <div className="text-xs text-text-secondary uppercase tracking-wider font-bold">Bathrooms</div>
                </div>
                <div className="text-center p-6 border border-white/10 bg-surface/30 rounded-2xl backdrop-blur-md hover:border-primary/50 transition-colors group">
                    <div className="mb-3 flex justify-center text-text-secondary group-hover:text-primary transition-colors"><Ruler size={28} strokeWidth={1.5} /></div>
                    <div className="text-3xl font-bold text-white mb-1">{design.specifications?.sqft || '-'}</div>
                    <div className="text-xs text-text-secondary uppercase tracking-wider font-bold">Sq Ft</div>
                </div>
            </div>

            <div className="prose prose-invert max-w-none">
                <h3 className="text-lg font-heading font-bold text-white mb-4 uppercase tracking-wide flex items-center gap-2">
                  <FileText size={20} className="text-primary" />
                  Design Philosophy
                </h3>
                <p className="text-text-secondary leading-relaxed text-lg font-light">{design.description}</p>
            </div>

            <div className="glass-panel p-8 rounded-2xl">
              <div className="flex items-end justify-between mb-6">
                <div>
                  <p className="text-sm text-text-secondary uppercase tracking-wider mb-1">Total Investment</p>
                  <span className="text-4xl font-heading font-bold text-primary text-shadow-glow">KES {design.price}</span>
                </div>
                <div className="text-right">
                  <div className="flex flex-col gap-1 text-sm text-text-secondary">
                    <span className="flex items-center justify-end gap-2"><Check size={14} className="text-primary" /> Architectural Drawings</span>
                    <span className="flex items-center justify-end gap-2"><Check size={14} className="text-primary" /> Structural Details</span>
                    <span className="flex items-center justify-end gap-2"><Check size={14} className="text-primary" /> Permit Ready</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                {isPurchased ? (
                  <Button 
                    size="lg" 
                    className="w-full bg-green-600 hover:bg-green-700 text-white border-none" 
                    onClick={() => navigate('/purchases')}
                  >
                    <Download className="mr-2" /> Access Files
                  </Button>
                ) : (
                  <div className="flex flex-col gap-3">
                    <Button 
                className="w-full py-4 text-lg shadow-soft"
                onClick={() => navigate('/checkout', { state: { design } })}
              >
                <ShoppingCart className="mr-2 h-5 w-5" /> Purchase Plan
              </Button>
                    <Button 
                      variant="secondary"
                      size="lg" 
                      className="w-full"
                      onClick={() => alert('Brochure download started...')}
                    >
                      <FileText className="mr-2" size={18} /> Download Brochure
                    </Button>
                  </div>
                )}
                <p className="text-center text-xs text-text-secondary mt-2">
                  Secure transaction processed via Stripe. Instant digital delivery.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesignDetails;
