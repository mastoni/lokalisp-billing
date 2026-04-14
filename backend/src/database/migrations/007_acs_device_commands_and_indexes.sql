-- Migration 007: Add device_commands table and indexes

-- Add serial_number to devices
ALTER TABLE devices ADD COLUMN IF NOT EXISTS serial_number VARCHAR(100);
CREATE INDEX IF NOT EXISTS idx_devices_serial_number ON devices(serial_number);

-- Add ont_serial_number to customers if not exists (already added in 003, but just to be safe)
ALTER TABLE customers ADD COLUMN IF NOT EXISTS ont_serial_number VARCHAR(100);
CREATE INDEX IF NOT EXISTS idx_customers_ont_sn ON customers(ont_serial_number);

-- Create device_commands table
CREATE TABLE IF NOT EXISTS device_commands (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    device_id UUID REFERENCES devices(id) ON DELETE CASCADE,
    command_name VARCHAR(100) NOT NULL,
    payload JSONB,
    status VARCHAR(50) DEFAULT 'pending',
    result JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_device_commands_device_id ON device_commands(device_id);
CREATE INDEX IF NOT EXISTS idx_device_commands_status ON device_commands(status);
