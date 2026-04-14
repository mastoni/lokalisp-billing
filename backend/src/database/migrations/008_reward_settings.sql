-- Migration to add reward system settings
INSERT INTO system_settings (category, key, value, description) VALUES
('rewards', 'points_per_1000_payment', '1', 'Points earned for every Rp 1,000 paid for bills'),
('rewards', 'referral_points', '500', 'Bonus points awarded for a successful referral'),
('rewards', 'hotspot_voucher_bonus', '10', 'Bonus points for every hotspot voucher purchase'),
('rewards', 'redemption_window', 'always', 'Redemption period constraint (always, holiday_only, disabled)'),
('rewards', 'redemption_holiday_start', '', 'Redemption start date if window is limited (YYYY-MM-DD or MM-DD)'),
('rewards', 'redemption_holiday_end', '', 'Redemption end date if window is limited (YYYY-MM-DD or MM-DD)'),
('rewards', 'points_transfer_fee', '0', 'Fix fee points for transfer between customers'),
('rewards', 'points_transfer_enabled', 'true', 'Enable/disable peer-to-peer point transfers')
ON CONFLICT (key) DO UPDATE SET 
    category = EXCLUDED.category,
    description = EXCLUDED.description;
