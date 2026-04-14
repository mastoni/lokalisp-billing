-- Migration 006: Add RADIUS settings, GenieACS webhook secret, and last_seen tracking

-- Add last_seen tracking for devices (network devices)
ALTER TABLE devices ADD COLUMN IF NOT EXISTS last_seen TIMESTAMP;
ALTER TABLE devices ADD COLUMN IF NOT EXISTS acs_device_id TEXT;

-- Add ACS device mapping and last_seen for customers (CPE/ONT managed by GenieACS)
ALTER TABLE customers ADD COLUMN IF NOT EXISTS acs_device_id TEXT;
ALTER TABLE customers ADD COLUMN IF NOT EXISTS last_seen TIMESTAMP;

CREATE INDEX IF NOT EXISTS idx_customers_acs_device_id ON customers(acs_device_id);
CREATE INDEX IF NOT EXISTS idx_customers_last_seen ON customers(last_seen);
CREATE INDEX IF NOT EXISTS idx_devices_last_seen ON devices(last_seen);
CREATE INDEX IF NOT EXISTS idx_devices_acs_device_id ON devices(acs_device_id);

-- Insert additional default settings (idempotent)
INSERT INTO system_settings (category, key, value, description) VALUES
-- RADIUS Settings
('radius', 'radius_host', '127.0.0.1', 'Host/IP RADIUS server'),
('radius', 'radius_port', '1812', 'UDP port RADIUS server (Default: 1812)'),
('radius', 'radius_secret', '', 'Shared secret RADIUS'),
('radius', 'radius_nas_identifier', 'lokalisp-billing', 'NAS-Identifier for RADIUS Status-Server'),
('radius', 'radius_status', 'disabled', 'Status integrasi RADIUS'),

-- GenieACS Webhook Settings
('genieacs', 'acs_webhook_secret', gen_random_uuid()::text, 'Secret token untuk webhook GenieACS (header x-webhook-secret)')
ON CONFLICT (key) DO NOTHING;
