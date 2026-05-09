# OTMS - OnRoad Transport Management System

Enterprise-grade SaaS platform for transporters and logistics companies.

## Features

- **Trip Management** - Create, assign, track, and complete trips
- **Fleet Management** - Truck registration, status, and maintenance tracking
- **Driver Management** - Driver profiles, assignment, and mobile app
- **Live GPS Tracking** - Real-time vehicle tracking with geo-fencing
- **Expense Management** - Trip-wise expense capture with photo proof
- **Document Management** - Invoice, E-Way Bill, LR, POD uploads
- **Dashboard & Analytics** - KPIs, charts, and operational insights
- **Role-based Access** - 6 user roles with configurable permissions
- **Notification Engine** - Push, SMS, email, and in-app alerts
- **Reports** - Client-wise, truck-wise, driver-wise, and financial reports

## Tech Stack

- **Frontend**: Next.js 14, React 18, Tailwind CSS, shadcn/ui, Zustand
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL
- **Cache**: Redis
- **Auth**: JWT (jose)
- **Maps**: Google Maps API
- **Real-time**: Socket.IO
- **Deployment**: Docker, docker-compose

## Quick Start

### Prerequisites

- Node.js 20+
- PostgreSQL 16+
- Redis (optional, for caching)

### Setup

```bash
# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# Seed the database
npx prisma db seed

# Start development server
npm run dev
```

### Docker Setup

```bash
# Start all services
docker-compose up -d

# Run migrations
docker-compose exec app npx prisma migrate deploy

# Seed database
docker-compose exec app npx prisma db seed
```

### Default Credentials

| Role | Email | Password |
|------|-------|----------|
| Super Admin | admin@otms.com | admin123 |
| Dispatcher | dispatch@otms.com | dispatch123 |
| Driver | rajesh.kumar@otms.com | driver123 |

## Project Structure

```
src/
├── app/
│   ├── (auth)/login/        # Login page
│   ├── (dashboard)/         # Dashboard layout
│   │   ├── dashboard/       # Main dashboard
│   │   ├── trips/           # Trip management
│   │   ├── tracking/        # Live tracking
│   │   ├── trucks/          # Fleet management
│   │   ├── drivers/         # Driver management
│   │   ├── clients/         # Client master
│   │   ├── expenses/        # Expense management
│   │   ├── reports/         # Reports
│   │   └── settings/        # Admin settings
│   └── api/
│       ├── auth/            # Authentication APIs
│       ├── trips/           # Trip CRUD APIs
│       ├── trucks/          # Truck CRUD APIs
│       ├── tracking/        # GPS tracking APIs
│       └── ...
├── components/
│   ├── ui/                  # shadcn/ui components
│   └── layout/              # Layout components
├── lib/
│   ├── prisma.ts            # Database client
│   ├── auth.ts              # JWT auth utilities
│   └── utils.ts             # Helper functions
├── store/
│   └── auth-store.ts        # Zustand state
└── middleware.ts            # Auth middleware
prisma/
├── schema.prisma            # Database schema
└── seed.ts                  # Seed data
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user

### Trips
- `GET /api/trips` - List trips (with pagination, filters)
- `POST /api/trips` - Create trip
- `GET /api/trips/[id]` - Get trip details
- `PATCH /api/trips/[id]` - Update trip
- `POST /api/trips/[id]/assign` - Assign truck to trip
- `POST /api/trips/[id]/status` - Update trip status

### Trucks
- `GET /api/trucks` - List trucks
- `POST /api/trucks` - Add truck
- `GET /api/trucks/[id]` - Get truck details
- `GET /api/trucks/recommend` - Smart truck recommendation

### Tracking
- `GET /api/tracking` - Get all active vehicle positions
- `POST /api/tracking` - Update vehicle location (from mobile)
- `GET /api/tracking/[truckId]/history` - Location history

### Drivers
- `GET /api/drivers` - List drivers
- `POST /api/drivers` - Add driver

## Environment Variables

See `.env.example` for all required environment variables.

## Roadmap

- [ ] Mobile app (React Native)
- [ ] AI-powered ETA prediction
- [ ] Route optimization
- [ ] WhatsApp integration
- [ ] Multi-language support
- [ ] Digital POD with e-signatures
- [ ] Invoice generation
- [ ] Scheduled reports via email

## License

Proprietary - All rights reserved.
