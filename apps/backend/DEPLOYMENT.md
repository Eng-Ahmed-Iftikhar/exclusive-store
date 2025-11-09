# Vercel Deployment Guide for NestJS Backend

## Important Notes

Your backend is crashing on Vercel because:

1. NestJS is not designed for serverless by default
2. Vercel has strict timeouts (10s for Hobby, 60s for Pro)
3. Database connections and long-running processes don't work well in serverless

## Recommended Solutions

### Option 1: Deploy to Traditional Hosting (Recommended for NestJS)

Deploy your backend to platforms that support long-running Node.js processes:

- **Railway** (https://railway.app) - Free tier available, great for NestJS
- **Render** (https://render.com) - Free tier with always-on option
- **Fly.io** (https://fly.io) - Good for global deployment
- **Heroku** - Classic PaaS option
- **DigitalOcean App Platform** - Reliable and affordable

### Option 2: Keep Using Vercel (Requires Changes)

If you must use Vercel, you need to:

1. **Convert to Serverless Architecture:**

   - Each endpoint becomes a separate serverless function
   - Use `@nestjs/platform-express` adapter
   - Cache database connections
   - Handle cold starts

2. **Environment Variables Setup in Vercel:**

   ```
   DATABASE_URL=your_database_url
   JWT_SECRET=your_jwt_secret
   REDIS_URL=your_redis_url (use Upstash Redis for serverless)
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   STRIPE_SECRET_KEY=your_stripe_key
   FRONTEND_URL=your_frontend_url
   ADMIN_URL=your_admin_url
   ```

3. **Database Considerations:**

   - Use connection pooling (PgBouncer)
   - Consider serverless-friendly databases:
     - Neon (serverless Postgres)
     - PlanetScale (serverless MySQL)
     - Supabase (Postgres with connection pooling)

4. **Redis for Serverless:**
   - Use Upstash Redis (serverless Redis)
   - Or remove Redis caching for serverless deployment

## Quick Fix: Deploy to Railway

1. Install Railway CLI:

   ```bash
   npm install -g @railway/cli
   ```

2. Login and create project:

   ```bash
   railway login
   railway init
   ```

3. Set environment variables in Railway dashboard

4. Deploy:
   ```bash
   railway up
   ```

## Current Vercel Configuration

I've created the necessary files, but you'll need to:

1. Update `vercel.json` with correct environment variables
2. Ensure Prisma generates before deployment
3. Use serverless-compatible database (with connection pooling)
4. Consider replacing Redis with Upstash Redis

## Build Command for Vercel

```bash
npm install && npm run backend:build && cd apps/backend && npx prisma generate
```

## The Error You're Seeing

`FUNCTION_INVOCATION_FAILED` means:

- The serverless function crashed during execution
- Likely due to database connection timeout
- Or missing environment variables
- Or cold start timeout

**Recommendation:** Use Railway, Render, or Fly.io instead of Vercel for your NestJS backend. They're better suited for traditional backend applications with databases and real-time features.
