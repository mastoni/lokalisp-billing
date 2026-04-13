-- Migration 003: Add ont_serial_number to customers and create devices table
-- This migration establishes the relationship between customers and network devices (routers)

-- Create devices table
CREATE TABLE IF NOT EXISTS devices (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL, -- 'mikrotik', 'olt', 'ap', etc.
    ip_address VARCHAR(50),
    username VARCHAR(100),
    password VARCHAR(100),
    location TEXT,
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add ont_serial_number and device_id to customers
ALTER TABLE customers ADD COLUMN IF NOT EXISTS ont_serial_number VARCHAR(100);
ALTER TABLE customers ADD COLUMN IF NOT EXISTS device_id UUID;

-- Add foreign key constraint
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_customer_device') THEN
        ALTER TABLE customers 
        ADD CONSTRAINT fk_customer_device 
        FOREIGN KEY (device_id) REFERENCES devices(id) ON DELETE SET NULL;
    END IF;
END $$;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_customers_device ON customers(device_id);
CREATE INDEX IF NOT EXISTS idx_customers_ont_sn ON customers(ont_serial_number);

-- Insert some sample devices if needed (optional)
INSERT INTO devices (name, type, ip_address, status) 
VALUES 
('Core Router Utama', 'mikrotik', '192.168.88.1', 'active'),
('Access Point Timur', 'ap', '192.168.88.10', 'active')
ON CONFLICT DO NOTHING;

COMMENT ON COLUMN customers.ont_serial_number IS 'Serial Number of the ONT device installed at customer site';
COMMENT ON COLUMN customers.device_id IS 'Reference to the network device (router) this customer is connected to';
