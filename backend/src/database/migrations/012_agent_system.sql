-- Migration: Agent Management System
-- Description: Adds agent-customer relationship and commission tracking

-- Add agent_id to customers table to link them to an agent staff/partner
ALTER TABLE customers ADD COLUMN IF NOT EXISTS agent_id UUID REFERENCES users(id);

-- Create agent_commissions table
CREATE TABLE IF NOT EXISTS agent_commissions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    agent_id UUID NOT NULL REFERENCES users(id),
    customer_id UUID NOT NULL REFERENCES customers(id),
    payment_id UUID NOT NULL REFERENCES payments(id),
    amount INTEGER NOT NULL,
    percentage DECIMAL(5,2) DEFAULT 10.00,
    status VARCHAR(50) DEFAULT 'pending' NOT NULL, -- 'pending', 'earned', 'withdrawn'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create agent_withdrawals table
CREATE TABLE IF NOT EXISTS agent_withdrawals (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    agent_id UUID NOT NULL REFERENCES users(id),
    amount INTEGER NOT NULL,
    bank_name VARCHAR(100),
    account_number VARCHAR(100),
    account_name VARCHAR(255),
    status VARCHAR(50) DEFAULT 'requested' NOT NULL, -- 'requested', 'processed', 'failed'
    processed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_customers_agent ON customers(agent_id);
CREATE INDEX IF NOT EXISTS idx_commissions_agent ON agent_commissions(agent_id);
CREATE INDEX IF NOT EXISTS idx_withdrawals_agent ON agent_withdrawals(agent_id);

COMMENT ON TABLE agent_commissions IS 'Records of commissions earned by agents from customer payments';
COMMENT ON TABLE agent_withdrawals IS 'Records of commission withdrawals requested by agents';
