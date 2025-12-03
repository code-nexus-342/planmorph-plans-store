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
      <div className="flex h-screen items-center justify-center bg-white">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-accent-teal"></div>
      </div>
    );
  }

  if (!design) {
    return <div className="text-center py-32 text-architect-900 font-heading text-2xl">Design not found</div>;
  }

  return (
    <div className="min-h-screen bg-white pt-20 pb-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-16 lg:grid-cols-2">
          {/* Media Gallery */}
          <div className="space-y-6">
            <div className="aspect-[4/3] w-full overflow-hidden bg-gray-100 relative group border border-gray-200">
              {/* Main preview or video */}
              {design.media && design.media.length > 0 ? (
                 <img 
                   src={design.media[0].url} 
                   alt={design.title} 
                   className="h-full w-full object-cover"
                 />
              ) : (
                <div className="flex h-full items-center justify-center text-gray-400">
                  No Media Available
                </div>
              )}
              
              <div className="absolute top-4 right-4 flex gap-2">
                <button className="p-3 bg-white text-architect-900 hover:bg-accent-teal hover:text-white transition-colors shadow-sm">
                  <Share2 size={20} />
                </button>
                <button className="p-3 bg-white text-architect-900 hover:bg-accent-gold hover:text-white transition-colors shadow-sm">
                  <Heart size={20} />
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="aspect-square bg-gray-100 border border-gray-200 cursor-pointer hover:border-accent-teal transition-colors" />
                ))}
            </div>
          </div>

          {/* Details */}
          <div className="space-y-10">
            <div className="border-b border-gray-100 pb-8">
                <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-architect-900 px-3 py-1 text-xs font-bold text-white uppercase tracking-wider">
                  {design.category}
                </span>
                <span className="rounded-full bg-accent-teal/10 px-3 py-1 text-xs font-bold text-accent-teal uppercase tracking-wider">
                  Verified Plan
                </span>
              </div>
              <h1 className="text-4xl font-heading font-bold text-architect-900 mt-4">{design.title}</h1>
            </div>

            <div className="grid grid-cols-3 gap-8">
                <div className="text-center p-4 border border-gray-100 bg-gray-50">
                    <div className="mb-2 flex justify-center text-architect-900"><BedDouble size={24} strokeWidth={1.5} /></div>
                    <div className="text-2xl font-bold text-architect-900">{design.specifications?.bedrooms || '-'}</div>
                    <div className="text-xs text-gray-500 uppercase tracking-wider">Bedrooms</div>
                </div>
                <div className="text-center p-4 border border-gray-100 bg-gray-50">
                    <div className="mb-2 flex justify-center text-architect-900"><Bath size={24} strokeWidth={1.5} /></div>
                    <div className="text-2xl font-bold text-architect-900">{design.specifications?.bathrooms || '-'}</div>
                    <div className="text-xs text-gray-500 uppercase tracking-wider">Bathrooms</div>
                </div>
                <div className="text-center p-4 border border-gray-100 bg-gray-50">
                    <div className="mb-2 flex justify-center text-architect-900"><Ruler size={24} strokeWidth={1.5} /></div>
                    <div className="text-2xl font-bold text-architect-900">{design.specifications?.sqft || '-'}</div>
                    <div className="text-xs text-gray-500 uppercase tracking-wider">Sq Ft</div>
                </div>
            </div>

            <div className="prose prose-gray max-w-none">
                <h3 className="text-lg font-heading font-bold text-architect-900 mb-4 uppercase tracking-wide">Design Philosophy</h3>
                <p className="text-gray-600 leading-relaxed">{design.description}</p>
            </div>

            <div className="bg-gray-50 p-8 border border-gray-100">
              <div className="flex items-end justify-between mb-6">
                <div>
                  <p className="text-sm text-gray-500 uppercase tracking-wider mb-1">Total Investment</p>
                  <span className="text-4xl font-heading font-bold text-architect-900">${design.price}</span>
                </div>
                <div className="text-right">
                  <div className="flex flex-col gap-1 text-sm text-gray-500">
                    <span className="flex items-center justify-end gap-2"><Check size={14} className="text-accent-teal" /> Architectural Drawings</span>
                    <span className="flex items-center justify-end gap-2"><Check size={14} className="text-accent-teal" /> Structural Details</span>
                    <span className="flex items-center justify-end gap-2"><Check size={14} className="text-accent-teal" /> Permit Ready</span>
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
                <p className="text-center text-xs text-gray-400 mt-2">
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
