-- System Settings Table
-- Stores general configuration for MikroTik, WhatsApp, GenieACS, and Billing System

CREATE TABLE IF NOT EXISTS system_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    category VARCHAR(50) NOT NULL, -- 'mikrotik', 'whatsapp', 'genieacs', 'general'
    key VARCHAR(100) UNIQUE NOT NULL,
    value TEXT,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index for category-based lookups
CREATE INDEX IF NOT EXISTS idx_settings_category ON system_settings(category);

-- Insert Default Settings
INSERT INTO system_settings (category, key, value, description) VALUES
-- General Settings
('general', 'system_name', 'Billing Sembok', 'Nama sistem penagihan'),
('general', 'company_address', 'Jl. Contoh No. 123, Jakarta', 'Alamat perusahaan untuk invoice'),
('general', 'company_phone', '+62 812 3456 789', 'Nomor telepon perusahaan'),
('general', 'billing_cycle_day', '1', 'Tanggal pembuatan invoice otomatis tiap bulan'),
('general', 'grace_period_days', '5', 'Jumlah hari toleransi setelah jatuh tempo sebelum isolir'),

-- MikroTik Settings
('mikrotik', 'mikrotik_host', '192.168.1.1', 'Host IP Mikrotik'),
('mikrotik', 'mikrotik_port', '8728', 'API Port Mikrotik (Default: 8728)'),
('mikrotik', 'mikrotik_user', 'admin', 'Username Mikrotik'),
('mikrotik', 'mikrotik_password', '', 'Password Mikrotik'),
('mikrotik', 'mikrotik_status', 'disabled', 'Status koneksi Mikrotik'),

-- WhatsApp Settings
('whatsapp', 'wa_api_url', 'https://api.whatsapp.com', 'API Endpoint WhatsApp Gateway'),
('whatsapp', 'wa_api_key', '', 'API Key WhatsApp Gateway'),
('whatsapp', 'wa_sender_number', '', 'Nomor pengirim WhatsApp'),
('whatsapp', 'wa_status', 'disabled', 'Status integrasi WhatsApp'),

-- GenieACS Settings
('genieacs', 'acs_url', 'http://localhost:7557', 'URL GenieACS API'),
('genieacs', 'acs_user', '', 'Username GenieACS'),
('genieacs', 'acs_password', '', 'Password GenieACS'),
('genieacs', 'acs_status', 'disabled', 'Status integrasi GenieACS')
ON CONFLICT (key) DO NOTHING;

-- Trigger for updated_at
DROP TRIGGER IF EXISTS trg_settings_updated ON system_settings;
CREATE TRIGGER trg_settings_updated
    BEFORE UPDATE ON system_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
