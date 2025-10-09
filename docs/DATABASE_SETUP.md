# Neon PostgreSQL Database Setup

This project uses [Neon](https://neon.tech) as the PostgreSQL database provider with Prisma ORM.

## Setup Instructions

### 1. Get Your Neon Connection Strings

1. Go to [Neon Console](https://console.neon.tech)
2. Select your project or create a new one
3. Navigate to the **Dashboard** → **Connection Details**
4. Copy both connection strings:
   - **Pooled connection** (for DATABASE_URL)
   - **Direct connection** (for DIRECT_URL)

### 2. Configure Environment Variables

Add these to your Vercel project or `.env.local` file:

\`\`\`env
DATABASE_URL="postgresql://user:password@ep-xxx.region.aws.neon.tech/dbname?sslmode=require"
DIRECT_URL="postgresql://user:password@ep-xxx.region.aws.neon.tech/dbname?sslmode=require"
\`\`\`

**Important:**
- `DATABASE_URL` uses the **pooled connection** (recommended for serverless)
- `DIRECT_URL` uses the **direct connection** (for migrations)

### 3. Run Database Migrations

\`\`\`bash
# Generate Prisma Client
pnpm prisma generate

# Push schema to database (development)
pnpm prisma db push

# Or run migrations (production)
pnpm prisma migrate deploy
\`\`\`

### 4. Seed the Database (Optional)

\`\`\`bash
pnpm prisma db seed
\`\`\`

## Why Neon?

- **Serverless-native**: Perfect for Next.js and Vercel deployments
- **Connection pooling**: Built-in pooling for serverless functions
- **Instant branching**: Create database branches for preview deployments
- **Auto-scaling**: Scales to zero when not in use
- **Fast cold starts**: Optimized for serverless environments

## Prisma Configuration

The schema uses:
- `url`: Pooled connection for queries (serverless-optimized)
- `directUrl`: Direct connection for migrations and schema changes

## Common Commands

\`\`\`bash
# View database in Prisma Studio
pnpm prisma studio

# Create a new migration
pnpm prisma migrate dev --name your_migration_name

# Reset database (⚠️ deletes all data)
pnpm prisma migrate reset

# Format schema file
pnpm prisma format
\`\`\`

## Troubleshooting

### Connection Issues

If you see connection errors:
1. Verify your connection strings are correct
2. Ensure `?sslmode=require` is in the URL
3. Check that your Neon project is active (not suspended)

### Migration Errors

If migrations fail:
1. Use `DIRECT_URL` for migrations (not pooled)
2. Check Neon dashboard for connection limits
3. Ensure database user has proper permissions

## Production Deployment

When deploying to Vercel:
1. Add `DATABASE_URL` and `DIRECT_URL` to environment variables
2. Prisma Client is automatically generated during build
3. Run migrations in your CI/CD pipeline or manually

\`\`\`bash
# In your deployment script
pnpm prisma migrate deploy
