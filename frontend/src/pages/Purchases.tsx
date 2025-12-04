import React, { useEffect, useState } from 'react';
import { getMyPurchases, getDesignFiles } from '../services/purchase.service';
import Button from '../components/ui/Button';
import { Download, FileText, Package, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Purchases: React.FC = () => {
  const [purchases, setPurchases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [files, setFiles] = useState<Record<number, any[]>>({});

  useEffect(() => {
    fetchPurchases();
  }, []);

  const fetchPurchases = async () => {
    try {
      const data = await getMyPurchases();
      setPurchases(data);
    } catch (error) {
      console.error('Failed to fetch purchases', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewFiles = async (designId: number) => {
    if (expandedId === designId) {
      setExpandedId(null);
      return;
    }

    setExpandedId(designId);
    
    if (!files[designId]) {
      try {
        const designFiles = await getDesignFiles(designId);
        setFiles({ ...files, [designId]: designFiles });
      } catch (error) {
        console.error('Failed to fetch files', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center bg-background">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-white/10 border-t-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 pt-24 min-h-screen bg-background">
      <div className="mb-8 flex items-center gap-3 border-b border-white/10 pb-6">
        <Package className="text-primary" size={32} />
        <h1 className="text-4xl font-heading font-bold text-white">My Library</h1>
      </div>

      {purchases.length === 0 ? (
        <div className="text-center py-32 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm">
          <div className="mb-6 rounded-full bg-white/10 p-8 border border-white/20 shadow-glow inline-block">
            <Package size={48} className="text-text-secondary" />
          </div>
          <h3 className="text-2xl font-heading font-bold text-white mb-2">No blueprints acquired</h3>
          <p className="text-text-secondary mb-8">You haven't purchased any designs yet.</p>
          <Button 
            onClick={() => window.location.href = '/designs'}
            className="px-8 py-3 bg-primary text-background hover:bg-primary/90 shadow-glow border-none"
          >
            Browse Designs
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {purchases.map((purchase) => (
            <motion.div
              key={purchase.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-panel overflow-hidden transition-all duration-300 hover:border-primary"
            >
              <div className="p-6">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                  <div className="flex gap-6 items-center">
                    {purchase.preview_url ? (
                      <img
                        src={purchase.preview_url}
                        alt={purchase.title}
                        className="h-24 w-32 object-cover border border-white/10 rounded-lg"
                      />
                    ) : (
                      <div className="h-24 w-32 bg-white/5 border border-white/10 flex items-center justify-center rounded-lg">
                        <FileText className="text-text-secondary" />
                      </div>
                    )}
                    <div>
                      <h3 className="text-xl font-heading font-bold text-white mb-1">
                        {purchase.title}
                      </h3>
                      <p className="text-sm text-text-secondary mb-2">
                        Purchased on {new Date(purchase.created_at).toLocaleDateString()}
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 text-xs font-bold bg-green-500/20 text-green-400 uppercase tracking-wider border border-green-500/30 rounded">
                          PAID
                        </span>
                        <span className="text-white font-bold">KES {purchase.amount}</span>
                      </div>
                    </div>
                  </div>
                  
                  <Button
                    size="sm"
                    variant="outline"
                    className={`min-w-[140px] border-white/20 text-white hover:bg-white/10 ${expandedId === purchase.design_id ? 'bg-primary text-background border-primary hover:bg-primary/90' : ''}`}
                    onClick={() => handleViewFiles(purchase.design_id)}
                  >
                    {expandedId === purchase.design_id ? (
                        <>Hide Files <ChevronUp size={16} className="ml-2" /></>
                    ) : (
                        <>Access Files <ChevronDown size={16} className="ml-2" /></>
                    )}
                  </Button>
                </div>

                <AnimatePresence>
                  {expandedId === purchase.design_id && (
                    <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                      <div className="mt-6 border-t border-white/10 pt-6">
                        <h4 className="mb-4 font-bold text-white flex items-center gap-2 text-sm uppercase tracking-wider">
                          <Download size={18} className="text-primary" /> Available Downloads
                        </h4>
                        {files[purchase.design_id] && files[purchase.design_id].length > 0 ? (
                          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                            {files[purchase.design_id].map((file) => (
                              <a
                                key={file.id}
                                href={file.downloadUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-between border border-white/10 bg-white/5 p-4 hover:bg-white/10 hover:border-primary hover:shadow-glow transition-all group rounded-lg backdrop-blur-sm"
                              >
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white/5 border border-white/10 text-white group-hover:text-primary transition-colors rounded">
                                        <FileText size={20} />
                                    </div>
                                    <div>
                                        <span className="block text-sm font-bold text-white group-hover:text-primary transition-colors">
                                        {file.type.toUpperCase()}
                                        </span>
                                        <span className="text-xs text-text-secondary">Technical Document</span>
                                    </div>
                                </div>
                                <Download className="h-4 w-4 text-text-secondary group-hover:text-primary" />
                              </a>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-text-secondary italic">No files available for download at this time.</p>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Purchases;
