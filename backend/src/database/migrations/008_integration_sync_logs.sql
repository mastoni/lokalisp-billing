CREATE TABLE IF NOT EXISTS integration_sync_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    provider VARCHAR(50) NOT NULL,
    job_name VARCHAR(100) NOT NULL,
    status VARCHAR(20) NOT NULL,
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    finished_at TIMESTAMP,
    duration_ms INTEGER,
    details JSONB,
    error_message TEXT
);

CREATE INDEX IF NOT EXISTS idx_integration_sync_logs_provider_started ON integration_sync_logs(provider, started_at DESC);
