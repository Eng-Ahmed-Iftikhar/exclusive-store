# Environment Variables Setup

This document explains how to set up the environment variables for the Exclusive backend application.

## Required Environment Variables

Create a `.env` file in the `apps/backend/` directory with the following variables:

### Server Configuration
```env
NODE_ENV=development
PORT=3000
```

### Database Configuration
```env
DATABASE_URL="postgresql://username:password@localhost:5432/exclusive_db"
```

### JWT Configuration
```env
JWT_SECRET="your-super-secret-jwt-key-that-is-at-least-32-characters-long"
JWT_EXPIRES_IN="15m"
```

### Redis Configuration
```env
REDIS_URL="redis://localhost:6379"
```

### Email Configuration
```env
EMAIL_PROVIDER="custom"
EMAIL_HOST="smtp.ethereal.email"
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER="your-email@example.com"
EMAIL_PASS="your-email-password"
EMAIL_FROM="noreply@exclusive.com"
```

### Stripe Configuration
```env
STRIPE_SECRET_KEY="sk_test_your_stripe_secret_key_here"
```

### Frontend Configuration
```env
FRONTEND_URL="http://localhost:5173"
```

### Logging Configuration
```env
LOG_LEVEL="info"
LOG_TO_FILE=false
LOG_DIR="./logs"
```

## Environment Validation

The application uses Joi validation to ensure all required environment variables are present and valid before starting. If any required variables are missing or invalid, the server will not start and will display detailed error messages.

## Validation Rules

- **NODE_ENV**: Must be one of: 'development', 'production', 'test'
- **PORT**: Must be a valid port number (1-65535)
- **DATABASE_URL**: Required, must be a valid PostgreSQL connection string
- **JWT_SECRET**: Required, must be at least 32 characters long
- **REDIS_URL**: Required, must be a valid Redis connection string
- **EMAIL_PROVIDER**: Must be one of: 'gmail', 'outlook', 'yahoo', 'sendgrid', 'mailgun', 'ses', 'custom'
- **EMAIL_HOST**: Must be a valid hostname
- **EMAIL_PORT**: Must be a valid port number
- **EMAIL_SECURE**: Must be a boolean value
- **EMAIL_USER**: Optional, must be a valid email if provided
- **EMAIL_PASS**: Optional
- **EMAIL_FROM**: Must be a valid email address
- **STRIPE_SECRET_KEY**: Required
- **FRONTEND_URL**: Required, must be a valid URI
- **LOG_LEVEL**: Must be one of: 'error', 'warn', 'info', 'debug', 'verbose'
- **LOG_TO_FILE**: Must be a boolean value
- **LOG_DIR**: Must be a valid directory path

## Example .env File

```env
# Server Configuration
NODE_ENV=development
PORT=3000

# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/exclusive_db"

# JWT Configuration
JWT_SECRET="your-super-secret-jwt-key-that-is-at-least-32-characters-long"
JWT_EXPIRES_IN="15m"

# Redis Configuration
REDIS_URL="redis://localhost:6379"

# Email Configuration
EMAIL_PROVIDER="custom"
EMAIL_HOST="smtp.ethereal.email"
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER="your-email@example.com"
EMAIL_PASS="your-email-password"
EMAIL_FROM="noreply@exclusive.com"

# Stripe Configuration
STRIPE_SECRET_KEY="sk_test_your_stripe_secret_key_here"

# Frontend Configuration
FRONTEND_URL="http://localhost:5173"

# Logging Configuration
LOG_LEVEL="info"
LOG_TO_FILE=false
LOG_DIR="./logs"
```

## Development vs Production

- **Development**: Use Ethereal Email for testing, local Redis, local database
- **Production**: Use real email provider, production Redis, production database, strong JWT secret

## Security Notes

- Never commit your `.env` file to version control
- Use strong, unique JWT secrets in production
- Use environment-specific database URLs
- Keep Stripe keys secure and use test keys for development
