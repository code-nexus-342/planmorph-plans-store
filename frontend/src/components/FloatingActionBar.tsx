"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Home, 
  LayoutGrid, 
  View, 
  DollarSign, 
  ShoppingCart,
  Heart,
  Search,
  Menu,
  X
} from "lucide-react";
import { useCart } from "../hooks/useCart";

interface NavItem {
  label: string;
  href: string;
  icon: any;
}

interface ActionItem {
  label: string;
  icon: any;
  href?: string;
  action?: () => void;
  badge?: number;
}

export default function FloatingActionBar() {
  const pathname = usePathname();
  const { cart } = useCart();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll to show/hide based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems: NavItem[] = [
    { label: "Home", href: "/", icon: Home },
    { label: "Plans", href: "/plans", icon: LayoutGrid },
    { label: "3D Tours", href: "/3d-tours", icon: View },
    { label: "Pricing", href: "/pricing", icon: DollarSign },
    { label: "Categories", href: "/categories", icon: Menu },
  ];

  const actionItems: ActionItem[] = [
    { label: "Search", icon: Search, action: () => setIsExpanded(!isExpanded) },
    { label: "Favorites", href: "/dashboard", icon: Heart },
    { label: "Cart", href: "/cart", icon: ShoppingCart, badge: cart?.items?.length || 0 },
  ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname?.startsWith(href);
  };

  return (
    <>
      {/* Floating Action Bar */}
      <div 
        className={`fixed bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2 z-40 w-[95%] sm:w-auto max-w-[95vw] transition-all duration-500 ${
          isScrolled ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20 pointer-events-none'
        }`}
      >
        <div className="relative">
          {/* Main Navigation Bar */}
          <div className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 sm:py-3 rounded-xl sm:rounded-2xl bg-slate-900/95 backdrop-blur-xl border border-white/10 shadow-2xl overflow-x-auto scrollbar-hide">
            {/* Navigation Items */}
            <div className="hidden md:flex items-center gap-2 flex-shrink-0">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group relative flex items-center gap-2 px-3 lg:px-4 py-2 lg:py-2.5 rounded-xl transition-all duration-300 whitespace-nowrap ${
                    isActive(item.href)
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/50'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <item.icon className="w-4 h-4 lg:w-5 lg:h-5" />
                  <span className="text-xs lg:text-sm font-medium">{item.label}</span>
                  
                  {/* Active Indicator */}
                  {isActive(item.href) && (
                    <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-white animate-pulse" />
                  )}
                </Link>
              ))}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="md:hidden flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-300"
            >
              {isExpanded ? <X className="w-4 h-4 sm:w-5 sm:h-5" /> : <Menu className="w-4 h-4 sm:w-5 sm:h-5" />}
              <span className="text-xs sm:text-sm font-medium">Menu</span>
            </button>

            {/* Divider */}
            <div className="hidden md:block w-px h-6 lg:h-8 bg-white/10 flex-shrink-0" />

            {/* Action Items */}
            <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
              {actionItems.map((item, index) => (
                item.href ? (
                  <Link
                    key={index}
                    href={item.href}
                    className="relative p-2 sm:p-2.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-300 group"
                  >
                    <item.icon className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform" />
                    {item.badge && item.badge > 0 && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 text-white text-[10px] sm:text-xs flex items-center justify-center font-medium shadow-lg">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                ) : (
                  <button
                    key={index}
                    onClick={item.action}
                    className="p-2 sm:p-2.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-300 group"
                  >
                    <item.icon className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform" />
                  </button>
                )
              ))}
            </div>
          </div>

          {/* Expanded Mobile Menu */}
          {isExpanded && (
            <div className="absolute bottom-full left-0 right-0 mb-3 sm:mb-4 p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-slate-900/95 backdrop-blur-xl border border-white/10 shadow-2xl max-h-[70vh] overflow-y-auto">
              <div className="space-y-1.5 sm:space-y-2">
                {/* Search Input */}
                <div className="relative mb-3 sm:mb-4">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search plans..."
                    className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 bg-white/5 border border-white/10 rounded-lg sm:rounded-xl text-sm sm:text-base text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                  />
                </div>

                {/* Mobile Nav Items */}
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsExpanded(false)}
                    className={`flex items-center gap-2.5 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl transition-all duration-300 ${
                      isActive(item.href)
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <item.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="text-sm sm:text-base font-medium">{item.label}</span>
                  </Link>
                ))}

                <div className="h-px bg-white/10 my-1.5 sm:my-2" />

                {/* Mobile Action Items */}
                {actionItems.map((item, index) => (
                  item.href ? (
                    <Link
                      key={index}
                      href={item.href}
                      onClick={() => setIsExpanded(false)}
                      className="flex items-center gap-2.5 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-300"
                    >
                      <item.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="text-sm sm:text-base font-medium">{item.label}</span>
                      {item.badge && item.badge > 0 && (
                        <span className="ml-auto w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 text-white text-[10px] sm:text-xs flex items-center justify-center font-medium">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  ) : null
                ))}
              </div>
            </div>
          )}

          {/* Search Bar (Desktop Expanded) */}
          {isExpanded && (
            <div className="hidden md:block absolute bottom-full left-0 right-0 mb-4 p-4 rounded-2xl bg-slate-900/95 backdrop-blur-xl border border-white/10 shadow-2xl">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search house plans..."
                  autoFocus
                  className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Spacer for Mobile - Adjust based on screen size */}
      <div className="h-20 sm:h-24" />
    </>
  );
}
