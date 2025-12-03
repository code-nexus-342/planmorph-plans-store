import pool from './index';
import bcrypt from 'bcryptjs';

async function seedExtensions() {
  try {
    console.log('Starting seed extensions...');

    // Create admin user if not exists (for creating job roles)
    const adminCheck = await pool.query('SELECT id FROM users WHERE email = $1', ['admin@planmorph.com']);
    let adminId: number;
    
    if (adminCheck.rows.length === 0) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      const adminResult = await pool.query(
        'INSERT INTO users (email, password_hash, role, is_verified) VALUES ($1, $2, $3, $4) RETURNING id',
        ['admin@planmorph.com', hashedPassword, 'admin', true]
      );
      adminId = adminResult.rows[0].id;
      console.log('Admin user created');
    } else {
      adminId = adminCheck.rows[0].id;
      console.log('Admin user already exists');
    }

    // Seed Job Roles
    const jobRoles = [
      {
        title: 'Finance Manager',
        role_type: 'finance_manager',
        description: 'Manage company finances, budgets, and financial reporting',
        requirements: [
          'Bachelor\'s degree in Finance, Accounting, or related field',
          'Minimum 5 years of financial management experience',
          'Proficiency in financial software and Excel',
          'Strong analytical and problem-solving skills'
        ],
        responsibilities: [
          'Oversee company financial operations',
          'Prepare financial reports and forecasts',
          'Manage budgets and financial planning',
          'Ensure compliance with financial regulations',
          'Analyze financial data and provide insights'
        ],
        qualifications: [
          'CPA or CFA certification preferred',
          'Experience with financial management systems',
          'Strong understanding of accounting principles',
          'Excellent communication skills'
        ],
        department: 'Finance',
        status: 'open'
      },
      {
        title: 'HR Manager',
        role_type: 'hr_manager',
        description: 'Lead human resources operations including hiring, employee management, and payroll',
        requirements: [
          'Bachelor\'s degree in Human Resources or related field',
          'Minimum 4 years of HR management experience',
          'Knowledge of employment laws and regulations',
          'Strong interpersonal and communication skills'
        ],
        responsibilities: [
          'Manage recruitment and hiring processes',
          'Handle employee relations and conflict resolution',
          'Process and release employee payments',
          'Maintain employee records and documentation',
          'Develop and implement HR policies'
        ],
        qualifications: [
          'SHRM or HRCI certification preferred',
          'Experience with HRIS systems',
          'Strong organizational skills',
          'Ability to handle confidential information'
        ],
        department: 'Human Resources',
        status: 'open'
      },
      {
        title: 'Civil Engineer',
        role_type: 'civil_engineer',
        description: 'Create structural drawings and engineering plans for architectural designs',
        requirements: [
          'Bachelor\'s degree in Civil Engineering',
          'Professional Engineer (PE) license',
          'Minimum 3 years of structural engineering experience',
          'Proficiency in CAD and structural analysis software'
        ],
        responsibilities: [
          'Review architectural designs for structural feasibility',
          'Create detailed structural drawings and plans',
          'Perform structural calculations and analysis',
          'Collaborate with architects on design modifications',
          'Ensure compliance with building codes and standards'
        ],
        qualifications: [
          'PE license required',
          'Experience with AutoCAD, Revit, or similar software',
          'Strong understanding of structural principles',
          'Attention to detail and accuracy'
        ],
        department: 'Engineering',
        status: 'open'
      },
      {
        title: 'Land Surveyor',
        role_type: 'surveyor',
        description: 'Conduct land surveys and provide accurate site assessments',
        requirements: [
          'Bachelor\'s degree in Surveying or related field',
          'Licensed Professional Land Surveyor',
          'Minimum 3 years of surveying experience',
          'Proficiency with surveying equipment and software'
        ],
        responsibilities: [
          'Conduct land and topographic surveys',
          'Prepare survey reports and documentation',
          'Use GPS and other surveying equipment',
          'Analyze survey data and create maps',
          'Ensure accuracy and compliance with standards'
        ],
        qualifications: [
          'Professional Land Surveyor license',
          'Experience with GPS and total station equipment',
          'Knowledge of surveying software',
          'Strong mathematical and analytical skills'
        ],
        department: 'Surveying',
        status: 'open'
      }
    ];

    for (const role of jobRoles) {
      const existing = await pool.query('SELECT id FROM job_roles WHERE title = $1', [role.title]);
      
      if (existing.rows.length === 0) {
        await pool.query(
          `INSERT INTO job_roles 
          (title, role_type, description, requirements, responsibilities, qualifications, department, status, created_by) 
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
          [
            role.title,
            role.role_type,
            role.description,
            role.requirements,
            role.responsibilities,
            role.qualifications,
            role.department,
            role.status,
            adminId
          ]
        );
        console.log(`Created job role: ${role.title}`);
      } else {
        console.log(`Job role already exists: ${role.title}`);
      }
    }

    // Create test professional accounts
    const professionals = [
      {
        email: 'finance@planmorph.com',
        password: 'finance123',
        role: 'finance_manager',
        profile: {
          role_type: 'finance_manager',
          full_name: 'Sarah Johnson',
          phone_number: '+1-555-0101',
          bio: 'Experienced finance manager with 8 years in the industry',
          experience_years: 8,
          department: 'Finance'
        }
      },
      {
        email: 'hr@planmorph.com',
        password: 'hr123',
        role: 'hr_manager',
        profile: {
          role_type: 'hr_manager',
          full_name: 'Michael Chen',
          phone_number: '+1-555-0102',
          bio: 'HR professional specializing in talent acquisition and employee relations',
          experience_years: 6,
          department: 'Human Resources'
        }
      },
      {
        email: 'engineer@planmorph.com',
        password: 'engineer123',
        role: 'civil_engineer',
        profile: {
          role_type: 'civil_engineer',
          full_name: 'David Martinez',
          phone_number: '+1-555-0103',
          bio: 'Licensed Professional Engineer with expertise in structural design',
          experience_years: 10,
          department: 'Engineering'
        }
      },
      {
        email: 'surveyor@planmorph.com',
        password: 'surveyor123',
        role: 'surveyor',
        profile: {
          role_type: 'surveyor',
          full_name: 'Emily Thompson',
          phone_number: '+1-555-0104',
          bio: 'Licensed Land Surveyor with extensive field experience',
          experience_years: 7,
          department: 'Surveying'
        }
      }
    ];

    for (const prof of professionals) {
      const userCheck = await pool.query('SELECT id FROM users WHERE email = $1', [prof.email]);
      
      if (userCheck.rows.length === 0) {
        const hashedPassword = await bcrypt.hash(prof.password, 10);
        const userResult = await pool.query(
          'INSERT INTO users (email, password_hash, role, is_verified) VALUES ($1, $2, $3, $4) RETURNING id',
          [prof.email, hashedPassword, prof.role, true]
        );
        const userId = userResult.rows[0].id;

        await pool.query(
          `INSERT INTO professional_profiles 
          (user_id, role_type, full_name, phone_number, bio, experience_years, department, hire_date) 
          VALUES ($1, $2, $3, $4, $5, $6, $7, CURRENT_DATE)`,
          [
            userId,
            prof.profile.role_type,
            prof.profile.full_name,
            prof.profile.phone_number,
            prof.profile.bio,
            prof.profile.experience_years,
            prof.profile.department
          ]
        );
        console.log(`Created professional account: ${prof.email}`);
      } else {
        console.log(`Professional account already exists: ${prof.email}`);
      }
    }

    console.log('Seed extensions completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding extensions:', error);
    process.exit(1);
  }
}

seedExtensions();
