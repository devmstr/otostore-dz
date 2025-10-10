# Local Development Setup

This guide will help you set up the Store Management System on your local machine.

## Prerequisites

- Node.js 18+ installed
- A Neon PostgreSQL database (free tier available)
- A Clerk account (free tier available)

## Step 1: Clone and Install

\`\`\`bash
# Clone the repository
git clone <your-repo-url>
cd <your-repo-name>

# Install dependencies
npm install
\`\`\`

## Step 2: Environment Variables

1. Copy the example environment file:
\`\`\`bash
cp .env.example .env
\`\`\`

2. Fill in the environment variables in `.env`:

### Database Setup (Neon)

1. Go to [Neon Console](https://console.neon.tech)
2. Create a new project or use an existing one
3. Copy the **Connection String** (pooled)
4. Paste it as `DATABASE_URL` in your `.env` file

Example:
\`\`\`
DATABASE_URL="postgresql://user:password@ep-cool-sound-123456.us-east-2.aws.neon.tech/neondb?sslmode=require"
\`\`\`

### Clerk Authentication Setup

1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Create a new application
3. Go to **API Keys** section
4. Copy the following keys to your `.env`:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY`

5. Set up the webhook:
   - Go to **Webhooks** in Clerk Dashboard
   - Click **Add Endpoint**
   - URL: `https://your-domain.com/api/webhooks/clerk` (or use ngrok for local testing)
   - Subscribe to events: `user.created`, `user.updated`, `user.deleted`
   - Copy the **Signing Secret** as `CLERK_WEBHOOK_SECRET`

For local development with webhooks, use [ngrok](https://ngrok.com):
\`\`\`bash
ngrok http 3000
# Use the ngrok URL for your webhook endpoint
\`\`\`

## Step 3: Database Setup

1. Generate Prisma Client:
\`\`\`bash
npx prisma generate
\`\`\`

2. Push the schema to your database:
\`\`\`bash
npx prisma db push
\`\`\`

3. Seed the database with sample data:
\`\`\`bash
npx prisma db seed
\`\`\`

## Step 4: Run the Development Server

\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Step 5: Access the Application

1. Go to `/sign-up` to create your first user account
2. The first user will automatically be assigned the `ADMIN` role
3. Access the dashboard at `/dashboard`

## Default Test Data

After seeding, you'll have:
- 50 sample products
- 20 sample customers
- 30 sample orders
- 5 suppliers
- Stock movement history

## Troubleshooting

### Database Connection Issues

- Ensure your `DATABASE_URL` is correct
- Check that your IP is allowed in Neon (Neon allows all IPs by default)
- Verify SSL mode is set to `require`

### Clerk Authentication Issues

- Verify all Clerk environment variables are set correctly
- Check that the publishable key starts with `pk_`
- Ensure the secret key starts with `sk_`
- For webhooks, make sure the endpoint is publicly accessible

### Prisma Issues

If you encounter Prisma errors:
\`\`\`bash
# Reset Prisma Client
npx prisma generate --force

# Reset database (WARNING: This will delete all data)
npx prisma db push --force-reset
\`\`\`

## Development Tools

### Prisma Studio

View and edit your database with Prisma Studio:
\`\`\`bash
npx prisma studio
\`\`\`

### Database Migrations

For production, use migrations instead of `db push`:
\`\`\`bash
npx prisma migrate dev --name your_migration_name
\`\`\`

## Next Steps

- Customize the application to your needs
- Add more products and configure your inventory
- Set up additional users with different roles
- Configure email notifications (if needed)
- Deploy to Vercel (see deployment docs)

## Support

For issues or questions:
- Check the documentation in `/docs`
- Review the Clerk setup guide: `docs/CLERK_SETUP.md`
- Review the database guide: `docs/DATABASE_SCHEMA.md`
