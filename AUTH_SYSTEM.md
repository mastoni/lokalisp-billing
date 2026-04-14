# Authentication & Role-Based Access Control System

## Overview
Complete authentication system with role-based permissions for LokalISP Billing System.

## Roles & Permissions

### 1. **Admin** 🔧
Full system access with all permissions.
- **Login**: `admin` / `admin123`
- **Dashboard**: `/admin/dashboard` (existing)
- **Permissions**: All permissions (users, customers, invoices, payments, packages, dashboard, rewards, devices, settings, reports)

### 2. **Customer** 👤
ISP customer with limited access to their own data.
- **Login**: `customer1` / `customer123`
- **Dashboard**: `/customers/dashboard`
- **Permissions**: 
  - View & manage own invoices
  - View & make payments
  - View own dashboard
  - View account settings

### 3. **Teknisi** 🔧
Technical staff for maintenance and support.
- **Login**: `teknisi1` / `teknisi123`
- **Dashboard**: `/teknisi/dashboard`
- **Permissions**:
  - View & manage customers
  - View & manage devices
  - View dashboard
  - View & manage reports

### 4. **Agen** 🏢
Agent/reseller with customer management access.
- **Login**: `agen1` / `agen123`
- **Dashboard**: `/agen/dashboard`
- **Permissions**:
  - View & manage customers
  - View & manage invoices
  - View & manage payments
  - View dashboard

---

## Database Schema

### Tables Created:
1. **roles** - User roles (admin, customer, teknisi, agen)
2. **permissions** - Available permissions
3. **role_permissions** - Role-permission mapping
4. **users** - User accounts with authentication
5. **user_sessions** - Active session management

### Migration File:
`004_users_roles_permissions.sql`

---

## Backend API Endpoints

### Authentication
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/auth/register` | Public | Register new user |
| POST | `/api/auth/login` | Public | Login user |
| POST | `/api/auth/logout` | Protected | Logout user |
| GET | `/api/auth/me` | Protected | Get current user info |

### Login Request Body:
```json
{
  "username": "admin",
  "password": "admin123"
}
```

### Login Response:
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "uuid",
      "username": "admin",
      "email": "admin@lokalisp.com",
      "full_name": "System Administrator",
      "phone": "+6281234567890",
      "role": "admin",
      "role_description": "System administrator with full access",
      "permissions": [
        {
          "name": "users:read",
          "description": "View users",
          "resource": "users",
          "action": "read"
        }
      ]
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": "7d"
  }
}
```

---

## Middleware

### 1. **authenticate**
Verifies JWT token and attaches user to request.

```javascript
const { authenticate } = require('../middleware/auth.middleware');

router.get('/protected', authenticate, (req, res) => {
  // req.user contains user data
});
```

### 2. **authorize**
Checks if user has required role.

```javascript
const { authorize } = require('../middleware/auth.middleware');

router.get('/admin-only', authorize(['admin']), (req, res) => {
  // Only admin can access
});
```

### 3. **hasPermission**
Checks if user has specific permission.

```javascript
const { hasPermission } = require('../middleware/auth.middleware');

router.post('/create-customer', hasPermission('customers:write'), (req, res) => {
  // Only users with customers:write permission can access
});
```

---

## Frontend Implementation

### Auth Store (Zustand)
Location: `/frontend/src/store/authStore.ts`

```typescript
import { useAuthStore } from '@/store/authStore';

const { user, isAuthenticated, login, logout, hasPermission, hasRole } = useAuthStore();
```

### Usage Example:
```typescript
// Check authentication
if (!isAuthenticated) {
  router.push('/login');
}

// Check role
if (!hasRole(['admin', 'teknisi'])) {
  router.push('/unauthorized');
}

// Check permission
if (!hasPermission('customers:write')) {
  router.push('/unauthorized');
}
```

### Login Page
Location: `/frontend/src/app/login/page.tsx`

Features:
- Beautiful UI with gradient background
- Show/hide password toggle
- Error messages
- Loading state
- Auto-redirect based on role
- Demo credentials display

---

## Dashboard Routes

| Role | Route | File |
|------|-------|------|
| Admin | `/admin/dashboard` | `/admin/dashboard/page.tsx` (existing) |
| Customer | `/customers/dashboard` | `/customers/dashboard/page.tsx` |
| Teknisi | `/teknisi/dashboard` | `/teknisi/dashboard/page.tsx` |
| Agen | `/agen/dashboard` | `/agen/dashboard/page.tsx` |

All dashboards have:
- Role-based authentication check
- Redirect to `/login` if not authenticated
- Redirect to `/login` if wrong role
- Welcome message with user's name
- Role badge display
- Logout functionality
- Stats and quick actions

---

## Setup Instructions

### 1. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Run migrations
npm run migrate

# Seed test users
node src/database/seed-users.js
```

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies (already installed)
npm install

# Build
npm run build

# Run dev server
npm run dev
```

### 3. Environment Variables

Backend `.env`:
```env
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=7d
DB_HOST=localhost
DB_PORT=5432
DB_NAME=lokalisp_billing
DB_USER=postgres
DB_PASSWORD=your_password
```

Frontend `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8081/api
```

---

## Test Credentials

| Role | Username | Password |
|------|----------|----------|
| Admin | `admin` | `admin123` |
| Customer | `customer1` | `customer123` |
| Teknisi | `teknisi1` | `teknisi123` |
| Agen | `agen1` | `agen123` |

---

## Security Features

1. **Password Hashing**: bcrypt with 10 rounds
2. **JWT Authentication**: Signed tokens with expiration
3. **Session Management**: Database-stored sessions
4. **Role-Based Access Control**: Granular permissions
5. **Protected Routes**: Middleware-based protection
6. **Auto Logout**: Redirect on 401 errors

---

## API Examples

### Login:
```bash
curl -X POST http://localhost:8081/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

### Get Current User:
```bash
curl -X GET http://localhost:8081/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Logout:
```bash
curl -X POST http://localhost:8081/api/auth/logout \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## File Structure

```
backend/
├── src/
│   ├── controllers/
│   │   └── auth.controller.js          # Auth endpoints
│   ├── services/
│   │   └── auth.service.js             # Auth business logic
│   ├── models/
│   │   └── user.model.js               # User database operations
│   ├── middleware/
│   │   └── auth.middleware.js          # Auth & authorization
│   ├── routes/
│   │   └── auth.route.js               # Auth routes
│   └── database/
│       ├── migrations/
│       │   └── 004_users_roles_permissions.sql
│       └── seed-users.js               # Test user seeder

frontend/
├── src/
│   ├── app/
│   │   ├── login/
│   │   │   └── page.tsx                # Login page
│   │   ├── customers/
│   │   │   └── dashboard/
│   │   │       └── page.tsx            # Customer dashboard
│   │   ├── teknisi/
│   │   │   └── dashboard/
│   │   │       └── page.tsx            # Teknisi dashboard
│   │   └── agen/
│   │       └── dashboard/
│   │           └── page.tsx            # Agen dashboard
│   ├── store/
│   │   └── authStore.ts                # Auth state management
│   └── services/
│       └── authService.ts              # Auth API calls
```

---

## Future Enhancements

- [ ] Password reset functionality
- [ ] Email verification
- [ ] Two-factor authentication (2FA)
- [ ] Activity logging
- [ ] IP-based session management
- [ ] Refresh token rotation
- [ ] OAuth integration (Google, GitHub)
- [ ] Account lockout after failed attempts
- [ ] Permission UI in admin dashboard

---

## Troubleshooting

### Build Errors:
- Make sure no duplicate routes exist
- Check that all TypeScript types are correct
- Verify all imports are valid

### Login Issues:
- Verify database migration ran successfully
- Check that test users were seeded
- Ensure JWT_SECRET matches in .env

### Permission Denied:
- Verify user has correct role
- Check role_permissions mapping
- Ensure middleware is applied to routes

---

**Build Status**: ✅ Compiled Successfully (19 pages)
**Last Updated**: April 14, 2026
