# LokalISP Billing System

A full-stack ISP Billing and Management System built with Express.js (backend) and Next.js (frontend).

## 🚀 Features

- Customer management
- Invoice generation and tracking
- Payment recording and monitoring
- User authentication and authorization
- RESTful API backend
- Modern responsive UI

## 📁 Project Structure

```
lokalisp-billing/
├── backend/                    # Express.js API server
│   ├── src/
│   │   ├── config/            # Database and app configuration
│   │   ├── controllers/       # Route controllers
│   │   ├── middleware/        # Custom middleware (auth, validation)
│   │   ├── models/            # Data models
│   │   ├── routes/            # API routes
│   │   ├── services/          # Business logic
│   │   ├── app.js             # Express app setup
│   │   └── server.js          # Server entry point
│   ├── package.json
│   └── .env.example
├── frontend/                   # Next.js client application
│   ├── src/
│   │   ├── app/               # Next.js 13+ app directory
│   │   │   ├── (auth)/        # Authentication pages (login, register)
│   │   │   ├── customers/     # Customer management pages
│   │   │   ├── invoices/      # Invoice management pages
│   │   │   ├── payments/      # Payment management pages
│   │   │   ├── layout.tsx     # Root layout
│   │   │   ├── page.tsx       # Home page
│   │   │   └── globals.css    # Global styles
│   │   ├── components/        # Reusable UI components
│   │   ├── lib/               # API client and utilities
│   │   ├── services/          # API service functions
│   │   └── store/             # State management (Zustand)
│   ├── package.json
│   ├── next.config.js
│   ├── tailwind.config.js
│   └── tsconfig.json
├── package.json                # Root package for running both apps
├── README.md
└── ENV.md                      # Environment variables documentation
```

## 🛠️ Tech Stack

### Backend
- **Node.js** + **Express.js** - API framework
- **PostgreSQL** - Database (configurable)
- **JWT** - Authentication
- **Helmet** - Security headers
- **Morgan** - HTTP request logger
- **CORS** - Cross-origin resource sharing

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client
- **Zustand** - State management
- **React Hook Form** - Form handling
- **React Hot Toast** - Notifications
- **Lucide React** - Icons

## 📋 Prerequisites

- Node.js >= 18.x
- npm or yarn
- PostgreSQL (or your preferred database)

## 🔧 Installation

### Option 1: Install all dependencies at once (Recommended)

```bash
# Install root dependencies (includes concurrently)
npm install

# Install both backend and frontend dependencies
npm run install:all
```

### Option 2: Install separately

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd frontend
npm install
```

## ⚙️ Configuration

### Backend Configuration

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Copy the environment example file:
   ```bash
   cp .env.example .env
   ```

3. Edit `.env` with your configuration:
   ```env
   NODE_ENV=development
   PORT=8081
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=lokalisp_billing
   DB_USER=postgres
   DB_PASSWORD=your_password
   JWT_SECRET=your-secret-key
   JWT_EXPIRES_IN=7d
   ```

### Frontend Configuration

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Copy the environment example file:
   ```bash
   cp .env.local.example .env.local
   ```

3. Edit `.env.local` with your configuration:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8081/api
   ```

## 🚀 Running the Application

### Run Both Applications (Recommended)

From the root directory, run both backend and frontend simultaneously:

```bash
# Development mode with hot reload
npm run dev

# This will start:
# - Backend on http://localhost:8081
# - Frontend on http://localhost:8080
```

### Run Separately

**Backend only:**
```bash
cd backend
npm run dev
```

**Frontend only:**
```bash
cd frontend
npm run dev
```

### Production Mode

**Build frontend:**
```bash
npm run build
```

**Start both in production:**
```bash
npm run start
```

## 🌐 Access the Application

- **Frontend**: http://localhost:8080
- **Backend API**: http://localhost:8081
- **API Health Check**: http://localhost:8081/api/health

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

### Customers
- `GET /api/customers` - Get all customers
- `GET /api/customers/:id` - Get customer by ID
- `POST /api/customers` - Create customer
- `PUT /api/customers/:id` - Update customer
- `DELETE /api/customers/:id` - Delete customer

### Invoices
- `GET /api/invoices` - Get all invoices
- `GET /api/invoices/:id` - Get invoice by ID
- `POST /api/invoices` - Create invoice
- `PUT /api/invoices/:id` - Update invoice
- `DELETE /api/invoices/:id` - Delete invoice

### Payments
- `GET /api/payments` - Get all payments
- `GET /api/payments/:id` - Get payment by ID
- `POST /api/payments` - Create payment

## 🧪 Testing

```bash
# Run backend tests
cd backend
npm test
```

## 📝 Environment Variables

See [ENV.md](ENV.md) for detailed environment variables documentation.

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Submit a pull request

## 📄 License

ISC

## 📧 Support

For support, please open an issue in the repository.
