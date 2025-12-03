import React, { createContext, useContext, useState, useEffect } from 'react';
import { LucideIcon, Activity } from 'lucide-react';
import * as Icons from 'lucide-react';

// Define types based on the backend schema
export interface DashboardWidget {
  id: string;
  type: 'stat' | 'table' | 'chart' | 'list';
  title: string;
  dataKey: string;
  icon?: string; // Icon name as string from backend
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'red';
  subtitle?: string;
  columns?: Array<{
    key: string;
    label: string;
    render?: 'date' | 'currency' | 'status' | 'badge';
  }>;
}

export interface ProfessionalRoleConfig {
  id: number;
  roleType: string; // mapped from role_type
  displayName: string; // mapped from display_name
  icon: string; // mapped from icon_name
  color: 'blue' | 'green' | 'purple' | 'orange' | 'red';
  basePath: string; // mapped from base_path
  apiEndpoint: string; // mapped from api_endpoint
  widgets: DashboardWidget[];
  navItems: Array<{
    path: string;
    label: string;
    icon: string;
  }>; // mapped from nav_items
  capabilities: string[];
}

interface ProfessionalRoleContextType {
  roles: Record<string, ProfessionalRoleConfig>;
  loading: boolean;
  error: string | null;
  getRoleConfig: (roleType: string) => ProfessionalRoleConfig | null;
  getIconComponent: (iconName: string) => LucideIcon;
}

const ProfessionalRoleContext = createContext<ProfessionalRoleContextType | undefined>(undefined);

export const ProfessionalRoleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [roles, setRoles] = useState<Record<string, ProfessionalRoleConfig>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/professional-roles');
        if (!response.ok) {
          throw new Error('Failed to fetch professional roles');
        }
        const data = await response.json();
        
        // Transform array to record for easier access
        const rolesMap: Record<string, ProfessionalRoleConfig> = {};
        data.forEach((role: any) => {
          rolesMap[role.role_type] = {
            id: role.id,
            roleType: role.role_type,
            displayName: role.display_name,
            icon: role.icon_name,
            color: role.color,
            basePath: role.base_path,
            apiEndpoint: role.api_endpoint,
            widgets: role.widgets,
            navItems: role.nav_items,
            capabilities: role.capabilities
          };
        });
        
        setRoles(rolesMap);
      } catch (err) {
        console.error('Error fetching roles:', err);
        setError('Failed to load professional roles');
      } finally {
        setLoading(false);
      }
    };

    fetchRoles();
  }, []);

  const getRoleConfig = (roleType: string) => {
    return roles[roleType] || null;
  };

  // Helper to safely get icon component from string name
  const getIconComponent = (iconName: string): LucideIcon => {
    // @ts-ignore - Dynamic access to Lucide icons
    const Icon = Icons[iconName];
    return Icon || Activity; // Fallback icon
  };

  return (
    <ProfessionalRoleContext.Provider value={{ roles, loading, error, getRoleConfig, getIconComponent }}>
      {children}
    </ProfessionalRoleContext.Provider>
  );
};

export const useProfessionalRoles = () => {
  const context = useContext(ProfessionalRoleContext);
  if (context === undefined) {
    throw new Error('useProfessionalRoles must be used within a ProfessionalRoleProvider');
  }
  return context;
};
