-- Migration: Technician Ticketing & Maintenance System
-- Description: Creates tables for support tickets and maintenance tracking

CREATE TABLE IF NOT EXISTS support_tickets (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    ticket_code VARCHAR(50) UNIQUE NOT NULL,
    customer_id UUID REFERENCES customers(id),
    technician_id UUID REFERENCES users(id),
    category VARCHAR(100) NOT NULL, -- 'koneksi', 'perangkat', 'billing', 'lainnya'
    priority VARCHAR(50) DEFAULT 'medium' NOT NULL, -- 'low', 'medium', 'high', 'critical'
    status VARCHAR(50) DEFAULT 'open' NOT NULL, -- 'open', 'assigned', 'in_progress', 'resolved', 'closed'
    subject VARCHAR(255) NOT NULL,
    description TEXT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS maintenance_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    technician_id UUID REFERENCES users(id),
    customer_id UUID REFERENCES customers(id),
    action_type VARCHAR(100) NOT NULL, -- 'installation', 'repair', 'upgrade', 'checkup'
    description TEXT,
    status VARCHAR(50) DEFAULT 'completed' NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Trigger for support_tickets updated_at
DROP TRIGGER IF EXISTS trg_support_tickets_updated ON support_tickets;
CREATE TRIGGER trg_support_tickets_updated
    BEFORE UPDATE ON support_tickets
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Function to generate ticket code
CREATE OR REPLACE FUNCTION generate_ticket_code()
RETURNS TRIGGER AS $$
DECLARE
    next_val INTEGER;
    prefix VARCHAR(5);
BEGIN
    prefix := 'TCK';
    
    SELECT COUNT(*) + 1 INTO next_val FROM support_tickets;
    
    NEW.ticket_code := prefix || '-' || LPAD(next_val::TEXT, 6, '0');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_ticket_code ON support_tickets;
CREATE TRIGGER trg_ticket_code
    BEFORE INSERT ON support_tickets
    FOR EACH ROW
    WHEN (NEW.ticket_code IS NULL)
    EXECUTE FUNCTION generate_ticket_code();

-- Create Indexes
CREATE INDEX IF NOT EXISTS idx_tickets_status ON support_tickets(status);
CREATE INDEX IF NOT EXISTS idx_tickets_technician ON support_tickets(technician_id);
CREATE INDEX IF NOT EXISTS idx_tickets_customer ON support_tickets(customer_id);

COMMENT ON TABLE support_tickets IS 'Support and maintenance tickets for technical issues';
COMMENT ON TABLE maintenance_logs IS 'History of maintenance activities performed by technicians';
