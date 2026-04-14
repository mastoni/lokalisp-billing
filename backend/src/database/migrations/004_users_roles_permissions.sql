-- Users, Roles, and Permissions System
-- Migration for authentication and authorization

-- Create roles table
CREATE TABLE IF NOT EXISTS roles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create permissions table
CREATE TABLE IF NOT EXISTS permissions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    resource VARCHAR(50) NOT NULL,
    action VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create role_permissions junction table
CREATE TABLE IF NOT EXISTS role_permissions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    permission_id UUID NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(role_id, permission_id)
);

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    role_id UUID NOT NULL REFERENCES roles(id),
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create user_sessions table for token management
CREATE TABLE IF NOT EXISTS user_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token TEXT NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_token ON user_sessions(token);
CREATE INDEX IF NOT EXISTS idx_user_sessions_user ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_role_permissions_role ON role_permissions(role_id);
CREATE INDEX IF NOT EXISTS idx_role_permissions_permission ON role_permissions(permission_id);

-- Insert default roles
INSERT INTO roles (name, description) VALUES
('admin', 'System administrator with full access'),
('customer', 'ISP customer with limited access'),
('teknisi', 'Technical staff for maintenance and support'),
('agen', 'Agent/reseller with customer management access')
ON CONFLICT (name) DO NOTHING;

-- Insert permissions
-- Admin permissions
INSERT INTO permissions (name, description, resource, action) VALUES
('users:read', 'View users', 'users', 'read'),
('users:write', 'Create and update users', 'users', 'write'),
('users:delete', 'Delete users', 'users', 'delete'),
('customers:read', 'View customers', 'customers', 'read'),
('customers:write', 'Create and update customers', 'customers', 'write'),
('customers:delete', 'Delete customers', 'customers', 'delete'),
('invoices:read', 'View invoices', 'invoices', 'read'),
('invoices:write', 'Create and update invoices', 'invoices', 'write'),
('invoices:delete', 'Delete invoices', 'invoices', 'delete'),
('payments:read', 'View payments', 'payments', 'read'),
('payments:write', 'Create and update payments', 'payments', 'write'),
('payments:delete', 'Delete payments', 'payments', 'delete'),
('packages:read', 'View packages', 'packages', 'read'),
('packages:write', 'Create and update packages', 'packages', 'write'),
('packages:delete', 'Delete packages', 'packages', 'delete'),
('dashboard:read', 'View dashboard', 'dashboard', 'read'),
('dashboard:write', 'Manage dashboard settings', 'dashboard', 'write'),
('rewards:read', 'View rewards', 'rewards', 'read'),
('rewards:write', 'Manage rewards', 'rewards', 'write'),
('devices:read', 'View devices', 'devices', 'read'),
('devices:write', 'Manage devices', 'devices', 'write'),
('settings:read', 'View settings', 'settings', 'read'),
('settings:write', 'Update settings', 'settings', 'write'),
('reports:read', 'View reports', 'reports', 'read'),
('reports:export', 'Export reports', 'reports', 'export')
ON CONFLICT (name) DO NOTHING;

-- Assign all permissions to admin role
INSERT INTO role_permissions (role_id, permission_id)
SELECT 
    (SELECT id FROM roles WHERE name = 'admin'),
    id
FROM permissions
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- Assign customer permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT 
    (SELECT id FROM roles WHERE name = 'customer'),
    id
FROM permissions
WHERE resource IN ('invoices', 'payments', 'dashboard') 
  AND action IN ('read', 'write')
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- Assign teknisi permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT 
    (SELECT id FROM roles WHERE name = 'teknisi'),
    id
FROM permissions
WHERE resource IN ('customers', 'devices', 'dashboard', 'reports')
  AND action IN ('read', 'write')
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- Assign agen permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT 
    (SELECT id FROM roles WHERE name = 'agen'),
    id
FROM permissions
WHERE resource IN ('customers', 'invoices', 'payments', 'dashboard')
  AND action IN ('read', 'write')
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- Insert default admin user (password: admin123)
-- Hash will be generated by seed script
INSERT INTO users (username, email, password_hash, full_name, phone, role_id, is_active)
SELECT 
    'admin',
    'admin@lokalisp.com',
    '$2b$10$vJa8wwKH9BSjsM4sNtCANe72SOwuMcvLglGlKCJNAc5gmHr.ueXKK',
    'System Administrator',
    '+6281234567890',
    (SELECT id FROM roles WHERE name = 'admin'),
    true
WHERE NOT EXISTS (SELECT 1 FROM users WHERE username = 'admin')
ON CONFLICT (username) DO NOTHING;

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS trg_users_updated ON users;
CREATE TRIGGER trg_users_updated
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

COMMENT ON TABLE roles IS 'User roles in the system';
COMMENT ON TABLE permissions IS 'Available permissions for resources';
COMMENT ON TABLE role_permissions IS 'Mapping between roles and permissions';
COMMENT ON TABLE users IS 'System users with authentication';
COMMENT ON TABLE user_sessions IS 'Active user sessions and tokens';
