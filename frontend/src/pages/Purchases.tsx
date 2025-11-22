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
      <div className="flex h-64 items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-neon-cyan border-t-transparent shadow-neon-cyan"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8 flex items-center gap-3">
        <Package className="text-neon-cyan" size={32} />
        <h1 className="text-4xl font-heading font-bold text-white">My Library</h1>
      </div>

      {purchases.length === 0 ? (
        <div className="text-center py-32 glass-panel">
          <div className="mb-6 rounded-full bg-nebula-800 p-8 border border-glass-200 shadow-glass inline-block">
            <Package size={48} className="text-gray-600" />
          </div>
          <h3 className="text-2xl font-heading font-bold text-white mb-2">No blueprints acquired</h3>
          <p className="text-gray-400 mb-8">You haven't purchased any designs yet.</p>
          <Button 
            onClick={() => window.location.href = '/designs'}
            className="bg-neon-cyan text-nebula-900 font-bold hover:bg-white shadow-neon-cyan border-none px-8 py-3"
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
              className="glass-panel overflow-hidden transition-all duration-300 hover:border-neon-cyan/30"
            >
              <div className="p-6">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                  <div className="flex gap-6 items-center">
                    {purchase.preview_url ? (
                      <img
                        src={purchase.preview_url}
                        alt={purchase.title}
                        className="h-24 w-32 rounded-lg object-cover border border-glass-200"
                      />
                    ) : (
                      <div className="h-24 w-32 rounded-lg bg-nebula-800 border border-glass-200 flex items-center justify-center">
                        <FileText className="text-gray-600" />
                      </div>
                    )}
                    <div>
                      <h3 className="text-xl font-heading font-bold text-white mb-1">
                        {purchase.title}
                      </h3>
                      <p className="text-sm text-gray-400 mb-2">
                        Purchased on {new Date(purchase.created_at).toLocaleDateString()}
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-xs font-bold bg-green-500/10 text-green-400 border border-green-500/20">
                          PAID
                        </span>
                        <span className="text-neon-cyan font-bold">${purchase.amount}</span>
                      </div>
                    </div>
                  </div>
                  
                  <Button
                    size="sm"
                    className={`min-w-[140px] border-neon-cyan text-neon-cyan hover:bg-neon-cyan hover:text-nebula-900 transition-all ${expandedId === purchase.design_id ? 'bg-neon-cyan text-nebula-900' : 'bg-transparent'}`}
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
                      <div className="mt-6 border-t border-glass-200 pt-6">
                        <h4 className="mb-4 font-bold text-white flex items-center gap-2">
                          <Download size={18} className="text-neon-cyan" /> Available Downloads
                        </h4>
                        {files[purchase.design_id] && files[purchase.design_id].length > 0 ? (
                          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                            {files[purchase.design_id].map((file) => (
                              <a
                                key={file.id}
                                href={file.downloadUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-between rounded-lg border border-glass-200 bg-nebula-800/50 p-4 hover:bg-nebula-800 hover:border-neon-cyan/50 transition-all group"
                              >
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded bg-nebula-900 text-neon-cyan">
                                        <FileText size={20} />
                                    </div>
                                    <div>
                                        <span className="block text-sm font-bold text-white group-hover:text-neon-cyan transition-colors">
                                        {file.type.toUpperCase()}
                                        </span>
                                        <span className="text-xs text-gray-500">Technical Document</span>
                                    </div>
                                </div>
                                <Download className="h-4 w-4 text-gray-500 group-hover:text-neon-cyan" />
                              </a>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500 italic">No files available for download at this time.</p>
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
