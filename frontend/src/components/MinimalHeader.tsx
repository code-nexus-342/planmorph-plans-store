"use client";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

export default function MinimalHeader() {
  const { isAuthenticated, user } = useAuth();

  return (
    <header className="fixed top-0 w-full z-50 backdrop-blur-md bg-slate-950/80 border-b border-slate-800/30">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 sm:space-x-3 group flex-shrink-0">
            <div className="relative">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center overflow-hidden shadow-glow group-hover:shadow-glow-lg transition-all duration-300">
                <img 
                  src="/planmorph-logo.jpg" 
                  alt="PlanMorph Logo" 
                  className="w-full h-full object-contain" 
                />
              </div>
              <div className="absolute -top-1 -right-1 w-2 h-2 sm:w-3 sm:h-3">
                <Sparkles className="w-full h-full text-brand-400 animate-pulse" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                PlanMorph
              </span>
              <div className="text-[10px] sm:text-xs text-brand-400 font-medium tracking-wide hidden xs:block">
                ARCHITECTURAL EXCELLENCE
              </div>
            </div>
          </Link>

          {/* Auth Actions */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {isAuthenticated ? (
              <>
                <Link 
                  href="/dashboard" 
                  className="flex items-center space-x-2 px-3 sm:px-5 py-2 sm:py-2.5 rounded-lg sm:rounded-xl bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 text-cyan-400 hover:bg-gradient-to-r hover:from-cyan-500 hover:to-blue-500 hover:text-white text-xs sm:text-sm font-medium transition-all duration-300"
                >
                  <span className="hidden xs:inline">Dashboard</span>
                  <span className="xs:hidden">DB</span>
                </Link>
                <div className="hidden md:block text-xs sm:text-sm text-gray-400 max-w-[120px] truncate">
                  Hi, <span className="text-brand-400 font-medium">{user?.first_name}</span>
                </div>
              </>
            ) : (
              <Link 
                href="/auth"
                className="px-4 sm:px-6 py-2 sm:py-2.5 bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-all duration-300 transform hover:scale-105 shadow-glow hover:shadow-glow-lg whitespace-nowrap"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
