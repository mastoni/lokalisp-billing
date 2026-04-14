# LokalISP Billing System (Billing Sembok)

A premium, full-stack ISP Billing and Remote Management System built with Express.js (backend) and Next.js (frontend). Designed for performance, reliability, and ease of use with a stunning glassmorphic UI.

## 🚀 Key Features

- **Dashboard 3.0**: Premium glassmorphic interface with real-time revenue stats, customer distribution, and activity monitoring.
- **Remote Device Management (TR-069)**: Full integration with GenieACS for ONT/Router management.
  - **Remote Reboot**: Restart customer devices directly from the portal.
  - **WiFi Management**: Change SSID and WiFi passwords remotely.
  - **Automated Sync**: Background workers to keep device statuses and customer mappings up to date.
- **System Command Queue**: Asynchronous task processing using a robust database-backed worker system.
- **Centralized Settings**: Manage MikroTik, WhatsApp, and GenieACS configurations through a category-based admin UI.
- **PWA Ready**: Mobile-optimized Progressive Web App with offline support and a native-like experience for customers.
- **Reward System**: Built-in loyalty points and reward redemption system.
- **Core Billing**: Customer management, automated invoice generation, and payment tracking.

## 📁 Project Structure

```
lokalisp-billing/
├── backend/                    # Express.js API server
│   ├── src/
│   │   ├── config/            # Database and app configuration
│   │   ├── controllers/       # Route controllers (Dashboard, Device, Portal)
│   │   ├── integrations/      # External API clients (GenieACS, MikroTik, Radius)
│   │   ├── middleware/        # Custom middleware (auth, validation)
│   │   ├── routes/            # API routes
│   │   ├── services/          # Business logic layers
│   │   ├── workers/           # Background jobs (Sync, Command Queue)
│   │   ├── app.js             # Express app setup
│   │   └── server.js          # Server entry point
├── frontend/                   # Next.js client application
│   ├── src/
│   │   ├── app/               # Next.js App Router (Admin, Customers, Agen)
│   │   ├── components/        # UI components (Glassmorphism, Reusable)
│   │   ├── lib/               # API client and utilities
│   │   ├── public/            # Assets and PWA manifest
```

## 🛠️ Tech Stack

### Backend
- **Node.js** + **Express.js**
- **Postgres** - Primary database
- **JWT** - Secure stateless authentication
- **TR-069 / GenieACS** - Remote management engine
- **Lucide / Winston** - Logging and icons

### Frontend
- **Next.js 14** - React framework with App Router
- **Tailwind CSS** - Glassmorphism and premium styling
- **React Hot Toast** - Real-time notifications
- **Lucide React** - Modern iconography
- **PWA Service Workers** - For offline and mobile performance

## ⚙️ Remote Management Architecture

The system uses a 4-layer control flow to ensure reliability:
1. **Controller**: Handles HTTP requests and returns immediate response.
2. **DeviceService**: Business logic (normalization, customer mapping).
3. **IntegrationService**: Multi-provider abstraction layer.
4. **Integration Client**: Low-level API calls to external services.

For write operations (reboot, wifi changes), a **Command Queue** is used to prevent timeouts and ensure task traceability.

## 📡 Key API Endpoints

### Administrative
- `GET /api/dashboard/*` - Real-time statistics and analytics
- `GET /api/settings` - Category-based system configurations
- `POST /api/integrations/sync/genieacs` - Manual device sync

### Device Control
- `GET /api/devices/my-device` - Get assigned device details
- `POST /api/devices/reboot` - Queue a remote reboot
- `POST /api/devices/wifi-password` - Queue a WiFi change

### Portal (Customer)
- `GET /api/portal/me/modem` - Current modem status and WiFi info
- `POST /api/portal/me/modem/reboot` - Remote reboot from PWA
- `POST /api/portal/me/modem/wifi/password` - Self-service WiFi change

## 📋 Prerequisites

- Node.js >= 18.x
- PostgreSQL 12+
- GenieACS (optional, for remote management features)

## 🔧 Installation

```bash
# Install all dependencies
npm run install:all

# Run development environment (Concurrent Backend + Frontend)
npm run dev
```

## 📄 License

ISC - Designed by **LokalISP Team**
"Jangan Ambil Pusing" - ISP Management Simplified.

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
