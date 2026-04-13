# LokalISP Billing System - Admin Dashboard

## Overview
A comprehensive admin dashboard for managing ISP billing operations with an integrated reward points system to enhance customer loyalty and competitiveness.

## Features

### 🎯 Main Dashboard (`/admin/dashboard`)
The central hub for monitoring your ISP business with real-time statistics and insights:

- **Revenue Metrics**: Total revenue, monthly revenue, and growth trends
- **Customer Statistics**: Active customers, pending activations, suspended accounts
- **Invoice Tracking**: Pending, overdue, and paid invoices overview
- **Payment Analytics**: Total payments, completion rates, average payment amounts
- **Package Distribution**: Visual breakdown of customers per subscription tier
- **Recent Transactions**: Latest invoices and payment activity
- **Top Customers**: Highest revenue generators
- **Activity Feed**: Real-time system events and notifications

### 👥 Customer Management (`/admin/customers`)
Complete customer lifecycle management:

- View all customers with detailed profiles
- Filter by status (active, pending, overdue, suspended)
- Track subscription packages and payment history
- Monitor account balances
- Quick actions: view, edit, delete customer records
- Package distribution analytics

### 📄 Invoice Management (`/admin/invoices`)
Comprehensive billing and invoice tracking:

- Create, view, and manage all invoices
- Real-time status tracking (paid, pending, overdue)
- Revenue overview with pending and overdue amounts
- Collection rate analytics
- Print and send invoice functionality
- Export capabilities

### 💳 Payment Management (`/admin/payments`)
Payment transaction monitoring:

- Track all payment methods (Bank Transfer, E-Wallet, Virtual Account, Credit Card)
- Payment status management (completed, pending, failed)
- Revenue trend analysis with growth metrics
- Payment method distribution analytics
- Quick payment confirmation
- Reference number tracking

### 🎁 Reward Points System (`/admin/rewards`)
A unique loyalty program to differentiate your ISP from competitors:

#### Reward Points Overview
- **Points Analytics**: Total issued, redeemed, and outstanding points
- **Active Members**: Track program participation
- **Redemption Rate**: Monitor program effectiveness
- **Tier System**: Bronze → Silver → Gold → Platinum progression
- **Quick Actions**: Adjust points, create rewards, view analytics

#### Earning Rules Management
Configure how customers earn points:
- Monthly subscription payments (100 points per Rp 10,000)
- On-time payment bonuses (50 points)
- Referral bonuses (500 points)
- Annual subscription bonuses (1000 points)
- New service activation rewards (200 points)

#### Redemption Rewards
Offer valuable rewards to customers:
- **Service Credits**: Free months of service
- **Discounts**: Bill discounts (Rp 100K, Rp 250K)
- **Upgrades**: Speed upgrades, router upgrades
- **Services**: Free installation, data recovery

#### Redemption Management (`/admin/rewards/redemptions`)
- Track all redemption requests
- Approve or reject redemptions
- Monitor processing times
- Category-based analytics
- Status filtering and search

#### Leaderboard (`/admin/rewards/leaderboard`)
Gamify the customer experience:
- Top performers showcase (Top 3 podium)
- Full leaderboard with ranking
- Tier distribution visualization
- Filter by tier (Platinum, Gold, Silver, Bronze)
- Grid and list view modes
- Performance metrics (most active, highest spender, etc.)

#### Reward Settings (`/admin/rewards/settings`)
- Configure point values and tiers
- Manage reward catalog
- Set earning rules
- Customize tier benefits

## Technology Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 3.4
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **State Management**: Zustand

### Backend
- **Framework**: Express.js
- **Database**: PostgreSQL
- **Authentication**: JWT (ready for implementation)
- **Security**: Helmet, CORS, Morgan logging

## Database Schema

### Core Tables
- `customers` - Customer information
- `packages` - Subscription packages
- `invoices` - Billing invoices
- `payments` - Payment transactions

### Reward Points Tables
- `reward_points` - Customer points balance and tier
- `reward_earning_rules` - How customers earn points
- `reward_redemptions` - Available rewards catalog
- `reward_transactions` - Points transaction audit trail
- `redemption_requests` - Customer redemption requests
- `activities` - System activity log

## API Endpoints

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics
- `GET /api/dashboard/recent-transactions` - Get latest transactions
- `GET /api/dashboard/top-customers` - Get top customers by revenue
- `GET /api/dashboard/package-distribution` - Get package analytics
- `GET /api/dashboard/recent-activity` - Get system activities

### Rewards
- `GET /api/rewards/stats` - Get reward points statistics
- `GET /api/rewards/customers` - Get customer points list
- `GET /api/rewards/earning-rules` - Get earning rules
- `POST /api/rewards/earning-rules` - Create new earning rule
- `GET /api/rewards/rewards` - Get redemption rewards
- `POST /api/rewards/rewards` - Create new reward
- `GET /api/rewards/redemptions` - Get redemption requests
- `PATCH /api/rewards/redemptions/:id/process` - Approve/reject redemption
- `GET /api/rewards/leaderboard` - Get customer leaderboard
- `GET /api/rewards/tier-distribution` - Get tier analytics
- `POST /api/rewards/customers/:id/adjust` - Manual points adjustment

## Setup Instructions

### Backend Setup
```bash
cd backend
npm install

# Configure environment
cp .env.example .env
# Edit .env with your database credentials

# Run database migrations
psql -U your_user -d lokalisp_billing -f src/database/migrations/002_reward_points_system.sql

# Start development server
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install

# Configure environment
# Edit .env.local with your API URL

# Start development server
npm run dev
```

### Access the Dashboard
- Frontend: `http://localhost:3000/admin`
- Backend API: `http://localhost:8081/api`

## Reward Points System Benefits

### For ISP Business Owners:
1. **Customer Retention**: Encourage long-term subscriptions
2. **Competitive Advantage**: Unique selling proposition
3. **Payment Incentives**: Reward on-time payments
4. **Referral Program**: Organic customer acquisition
5. **Upselling Opportunities**: Encourage package upgrades

### For Customers:
1. **Loyalty Rewards**: Points for every payment
2. **Tier Benefits**: Progressive rewards system
3. **Flexible Redemption**: Multiple reward options
4. **Cost Savings**: Free services and discounts
5. **Engagement**: Gamified experience

## Customization

### Adding New Reward Tiers
Edit the tier configuration in the frontend and update the database trigger:
```sql
-- Update tier thresholds
CASE
    WHEN NEW.points_balance >= 5000 THEN 'Platinum'
    WHEN NEW.points_balance >= 2500 THEN 'Gold'
    WHEN NEW.points_balance >= 1000 THEN 'Silver'
    ELSE 'Bronze'
END
```

### Adding New Earning Rules
Use the admin interface or API:
```javascript
POST /api/rewards/earning-rules
{
  "action_name": "Custom Action",
  "points": 100,
  "description": "How to earn these points",
  "is_active": true
}
```

### Adding New Rewards
```javascript
POST /api/rewards/rewards
{
  "name": "New Reward Name",
  "description": "Reward description",
  "points_cost": 5000,
  "category": "Category Name",
  "is_active": true
}
```

## Security Considerations

- JWT authentication ready for implementation
- Role-based access control structure in place
- Input validation on all endpoints
- SQL injection prevention with parameterized queries
- CORS configuration for frontend-backend communication

## Future Enhancements

- [ ] Real-time notifications (WebSocket)
- [ ] Automated tier upgrades
- [ ] Reward points expiration
- [ ] Bulk operations for invoices/payments
- [ ] Advanced reporting and exports
- [ ] Mobile app integration
- [ ] Payment gateway integration
- [ ] Automated invoice generation
- [ ] Email notifications
- [ ] Multi-language support

## Support

For issues or questions, please refer to the main project documentation or create an issue in the repository.

---

**Built with ❤️ for LokalISP Billing System**
