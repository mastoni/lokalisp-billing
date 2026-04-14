# Database Migration Guide - LokalISP Billing System

## Overview
This guide explains how to set up and migrate the database for the LokalISP Billing System.

## Prerequisites
- PostgreSQL installed and running
- Node.js and npm installed
- Database credentials configured

## Quick Setup

### 1. Configure Environment
```bash
cd backend
copy .env.example .env
# Edit .env with your PostgreSQL credentials
```

### 2. Setup Database and Run Migrations
```bash
# This will create the database and run all migrations
npm run db:setup
```

### 3. Seed Sample Data (Optional)
```bash
# Insert sample customers for testing
npm run db:seed
```

## Manual Migration

If you prefer to run migrations manually:

### Create Database
```bash
psql -U postgres
CREATE DATABASE lokalisp_billing;
\q
```

### Run Migrations
```bash
npm run migrate
```

### Run Specific Migration
```bash
psql -U postgres -d lokalisp_billing -f src/database/migrations/001_initial_schema.sql
psql -U postgres -d lokalisp_billing -f src/database/migrations/002_reward_points_system.sql
psql -U postgres -d lokalisp_billing -f src/database/migrations/003_customer_device_relation.sql
```

## Migration Files

### 001_initial_schema.sql
Creates core tables:
- `packages` - Subscription packages (Basic, Standard, Premium, Ultimate)
- `customers` - Customer information and subscriptions
- `invoices` - Billing invoices
- `payments` - Payment transactions

Features:
- Auto-generating invoice and payment numbers
- Automatic `updated_at` timestamps
- Indexes for performance

### 002_reward_points_system.sql
Creates reward points tables:
- `reward_points` - Customer points balance and tier
- `reward_earning_rules` - How customers earn points
- `reward_redemptions` - Available rewards catalog
- `reward_transactions` - Points transaction audit trail
- `redemption_requests` - Customer redemption requests
- `activities` - System activity log

Features:
- Auto-updating tier system (Bronze → Silver → Gold → Platinum)
- Auto-generating redemption numbers
- Views for analytics
- Default earning rules and rewards pre-populated

### 003_customer_device_relation.sql
Creates device management tables:
- `devices` - Customer devices (routers, modems, etc.)
- `device_assignments` - Device assignment tracking

## Database Structure

### Core Tables

#### packages
```sql
- id (UUID, Primary Key)
- package_name (VARCHAR)
- description (TEXT)
- price (INTEGER)
- speed (VARCHAR)
- bandwidth_limit (VARCHAR)
- is_active (BOOLEAN)
- created_at, updated_at (TIMESTAMP)
```

#### customers
```sql
- id (UUID, Primary Key)
- name (VARCHAR)
- email (VARCHAR)
- phone (VARCHAR)
- address (TEXT)
- package_id (UUID, FK to packages)
- status (VARCHAR: pending, active, suspended, overdue)
- join_date (DATE)
- balance (INTEGER)
- total_paid (INTEGER)
- created_at, updated_at (TIMESTAMP)
```

#### invoices
```sql
- id (UUID, Primary Key)
- invoice_number (VARCHAR, Auto-generated)
- customer_id (UUID, FK to customers)
- package_id (UUID, FK to packages)
- amount (INTEGER)
- status (VARCHAR: pending, paid, overdue)
- issue_date, due_date, paid_date (DATE)
- notes (TEXT)
- created_at, updated_at (TIMESTAMP)
```

#### payments
```sql
- id (UUID, Primary Key)
- payment_number (VARCHAR, Auto-generated)
- invoice_id (UUID, FK to invoices)
- customer_id (UUID, FK to customers)
- amount (INTEGER)
- method (VARCHAR: Bank Transfer, E-Wallet, Virtual Account, Credit Card)
- bank (VARCHAR)
- reference_number (VARCHAR)
- status (VARCHAR: pending, completed, failed)
- payment_date (DATE)
- notes (TEXT)
- created_at, updated_at (TIMESTAMP)
```

### Reward Points Tables

#### reward_points
```sql
- id (UUID, Primary Key)
- customer_id (UUID, FK to customers)
- points_balance (INTEGER)
- total_points_earned (INTEGER)
- total_points_redeemed (INTEGER)
- redemption_count (INTEGER)
- tier (VARCHAR: Bronze, Silver, Gold, Platinum)
- status (VARCHAR: active, inactive)
- last_activity (TIMESTAMP)
- created_at, updated_at (TIMESTAMP)
```

#### reward_earning_rules
```sql
- id (SERIAL, Primary Key)
- action_name (VARCHAR)
- points (INTEGER)
- description (TEXT)
- is_active (BOOLEAN)
- created_at, updated_at (TIMESTAMP)
```

Default Rules:
- Monthly subscription payment: 100 points per Rp 10,000
- On-time payment bonus: 50 points
- Referral bonus: 500 points
- Annual subscription: 1000 points
- New service activation: 200 points

#### reward_redemptions
```sql
- id (SERIAL, Primary Key)
- name (VARCHAR)
- description (TEXT)
- points_cost (INTEGER)
- category (VARCHAR)
- is_active (BOOLEAN)
- created_at, updated_at (TIMESTAMP)
```

Default Rewards:
- 1 Month Free Basic: 5000 points
- 1 Month Free Premium: 10000 points
- Speed Upgrade (1 month): 3000 points
- Data Recovery Service: 2000 points
- Router Upgrade: 8000 points
- Bill Discount Rp 100K: 4000 points
- Bill Discount Rp 250K: 9000 points
- Free Installation: 6000 points

#### reward_transactions
```sql
- id (UUID, Primary Key)
- customer_id (UUID, FK to customers)
- transaction_type (VARCHAR: earn, redeem, deduct, adjustment)
- points (INTEGER)
- description (TEXT)
- reference_type (VARCHAR)
- reference_id (UUID)
- created_at (TIMESTAMP)
```

#### redemption_requests
```sql
- id (UUID, Primary Key)
- redemption_number (VARCHAR, Auto-generated)
- customer_id (UUID, FK to customers)
- reward_id (INTEGER, FK to reward_redemptions)
- points_spent (INTEGER)
- status (VARCHAR: pending, processing, completed, rejected)
- request_date, completed_date (TIMESTAMP)
- rejection_reason (TEXT)
- notes (TEXT)
- created_at, updated_at (TIMESTAMP)
```

#### activities
```sql
- id (UUID, Primary Key)
- activity_type (VARCHAR: payment, invoice, customer, reward, alert)
- description (TEXT)
- user_id (UUID)
- related_id (UUID)
- metadata (JSONB)
- created_at (TIMESTAMP)
```

## Useful Queries

### Check Package Distribution
```sql
SELECT 
  p.package_name,
  p.price,
  COUNT(c.id) as customer_count
FROM packages p
LEFT JOIN customers c ON p.id = c.package_id AND c.status = 'active'
GROUP BY p.id
ORDER BY customer_count DESC;
```

### Check Customer Points Leaderboard
```sql
SELECT 
  c.name,
  c.email,
  rp.points_balance,
  rp.tier,
  rp.total_points_earned,
  rp.total_points_redeemed
FROM reward_points rp
JOIN customers c ON rp.customer_id = c.id
WHERE rp.status = 'active'
ORDER BY rp.points_balance DESC
LIMIT 10;
```

### Check Revenue This Month
```sql
SELECT 
  COALESCE(SUM(amount), 0) as total_revenue,
  COUNT(*) as payment_count
FROM payments
WHERE status = 'completed'
AND EXTRACT(MONTH FROM payment_date) = EXTRACT(MONTH FROM CURRENT_DATE)
AND EXTRACT(YEAR FROM payment_date) = EXTRACT(YEAR FROM CURRENT_DATE);
```

## Troubleshooting

### Database Connection Error
```
Error: database "lokalisp_billing" does not exist
```
**Solution:** Run `npm run db:setup` to create the database.

### Password Error
```
Error: SASL: SCRAM-SERVER-FIRST-MESSAGE: client password must be a string
```
**Solution:** Ensure `.env` file exists with correct `DB_PASSWORD`.

### Migration Already Applied
If you get "already exists" errors, the migration was already applied. This is normal for idempotent migrations using `CREATE TABLE IF NOT EXISTS`.

### Reset Database
```bash
# Drop and recreate
psql -U postgres
DROP DATABASE lokalisp_billing;
CREATE DATABASE lokalisp_billing;
\q

npm run migrate
```

## Backup and Restore

### Backup
```bash
pg_dump -U postgres lokalisp_billing > backup.sql
```

### Restore
```bash
psql -U postgres lokalisp_billing < backup.sql
```

## Environment Variables

```env
DB_HOST=localhost          # PostgreSQL host
DB_PORT=5432               # PostgreSQL port
DB_NAME=lokalisp_billing   # Database name
DB_USER=postgres           # Database user
DB_PASSWORD=your_password  # Database password
```

## Next Steps

After migration:
1. Start backend: `npm run dev`
2. Start frontend: `cd ../frontend && npm run dev`
3. Access dashboard: `http://localhost:3000/admin`

---

**Database Version:** 003
**Last Updated:** April 2026
