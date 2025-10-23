"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';

export default function FavoritesPage() {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    // Redirect unauthenticated users to auth page
    if (!loading && !isAuthenticated) {
      router.push('/auth?redirect=/favorites');
      return;
    }

    // Redirect authenticated users to dashboard favorites tab
    if (!loading && isAuthenticated) {
      router.push('/dashboard#favorites');
    }
  }, [isAuthenticated, loading, router]);

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
        <p className="mt-4 text-gray-400">Redirecting...</p>
      </div>
    </div>
  );
}
