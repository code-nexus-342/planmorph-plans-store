"use client";
import { useState, useEffect } from 'react';
import { Download, FileText, Calendar, Package, ExternalLink, CheckCircle } from 'lucide-react';
import { apiClient } from '../../../lib/api-client';
import LoadingSpinner from '../../LoadingSpinner';

interface DownloadItem {
  id: string;
  purchased_at: string;
  plan_id: string;
  plan: {
    id: string;
    title: string;
    description: string;
  };
  files: Array<{
    id: string;
    file_type: string;
    file_name: string;
    file_size: number;
  }>;
}

export default function DownloadsTab() {
  const [downloads, setDownloads] = useState<DownloadItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  useEffect(() => {
    loadDownloads();
  }, []);

  const loadDownloads = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get<DownloadItem[]>('/downloads');
      
      if (response.success && response.data) {
        setDownloads(response.data);
      }
    } catch (error) {
      console.error('Error loading downloads:', error);
      setDownloads([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (planId: string, fileId: string) => {
    try {
      setDownloadingId(fileId);
      const response = await apiClient.post<{ downloadUrl: string }>(`/downloads/generate/${planId}/${fileId}`);
      
      if (response.success && response.data?.downloadUrl) {
        window.open(response.data.downloadUrl, '_blank');
      }
    } catch (error) {
      console.error('Error generating download:', error);
    } finally {
      setDownloadingId(null);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <Download className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">My Downloads</h2>
            <p className="text-sm text-gray-400">
              {downloads.length} plan{downloads.length !== 1 ? 's' : ''} available for download
            </p>
          </div>
        </div>
      </div>

      {/* Downloads List */}
      {downloads.length === 0 ? (
        <div className="text-center py-16 rounded-2xl border border-dashed border-white/10">
          <Package className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No downloads available</h3>
          <p className="text-gray-400">Purchase plans to access downloadable files</p>
        </div>
      ) : (
        <div className="space-y-4">
          {downloads.map((download) => (
            <div
              key={download.id}
              className="rounded-2xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 p-6 hover:border-purple-500/50 transition-all duration-300"
            >
              {/* Plan Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white mb-1">{download.plan.title}</h3>
                  <p className="text-sm text-gray-400 line-clamp-2">{download.plan.description}</p>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-400 ml-4">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(download.purchased_at)}</span>
                </div>
              </div>

              {/* Files */}
              {download.files.length === 0 ? (
                <div className="text-center py-6 rounded-xl bg-white/5 border border-dashed border-white/10">
                  <FileText className="w-10 h-10 text-gray-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-400">No files available yet</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {download.files.map((file) => (
                    <button
                      key={file.id}
                      onClick={() => handleDownload(download.plan_id, file.id)}
                      disabled={downloadingId === file.id}
                      className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 hover:border-purple-500/60 hover:from-purple-500/20 hover:to-pink-500/20 transition-all duration-300 group disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <div className="flex items-center space-x-3 flex-1 min-w-0">
                        <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                          <FileText className="w-5 h-5 text-purple-400" />
                        </div>
                        <div className="text-left min-w-0">
                          <p className="text-sm font-medium text-white truncate">{file.file_name}</p>
                          <div className="flex items-center space-x-2 text-xs text-gray-400 mt-1">
                            <span className="uppercase">{file.file_type}</span>
                            <span>•</span>
                            <span>{formatFileSize(file.file_size)}</span>
                          </div>
                        </div>
                      </div>
                      {downloadingId === file.id ? (
                        <LoadingSpinner size="sm" />
                      ) : (
                        <ExternalLink className="w-5 h-5 text-purple-400 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform flex-shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
