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
      <div className="flex h-64 items-center justify-center bg-white">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-accent-teal"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 pt-24">
      <div className="mb-8 flex items-center gap-3 border-b border-gray-100 pb-6">
        <Package className="text-accent-teal" size={32} />
        <h1 className="text-4xl font-heading font-bold text-architect-900">My Library</h1>
      </div>

      {purchases.length === 0 ? (
        <div className="text-center py-32 bg-gray-50 border border-gray-100">
          <div className="mb-6 rounded-full bg-white p-8 border border-gray-200 shadow-sm inline-block">
            <Package size={48} className="text-gray-300" />
          </div>
          <h3 className="text-2xl font-heading font-bold text-architect-900 mb-2">No blueprints acquired</h3>
          <p className="text-gray-500 mb-8">You haven't purchased any designs yet.</p>
          <Button 
            onClick={() => window.location.href = '/designs'}
            className="px-8 py-3"
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
              className="bg-white border border-gray-200 shadow-soft overflow-hidden transition-all duration-300 hover:border-accent-teal"
            >
              <div className="p-6">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                  <div className="flex gap-6 items-center">
                    {purchase.preview_url ? (
                      <img
                        src={purchase.preview_url}
                        alt={purchase.title}
                        className="h-24 w-32 object-cover border border-gray-200"
                      />
                    ) : (
                      <div className="h-24 w-32 bg-gray-100 border border-gray-200 flex items-center justify-center">
                        <FileText className="text-gray-400" />
                      </div>
                    )}
                    <div>
                      <h3 className="text-xl font-heading font-bold text-architect-900 mb-1">
                        {purchase.title}
                      </h3>
                      <p className="text-sm text-gray-500 mb-2">
                        Purchased on {new Date(purchase.created_at).toLocaleDateString()}
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 text-xs font-bold bg-green-100 text-green-700 uppercase tracking-wider">
                          PAID
                        </span>
                        <span className="text-architect-900 font-bold">${purchase.amount}</span>
                      </div>
                    </div>
                  </div>
                  
                  <Button
                    size="sm"
                    variant="outline"
                    className={`min-w-[140px] ${expandedId === purchase.design_id ? 'bg-architect-900 text-white' : ''}`}
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
                      <div className="mt-6 border-t border-gray-100 pt-6">
                        <h4 className="mb-4 font-bold text-architect-900 flex items-center gap-2 text-sm uppercase tracking-wider">
                          <Download size={18} className="text-accent-teal" /> Available Downloads
                        </h4>
                        {files[purchase.design_id] && files[purchase.design_id].length > 0 ? (
                          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                            {files[purchase.design_id].map((file) => (
                              <a
                                key={file.id}
                                href={file.downloadUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-between border border-gray-200 bg-gray-50 p-4 hover:bg-white hover:border-accent-teal hover:shadow-sm transition-all group"
                              >
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white border border-gray-200 text-architect-900 group-hover:text-accent-teal transition-colors">
                                        <FileText size={20} />
                                    </div>
                                    <div>
                                        <span className="block text-sm font-bold text-architect-900 group-hover:text-accent-teal transition-colors">
                                        {file.type.toUpperCase()}
                                        </span>
                                        <span className="text-xs text-gray-500">Technical Document</span>
                                    </div>
                                </div>
                                <Download className="h-4 w-4 text-gray-400 group-hover:text-accent-teal" />
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
