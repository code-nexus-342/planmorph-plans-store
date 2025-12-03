import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useProfessionalRoles, DashboardWidget } from '../../context/ProfessionalRoleContext';
import StatCard from '../../components/ui/StatCard';
import api from '../../services/api';

// Helper to get nested value from object using dot notation
const getNestedValue = (obj: any, path: string): any => {
  return path.split('.').reduce((current, key) => current?.[key], obj);
};

// Helper to format values based on render type
const formatValue = (value: any, render?: string): string => {
  if (value === null || value === undefined) return '-';
  
  switch (render) {
    case 'date':
      return new Date(value).toLocaleDateString();
    case 'currency':
      return `$${Number(value).toLocaleString()}`;
    case 'status':
    case 'badge':
      return value;
    default:
      return String(value);
  }
};

// Render a stat widget
const StatWidget: React.FC<{ widget: DashboardWidget; data: any }> = ({ widget, data }) => {
  const { getIconComponent } = useProfessionalRoles();
  const value = getNestedValue(data, widget.dataKey);
  const Icon = widget.icon ? getIconComponent(widget.icon) : undefined;
  
  return (
    <StatCard
      title={widget.title}
      value={formatValue(value, widget.type === 'stat' ? undefined : 'currency')}
      icon={Icon}
      color={widget.color}
      subtitle={widget.subtitle}
    />
  );
};

// Render a table widget
const TableWidget: React.FC<{ widget: DashboardWidget; data: any }> = ({ widget, data }) => {
  const tableData = getNestedValue(data, widget.dataKey) || [];
  
  if (!widget.columns) return null;
  
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
        {widget.title}
      </h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
          <thead>
            <tr>
              {widget.columns.map((col) => (
                <th
                  key={col.key}
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
            {tableData.length > 0 ? (
              tableData.slice(0, 10).map((row: any, idx: number) => (
                <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-900">
                  {widget.columns!.map((col) => {
                    const cellValue = row[col.key];
                    const formattedValue = formatValue(cellValue, col.render);
                    
                    return (
                      <td key={col.key} className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                        {col.render === 'status' || col.render === 'badge' ? (
                          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            cellValue === 'approved' || cellValue === 'completed' || cellValue === 'income'
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                              : cellValue === 'pending' || cellValue === 'in_progress'
                              ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400'
                              : cellValue === 'expense'
                              ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                              : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                          }`}>
                            {formattedValue}
                          </span>
                        ) : (
                          formattedValue
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={widget.columns.length} className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Render a list widget
const ListWidget: React.FC<{ widget: DashboardWidget; data: any }> = ({ widget, data }) => {
  const listData = getNestedValue(data, widget.dataKey) || [];
  
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
        {widget.title}
      </h2>
      <div className="space-y-3">
        {listData.length > 0 ? (
          listData.slice(0, 10).map((item: any, idx: number) => (
            <div key={idx} className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-900">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  {item.employee_name || item.title || item.name || 'Item'}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {item.description || item.position || item.location || ''}
                </p>
              </div>
              {item.amount && (
                <div className="text-right">
                  <p className="font-bold text-orange-600">${Number(item.amount).toLocaleString()}</p>
                  {item.created_at && (
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(item.created_at).toLocaleDateString()}
                    </p>
                  )}
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-400 py-8">
            No items to display
          </p>
        )}
      </div>
    </div>
  );
};

// Main Generic Dashboard Component
const ProfessionalDashboard: React.FC = () => {
  const { user } = useAuth();
  const { getRoleConfig, loading: rolesLoading } = useProfessionalRoles();
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const roleConfig = getRoleConfig(user?.role || '');

  useEffect(() => {
    const fetchDashboard = async () => {
      if (!roleConfig) {
        setError('Role configuration not found');
        setLoading(false);
        return;
      }

      try {
        const response = await api.get(`${roleConfig.apiEndpoint}/dashboard`);
        setDashboardData(response.data);
      } catch (err: any) {
        console.error('Failed to fetch dashboard', err);
        setError(err.response?.data?.message || 'Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [roleConfig]);

  if (loading || rolesLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error || !roleConfig) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 dark:border-red-800 dark:bg-red-950/20">
        <p className="text-red-600 dark:text-red-400">{error || 'Configuration error'}</p>
      </div>
    );
  }

  // Separate widgets by type
  const statWidgets = roleConfig.widgets.filter(w => w.type === 'stat');
  const tableWidgets = roleConfig.widgets.filter(w => w.type === 'table');
  const listWidgets = roleConfig.widgets.filter(w => w.type === 'list');

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {roleConfig.displayName} Dashboard
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Overview and performance metrics
        </p>
      </div>

      {/* Stat Widgets */}
      {statWidgets.length > 0 && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {statWidgets.map((widget) => (
            <StatWidget key={widget.id} widget={widget} data={dashboardData} />
          ))}
        </div>
      )}

      {/* List Widgets */}
      {listWidgets.map((widget) => (
        <ListWidget key={widget.id} widget={widget} data={dashboardData} />
      ))}

      {/* Table Widgets */}
      {tableWidgets.map((widget) => (
        <TableWidget key={widget.id} widget={widget} data={dashboardData} />
      ))}
    </div>
  );
};

export default ProfessionalDashboard;
