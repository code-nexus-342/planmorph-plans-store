-- Add approval tracking columns to professional_applications
ALTER TABLE professional_applications ADD COLUMN approved_by INTEGER[] DEFAULT '{}';
ALTER TABLE professional_applications ADD COLUMN rejected_by INTEGER[] DEFAULT '{}';

-- Create Administrator role if it doesn't exist
INSERT INTO professional_roles (name, description) 
VALUES ('Administrator', 'Platform administrator with full access')
ON CONFLICT (name) DO NOTHING;

-- Seed lawravasco@gmail.com as Admin
DO $$
DECLARE
    admin_role_id INTEGER;
    user_record RECORD;
    existing_pro_id INTEGER;
BEGIN
    -- Get Administrator role ID
    SELECT id INTO admin_role_id FROM professional_roles WHERE name = 'Administrator';

    -- Get existing user record
    SELECT * INTO user_record FROM users WHERE email = 'lawravasco@gmail.com';

    -- If user exists, ensure they are an admin in users table
    IF FOUND THEN
        UPDATE users SET role = 'admin' WHERE id = user_record.id;
        
        -- Check if professional record exists
        SELECT id INTO existing_pro_id FROM professionals WHERE email = 'lawravasco@gmail.com';
        
        IF existing_pro_id IS NULL THEN
            -- Create professional record for admin using same credentials
            INSERT INTO professionals (
                email, 
                password_hash, 
                professional_role_id, 
                full_name, 
                status,
                bio
            ) VALUES (
                'lawravasco@gmail.com',
                user_record.password_hash,
                admin_role_id,
                'Lawra Vasco',
                'approved',
                'Platform Administrator'
            );
        ELSE
            -- Update existing professional record to be an admin
            UPDATE professionals 
            SET professional_role_id = admin_role_id,
                status = 'approved'
            WHERE id = existing_pro_id;
        END IF;
    END IF;
END $$;
