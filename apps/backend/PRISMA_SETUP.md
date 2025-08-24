# Prisma Configuration Setup

This project uses the standard Prisma configuration approach with `schema.prisma` and convenient Nx targets.

## Configuration Files

### `schema.prisma`
- **Location**: `apps/backend/prisma/schema.prisma`
- **Purpose**: Standard Prisma schema file
- **Features**: 
  - Database schema definition
  - Generator configuration
  - Datasource configuration
  - Seed script configuration

## Available Commands

### From Root Directory (Recommended)
```bash
# Generate Prisma client
npm run prisma:generate

# Push schema changes to database
npm run prisma:db-push

# Pull database schema changes
npm run prisma:db-pull

# Create and apply new migration
npm run prisma:migrate-dev

# Deploy existing migrations
npm run prisma:migrate-deploy

# Reset database and apply migrations
npm run prisma:migrate-reset

# Run database seed
npm run prisma:seed

# Open Prisma Studio
npm run prisma:studio
```

### From Backend Directory
```bash
cd apps/backend

# Using Nx
nx run backend:prisma:generate
nx run backend:prisma:db-push
nx run backend:prisma:migrate-dev
nx run backend:prisma:seed
nx run backend:prisma:studio

# Using Prisma directly
npx prisma generate
npx prisma db push
npx prisma migrate dev
npx prisma db seed
npx prisma studio
```

## Configuration Details

### Schema Path
- **Schema**: `./prisma/schema.prisma`
- **Output**: Default Prisma client location

### Seed Configuration
- **Script**: `npx ts-node --compiler-options {"module":"CommonJS"} prisma/seed.ts`
- **Purpose**: Populate database with initial data

### Environment Variables
- **Database URL**: Uses `DATABASE_URL` from environment
- **Validation**: Integrated with Joi environment validation

## Migration from Old Setup

### What Changed
1. ✅ Removed deprecated `package.json#prisma` property
2. ✅ Added convenient Nx targets for all Prisma operations
3. ✅ Added root-level npm scripts for easy access
4. ✅ Uses standard Prisma configuration approach

### Benefits
- **Modern**: Uses latest Prisma configuration standards
- **Flexible**: Easy to customize and extend
- **Integrated**: Works seamlessly with Nx workspace
- **Maintainable**: Clear separation of concerns

## Troubleshooting

### Common Issues
1. **"prisma command not found"**: Run `npm install` to ensure Prisma CLI is available
2. **"schema not found"**: Verify `./prisma/schema.prisma` exists
3. **"database connection failed"**: Check `DATABASE_URL` in your `.env` file

### Reset Everything
```bash
# Reset database, migrations, and regenerate client
npm run prisma:migrate-reset
npm run prisma:generate
npm run prisma:seed
```

## Development Workflow

### Typical Development Cycle
1. **Modify Schema**: Edit `prisma/schema.prisma`
2. **Generate Client**: `npm run prisma:generate`
3. **Create Migration**: `npm run prisma:migrate-dev`
4. **Test Changes**: Run your application
5. **Seed Data**: `npm run prisma:seed` (if needed)

### Production Deployment
1. **Deploy Migrations**: `npm run prisma:migrate-deploy`
2. **Generate Client**: `npm run prisma:generate`
3. **Build Application**: `npm run backend:build`
