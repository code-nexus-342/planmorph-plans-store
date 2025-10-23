"use client";
import { useSettings, formatCurrency, formatTime } from '../contexts/SettingsContext';

export function SettingsDisplay() {
  const { settings } = useSettings();
  
  return (
    <div className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 text-sm max-w-xs border border-gray-200 dark:border-gray-700">
      <h4 className="font-bold mb-2 text-gray-900 dark:text-white">Current Settings</h4>
      <div className="space-y-1 text-gray-600 dark:text-gray-300">
        <div>Theme: <span className="font-medium">{settings.theme}</span></div>
        <div>Language: <span className="font-medium">{settings.language}</span></div>
        <div>Currency: <span className="font-medium">{formatCurrency(99.99, settings.currency)}</span></div>
        <div>Time: <span className="font-medium">{formatTime(new Date(), settings.timezone)}</span></div>
      </div>
    </div>
  );
}
