"use client";
import { useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import LoadingSpinner from '../../components/LoadingSpinner';
import ModernDashboard from '../../components/Dashboard/ModernDashboard';
import AdminDashboard from '../../components/Dashboard/AdminDashboard';

export default function DashboardPage() {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/auth');
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  // Render admin dashboard for admin users
  if (user.role === 'admin') {
    return <AdminDashboard />;
  }

  // Modern customer dashboard (includes all user roles except admin)
  return <ModernDashboard />;
}
