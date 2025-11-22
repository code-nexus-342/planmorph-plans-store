import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getDesignById } from '../services/designs.service';
import { createPurchase, getMyPurchases } from '../services/purchase.service';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import { BedDouble, Bath, Ruler, ShieldCheck, Download, Share2, Heart } from 'lucide-react';

const DesignDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [design, setDesign] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
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
      <div className="flex h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-neon-cyan border-t-transparent shadow-neon-cyan"></div>
      </div>
    );
  }

  const handlePurchase = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!id) return;

    setPurchasing(true);
    try {
      await createPurchase(parseInt(id));
      alert('Purchase successful! You can now access your files.');
      navigate('/purchases');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Purchase failed. Please try again.');
    } finally {
      setPurchasing(false);
    }
  };

  if (!design) {
    return <div className="text-center py-32 text-white font-heading text-2xl">Design not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-24">
      <div className="grid gap-12 lg:grid-cols-2">
        {/* Media Gallery */}
        <div className="space-y-6">
          <div className="aspect-video w-full overflow-hidden rounded-2xl border border-glass-200 bg-nebula-800 shadow-glass relative group">
            <div className="absolute inset-0 bg-gradient-to-t from-nebula-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            {/* Main preview or video */}
            {design.media && design.media.length > 0 ? (
               <img 
                 src={design.media[0].url} 
                 alt={design.title} 
                 className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
               />
            ) : (
              <div className="flex h-full items-center justify-center text-gray-500">
                No Media Available
              </div>
            )}
            
            <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
              <button className="p-2 rounded-full bg-glass-200 backdrop-blur-md hover:bg-white hover:text-nebula-900 transition-colors">
                <Share2 size={20} />
              </button>
              <button className="p-2 rounded-full bg-glass-200 backdrop-blur-md hover:bg-neon-magenta hover:text-white transition-colors">
                <Heart size={20} />
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-video rounded-lg bg-nebula-800 border border-glass-200 cursor-pointer hover:border-neon-cyan transition-colors" />
              ))}
          </div>
        </div>

        {/* Details */}
        <div className="space-y-8">
          <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-1 rounded-full bg-neon-purple/10 border border-neon-purple/30 text-xs font-bold text-neon-purple uppercase tracking-wider">
                  Premium Blueprint
                </span>
                <span className="px-3 py-1 rounded-full bg-neon-cyan/10 border border-neon-cyan/30 text-xs font-bold text-neon-cyan uppercase tracking-wider flex items-center gap-1">
                  <ShieldCheck size={12} /> Verified
                </span>
              </div>
              <h1 className="text-4xl font-heading font-bold text-white mb-2">{design.title}</h1>
              <p className="text-lg text-gray-400">Architect: <span className="text-neon-cyan font-medium">{design.architect_name || 'Unknown Architect'}</span></p>
          </div>

          <div className="glass-panel p-6 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 uppercase tracking-wider mb-1">Total Price</p>
                <span className="text-5xl font-heading font-bold text-white text-shadow-lg">${design.price}</span>
              </div>
              <div className="text-right">
                <p className="text-sm text-green-400 flex items-center justify-end gap-1">
                  <ShieldCheck size={14} /> Secure Transaction
                </p>
                <p className="text-xs text-gray-500 mt-1">Includes all technical files</p>
              </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
              <div className="glass-panel p-4 text-center hover:border-neon-cyan/50 transition-colors">
                  <div className="mb-2 flex justify-center text-neon-cyan"><BedDouble size={24} /></div>
                  <div className="text-2xl font-bold text-white">{design.specifications?.bedrooms || '-'}</div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider">Bedrooms</div>
              </div>
              <div className="glass-panel p-4 text-center hover:border-neon-purple/50 transition-colors">
                  <div className="mb-2 flex justify-center text-neon-purple"><Bath size={24} /></div>
                  <div className="text-2xl font-bold text-white">{design.specifications?.bathrooms || '-'}</div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider">Bathrooms</div>
              </div>
              <div className="glass-panel p-4 text-center hover:border-neon-magenta/50 transition-colors">
                  <div className="mb-2 flex justify-center text-neon-magenta"><Ruler size={24} /></div>
                  <div className="text-2xl font-bold text-white">{design.specifications?.sqft || '-'}</div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider">Sq Ft</div>
              </div>
          </div>

          <div className="glass-panel p-8">
              <h3 className="text-lg font-heading font-bold text-white mb-4 border-b border-glass-200 pb-2">Design Philosophy</h3>
              <p className="text-gray-300 leading-relaxed">{design.description}</p>
          </div>

          <div className="pt-4">
                {isPurchased ? (
                  <Button 
                    size="lg" 
                    className="w-full bg-green-500 hover:bg-green-400 text-nebula-900 font-bold h-14 text-lg shadow-[0_0_20px_rgba(34,197,94,0.4)] border-none" 
                    onClick={() => navigate('/purchases')}
                  >
                    <Download className="mr-2" /> Access Files
                  </Button>
                ) : (
                  <Button 
                    size="lg" 
                    className="w-full bg-neon-cyan hover:bg-white text-nebula-900 font-bold h-14 text-lg shadow-neon-cyan border-none transition-all hover:scale-[1.02]" 
                    onClick={handlePurchase}
                    isLoading={purchasing}
                  >
                    {isAuthenticated ? 'Purchase Blueprint' : 'Login to Purchase'}
                  </Button>
                )}
                <p className="text-center text-xs text-gray-500 mt-4">
                  By purchasing, you agree to our Terms of Service and Licensing Agreement.
                </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesignDetails;
