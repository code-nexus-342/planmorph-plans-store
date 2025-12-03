import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  subtitle?: string;
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'red';
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  trend,
  subtitle,
  color = 'blue'
}) => {
  const colorClasses = {
    blue: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
    green: 'bg-green-500/10 text-green-600 dark:text-green-400',
    purple: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
    orange: 'bg-orange-500/10 text-orange-600 dark:text-orange-400',
    red: 'bg-red-500/10 text-red-600 dark:text-red-400'
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950 transition-all hover:shadow-md">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
          <div className="mt-2 flex items-baseline gap-2">
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white">{value}</h3>
            {trend && (
              <span className={`text-sm font-medium ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {trend.isPositive ? '+' : ''}{trend.value}%
              </span>
            )}
          </div>
          {subtitle && (
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{subtitle}</p>
          )}
        </div>
        {Icon && (
          <div className={`rounded-lg p-3 ${colorClasses[color]}`}>
            <Icon className="h-6 w-6" />
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
