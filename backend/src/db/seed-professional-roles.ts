import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

const ROLES = [
  {
    role_type: 'finance_manager',
    display_name: 'Finance Manager',
    icon_name: 'DollarSign',
    color: 'blue',
    base_path: '/finance',
    api_endpoint: '/finance',
    widgets: [
      {
        id: 'total_income',
        type: 'stat',
        title: 'Total Income',
        dataKey: 'overview.total_income',
        icon: 'TrendingUp',
        color: 'green',
        subtitle: 'All time'
      },
      {
        id: 'total_expenses',
        type: 'stat',
        title: 'Total Expenses',
        dataKey: 'overview.total_expenses',
        icon: 'TrendingUp',
        color: 'red',
        subtitle: 'All time'
      },
      {
        id: 'net_profit',
        type: 'stat',
        title: 'Net Profit',
        dataKey: 'overview.net_profit',
        icon: 'DollarSign',
        color: 'green',
        subtitle: 'Income - Expenses'
      },
      {
        id: 'recent_transactions',
        type: 'stat',
        title: 'Recent Transactions',
        dataKey: 'overview.recent_transactions',
        icon: 'FileText',
        color: 'blue',
        subtitle: 'Last 30 days'
      },
      {
        id: 'transactions_table',
        type: 'table',
        title: 'Recent Transactions',
        dataKey: 'recentTransactions',
        columns: [
          { key: 'transaction_date', label: 'Date', render: 'date' },
          { key: 'record_type', label: 'Type', render: 'badge' },
          { key: 'category', label: 'Category' },
          { key: 'description', label: 'Description' },
          { key: 'amount', label: 'Amount', render: 'currency' }
        ]
      }
    ],
    nav_items: [
      { path: '/finance/dashboard', label: 'Dashboard', icon: 'Activity' },
      { path: '/finance/records', label: 'Records', icon: 'FileText' },
      { path: '/finance/reports', label: 'Reports', icon: 'DollarSign' }
    ],
    capabilities: ['view_finances', 'manage_finances', 'generate_reports']
  },
  {
    role_type: 'hr_manager',
    display_name: 'HR Manager',
    icon_name: 'Users',
    color: 'purple',
    base_path: '/hr',
    api_endpoint: '/hr',
    widgets: [
      {
        id: 'total_employees',
        type: 'stat',
        title: 'Total Employees',
        dataKey: 'employeeStats.total_employees',
        icon: 'Users',
        color: 'blue',
        subtitle: 'Active employees'
      },
      {
        id: 'pending_payments',
        type: 'stat',
        title: 'Pending Payments',
        dataKey: 'paymentStats.pending_payments',
        icon: 'DollarSign',
        color: 'orange',
        subtitle: 'Awaiting release'
      },
      {
        id: 'released_payments',
        type: 'stat',
        title: 'Released Payments',
        dataKey: 'paymentStats.released_payments',
        icon: 'DollarSign',
        color: 'green',
        subtitle: 'Completed'
      },
      {
        id: 'on_leave',
        type: 'stat',
        title: 'On Leave',
        dataKey: 'employeeStats.on_leave',
        icon: 'Users',
        color: 'purple',
        subtitle: 'Employees'
      },
      {
        id: 'pending_payments_list',
        type: 'list',
        title: 'Pending Payments',
        dataKey: 'pendingPayments'
      }
    ],
    nav_items: [
      { path: '/hr/dashboard', label: 'Dashboard', icon: 'Activity' },
      { path: '/hr/employees', label: 'Employees', icon: 'Users' },
      { path: '/hr/payments', label: 'Payments', icon: 'DollarSign' }
    ],
    capabilities: ['manage_employees', 'release_payments', 'view_hr_data']
  },
  {
    role_type: 'civil_engineer',
    display_name: 'Civil Engineer',
    icon_name: 'Building2',
    color: 'orange',
    base_path: '/engineer',
    api_endpoint: '/engineer',
    widgets: [
      {
        id: 'total_drawings',
        type: 'stat',
        title: 'Total Drawings',
        dataKey: 'drawingStats.total_drawings',
        icon: 'FileText',
        color: 'orange',
        subtitle: 'All time'
      },
      {
        id: 'approved_drawings',
        type: 'stat',
        title: 'Approved',
        dataKey: 'drawingStats.approved_drawings',
        icon: 'TrendingUp',
        color: 'green',
        subtitle: 'Completed'
      },
      {
        id: 'in_review',
        type: 'stat',
        title: 'In Review',
        dataKey: 'drawingStats.in_review',
        icon: 'Activity',
        color: 'blue',
        subtitle: 'Pending approval'
      },
      {
        id: 'designs_worked_on',
        type: 'stat',
        title: 'Designs Worked On',
        dataKey: 'collaborationStats.designs_worked_on',
        icon: 'Briefcase',
        color: 'purple',
        subtitle: 'Projects'
      },
      {
        id: 'recent_drawings_table',
        type: 'table',
        title: 'Recent Structural Drawings',
        dataKey: 'recentDrawings',
        columns: [
          { key: 'title', label: 'Title' },
          { key: 'design_title', label: 'Design' },
          { key: 'drawing_type', label: 'Type' },
          { key: 'status', label: 'Status', render: 'status' },
          { key: 'created_at', label: 'Date', render: 'date' }
        ]
      }
    ],
    nav_items: [
      { path: '/engineer/dashboard', label: 'Dashboard', icon: 'Activity' },
      { path: '/engineer/designs', label: 'Designs', icon: 'Briefcase' },
      { path: '/engineer/drawings', label: 'Drawings', icon: 'FileText' }
    ],
    capabilities: ['view_designs', 'upload_drawings', 'manage_drawings']
  },
  {
    role_type: 'surveyor',
    display_name: 'Surveyor',
    icon_name: 'Map',
    color: 'red',
    base_path: '/surveyor',
    api_endpoint: '/surveyor',
    widgets: [
      {
        id: 'total_surveys',
        type: 'stat',
        title: 'Total Surveys',
        dataKey: 'surveyStats.total_surveys',
        icon: 'Map',
        color: 'red',
        subtitle: 'All time'
      },
      {
        id: 'in_progress',
        type: 'stat',
        title: 'In Progress',
        dataKey: 'surveyStats.in_progress',
        icon: 'Activity',
        color: 'orange',
        subtitle: 'Active surveys'
      },
      {
        id: 'completed',
        type: 'stat',
        title: 'Completed',
        dataKey: 'surveyStats.completed',
        icon: 'TrendingUp',
        color: 'green',
        subtitle: 'Finished'
      },
      {
        id: 'reviewed',
        type: 'stat',
        title: 'Reviewed',
        dataKey: 'surveyStats.reviewed',
        icon: 'FileText',
        color: 'blue',
        subtitle: 'Approved'
      },
      {
        id: 'recent_surveys_table',
        type: 'table',
        title: 'Recent Surveys',
        dataKey: 'recentSurveys',
        columns: [
          { key: 'title', label: 'Title' },
          { key: 'location', label: 'Location' },
          { key: 'survey_type', label: 'Type' },
          { key: 'status', label: 'Status', render: 'status' },
          { key: 'survey_date', label: 'Survey Date', render: 'date' }
        ]
      }
    ],
    nav_items: [
      { path: '/surveyor/dashboard', label: 'Dashboard', icon: 'Activity' },
      { path: '/surveyor/surveys', label: 'Surveys', icon: 'Map' }
    ],
    capabilities: ['create_surveys', 'manage_surveys', 'generate_reports']
  }
];

async function seedRoles() {
  try {
    console.log('Seeding professional roles...');
    
    for (const role of ROLES) {
      await pool.query(
        `INSERT INTO professional_roles 
         (role_type, display_name, icon_name, color, base_path, api_endpoint, widgets, nav_items, capabilities)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         ON CONFLICT (role_type) DO UPDATE SET
           display_name = EXCLUDED.display_name,
           icon_name = EXCLUDED.icon_name,
           color = EXCLUDED.color,
           base_path = EXCLUDED.base_path,
           api_endpoint = EXCLUDED.api_endpoint,
           widgets = EXCLUDED.widgets,
           nav_items = EXCLUDED.nav_items,
           capabilities = EXCLUDED.capabilities,
           updated_at = CURRENT_TIMESTAMP`,
        [
          role.role_type,
          role.display_name,
          role.icon_name,
          role.color,
          role.base_path,
          role.api_endpoint,
          JSON.stringify(role.widgets),
          JSON.stringify(role.nav_items),
          role.capabilities
        ]
      );
      console.log(`✓ Seeded role: ${role.display_name}`);
    }
    
    console.log('All roles seeded successfully');
    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    await pool.end();
    process.exit(1);
  }
}

seedRoles();
