-- Reward Points System Migration
-- This migration creates tables and initial data for the reward points system

-- Create reward_points table
CREATE TABLE IF NOT EXISTS reward_points (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    points_balance INTEGER DEFAULT 0 NOT NULL,
    total_points_earned INTEGER DEFAULT 0 NOT NULL,
    total_points_redeemed INTEGER DEFAULT 0 NOT NULL,
    tier VARCHAR(50) DEFAULT 'Bronze' NOT NULL,
    status VARCHAR(50) DEFAULT 'active' NOT NULL,
    last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_customer FOREIGN KEY (customer_id) REFERENCES customers(id)
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_reward_points_customer ON reward_points(customer_id);
CREATE INDEX IF NOT EXISTS idx_reward_points_tier ON reward_points(tier);
CREATE INDEX IF NOT EXISTS idx_reward_points_status ON reward_points(status);

-- Create reward_earning_rules table
CREATE TABLE IF NOT EXISTS reward_earning_rules (
    id SERIAL PRIMARY KEY,
    action_name VARCHAR(255) NOT NULL,
    points INTEGER NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create reward_redemptions table (available rewards)
CREATE TABLE IF NOT EXISTS reward_redemptions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    points_cost INTEGER NOT NULL,
    category VARCHAR(100) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create reward_transactions table (audit trail)
CREATE TABLE IF NOT EXISTS reward_transactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    transaction_type VARCHAR(50) NOT NULL, -- 'earn', 'redeem', 'deduct', 'adjustment'
    points INTEGER NOT NULL,
    description TEXT,
    reference_type VARCHAR(100), -- 'monthly_payment', 'referral', 'redemption', 'manual_adjustment', etc.
    reference_id UUID, -- Optional reference to related record
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_transaction_customer FOREIGN KEY (customer_id) REFERENCES customers(id)
);

-- Create index for transactions
CREATE INDEX IF NOT EXISTS idx_reward_transactions_customer ON reward_transactions(customer_id);
CREATE INDEX IF NOT EXISTS idx_reward_transactions_type ON reward_transactions(transaction_type);
CREATE INDEX IF NOT EXISTS idx_reward_transactions_created ON reward_transactions(created_at);

-- Create redemption_requests table
CREATE TABLE IF NOT EXISTS redemption_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    redemption_number VARCHAR(50) UNIQUE NOT NULL,
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    reward_id INTEGER NOT NULL REFERENCES reward_redemptions(id),
    points_spent INTEGER NOT NULL,
    status VARCHAR(50) DEFAULT 'pending' NOT NULL, -- 'pending', 'processing', 'completed', 'rejected'
    request_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_date TIMESTAMP,
    rejection_reason TEXT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_redemption_customer FOREIGN KEY (customer_id) REFERENCES customers(id),
    CONSTRAINT fk_redemption_reward FOREIGN KEY (reward_id) REFERENCES reward_redemptions(id)
);

-- Create index for redemption requests
CREATE INDEX IF NOT EXISTS idx_redemption_requests_customer ON redemption_requests(customer_id);
CREATE INDEX IF NOT EXISTS idx_redemption_requests_status ON redemption_requests(status);
CREATE INDEX IF NOT EXISTS idx_redemption_requests_date ON redemption_requests(request_date);

-- Create activities table for dashboard recent activity
CREATE TABLE IF NOT EXISTS activities (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    activity_type VARCHAR(100) NOT NULL, -- 'payment', 'invoice', 'customer', 'reward', 'alert'
    description TEXT NOT NULL,
    user_id UUID, -- Optional: who triggered the activity
    related_id UUID, -- Optional: related entity ID
    metadata JSONB, -- Additional data
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for activities
CREATE INDEX IF NOT EXISTS idx_activities_type ON activities(activity_type);
CREATE INDEX IF NOT EXISTS idx_activities_created ON activities(created_at DESC);

-- Insert default earning rules
INSERT INTO reward_earning_rules (action_name, points, description, is_active) VALUES
('Monthly subscription payment', 100, 'Points earned per Rp 10,000 spent on monthly subscription', true),
('On-time payment bonus', 50, 'Bonus points for paying before due date', true),
('Referral bonus', 500, 'When referred customer signs up and pays first invoice', true),
('Annual subscription', 1000, 'Bonus points for paying yearly subscription', true),
('New service activation', 200, 'Activating additional services or upgrades', true)
ON CONFLICT DO NOTHING;

-- Insert default redemption rewards
INSERT INTO reward_redemptions (name, description, points_cost, category, is_active) VALUES
('1 Month Free Basic', 'Get one month of Basic plan (10Mbps) free', 5000, 'Service Credit', true),
('1 Month Free Premium', 'Get one month of Premium plan (50Mbps) free', 10000, 'Service Credit', true),
('Speed Upgrade (1 month)', 'Upgrade your speed tier for one month', 3000, 'Upgrade', true),
('Data Recovery Service', 'One-time data recovery assistance', 2000, 'Service', true),
('Router Upgrade', 'Free router upgrade and installation', 8000, 'Equipment', true),
('Bill Discount Rp 100K', 'Rp 100,000 discount on next bill', 4000, 'Discount', true),
('Bill Discount Rp 250K', 'Rp 250,000 discount on next bill', 9000, 'Discount', true),
('Free Installation', 'Free new installation service', 6000, 'Service', true)
ON CONFLICT DO NOTHING;

-- Create function to update tier based on points
CREATE OR REPLACE FUNCTION update_customer_tier()
RETURNS TRIGGER AS $$
BEGIN
    NEW.tier := CASE
        WHEN NEW.points_balance >= 5000 THEN 'Platinum'
        WHEN NEW.points_balance >= 2500 THEN 'Gold'
        WHEN NEW.points_balance >= 1000 THEN 'Silver'
        ELSE 'Bronze'
    END;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-update tier
DROP TRIGGER IF EXISTS trg_update_tier ON reward_points;
CREATE TRIGGER trg_update_tier
    BEFORE INSERT OR UPDATE ON reward_points
    FOR EACH ROW
    EXECUTE FUNCTION update_customer_tier();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS trg_reward_points_updated ON reward_points;
CREATE TRIGGER trg_reward_points_updated
    BEFORE UPDATE ON reward_points
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trg_earning_rules_updated ON reward_earning_rules;
CREATE TRIGGER trg_earning_rules_updated
    BEFORE UPDATE ON reward_earning_rules
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trg_redemptions_updated ON reward_redemptions;
CREATE TRIGGER trg_redemptions_updated
    BEFORE UPDATE ON reward_redemptions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trg_redemption_requests_updated ON redemption_requests;
CREATE TRIGGER trg_redemption_requests_updated
    BEFORE UPDATE ON redemption_requests
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create function to generate redemption number
CREATE OR REPLACE FUNCTION generate_redemption_number()
RETURNS TRIGGER AS $$
DECLARE
    next_val INTEGER;
BEGIN
    SELECT COALESCE(MAX(CAST(SUBSTRING(redemption_number FROM 5) AS INTEGER)), 0) + 1
    INTO next_val
    FROM redemption_requests;
    
    NEW.redemption_number := 'RED-' || LPAD(next_val::TEXT, 5, '0');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for redemption number generation
DROP TRIGGER IF EXISTS trg_redemption_number ON redemption_requests;
CREATE TRIGGER trg_redemption_number
    BEFORE INSERT ON redemption_requests
    FOR EACH ROW
    WHEN (NEW.redemption_number IS NULL OR NEW.redemption_number = '')
    EXECUTE FUNCTION generate_redemption_number();

-- Create view for customer reward summary
CREATE OR REPLACE VIEW v_customer_reward_summary AS
SELECT
    c.id AS customer_id,
    c.name,
    c.email,
    c.phone,
    c.status AS customer_status,
    rp.points_balance,
    rp.tier,
    rp.total_points_earned,
    rp.total_points_redeemed,
    rp.redemption_count,
    rp.last_activity,
    COUNT(rt.id) AS transaction_count
FROM customers c
LEFT JOIN reward_points rp ON c.id = rp.customer_id
LEFT JOIN reward_transactions rt ON c.id = rt.customer_id
GROUP BY c.id, rp.id;

-- Create view for redemption analytics
CREATE OR REPLACE VIEW v_redemption_analytics AS
SELECT
    DATE_TRUNC('month', request_date) AS month,
    status,
    COUNT(*) AS redemption_count,
    SUM(points_spent) AS total_points_spent
FROM redemption_requests
GROUP BY DATE_TRUNC('month', request_date), status
ORDER BY month DESC;

COMMENT ON TABLE reward_points IS 'Stores customer reward points balance and tier information';
COMMENT ON TABLE reward_earning_rules IS 'Defines how customers can earn reward points';
COMMENT ON TABLE reward_redemptions IS 'Available rewards that customers can redeem with points';
COMMENT ON TABLE reward_transactions IS 'Audit trail for all points transactions';
COMMENT ON TABLE redemption_requests IS 'Customer requests to redeem rewards';
COMMENT ON TABLE activities IS 'System activity log for dashboard';
