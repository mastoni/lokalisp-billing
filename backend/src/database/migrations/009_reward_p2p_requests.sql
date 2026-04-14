-- Migration for Peer-to-Peer Reward Requests
CREATE TABLE IF NOT EXISTS reward_p2p_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    sender_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE, -- The one who requests
    recipient_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE, -- The one who should give
    amount INTEGER NOT NULL,
    note TEXT,
    status VARCHAR(50) DEFAULT 'pending' NOT NULL, -- 'pending', 'accepted', 'rejected', 'expired'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_reward_p2p_sender ON reward_p2p_requests(sender_id);
CREATE INDEX IF NOT EXISTS idx_reward_p2p_recipient ON reward_p2p_requests(recipient_id);
CREATE INDEX IF NOT EXISTS idx_reward_p2p_status ON reward_p2p_requests(status);
