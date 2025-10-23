export default function LoadingSpinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-12 h-12', 
    lg: 'w-16 h-16'
  };

  return (
    <div className="relative">
      {/* Outer glow ring */}
      <div className={`${sizeClasses[size]} animate-spin`}>
        <svg className="w-full h-full text-brand-400" fill="none" viewBox="0 0 24 24">
          <circle
            className="opacity-20"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="3"
          />
          <path
            className="opacity-100"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      </div>
      
      {/* Inner pulse */}
      <div className={`absolute inset-0 ${sizeClasses[size]} animate-pulse`}>
        <div className="w-full h-full bg-brand-400/20 rounded-full"></div>
      </div>
    </div>
  );
}

export function PlanCardSkeleton() {
  return (
    <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-2xl overflow-hidden animate-pulse">
      <div className="h-56 bg-slate-800/50 skeleton"></div>
      <div className="p-6">
        <div className="h-6 bg-slate-700/50 skeleton rounded mb-3"></div>
        <div className="flex space-x-4 mb-4">
          <div className="h-4 w-16 bg-slate-700/50 skeleton rounded"></div>
          <div className="h-4 w-16 bg-slate-700/50 skeleton rounded"></div>
          <div className="h-4 w-20 bg-slate-700/50 skeleton rounded"></div>
        </div>
        <div className="flex justify-between items-center">
          <div className="h-8 w-24 bg-slate-700/50 skeleton rounded"></div>
          <div className="h-8 w-20 bg-slate-700/50 skeleton rounded"></div>
        </div>
      </div>
    </div>
  );
}
