# Environment Variables Documentation

## Backend (.env)

Copy `.env.example` to `.env` in the backend directory and configure:

- `NODE_ENV`: Environment (development/production)
- `PORT`: Backend server port (default: 3001)
- `DB_HOST`: Database host
- `DB_PORT`: Database port
- `DB_NAME`: Database name
- `DB_USER`: Database user
- `DB_PASSWORD`: Database password
- `JWT_SECRET`: JWT secret key
- `JWT_EXPIRES_IN`: JWT token expiration time

## Frontend (.env.local)

Copy `.env.local.example` to `.env.local` in the frontend directory and configure:

- `NEXT_PUBLIC_API_URL`: Backend API URL
