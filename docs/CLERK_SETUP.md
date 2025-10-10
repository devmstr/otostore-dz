# Clerk Authentication Setup

## Environment Variables

Add these to your `.env.local` file:

\`\`\`env
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
CLERK_WEBHOOK_SECRET=whsec_...

# Clerk URLs
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
\`\`\`

## Setup Steps

1. **Create Clerk Account** (Free tier)
   - Go to https://clerk.com
   - Create a new application
   - Copy your API keys

2. **Configure Webhooks**
   - In Clerk Dashboard, go to Webhooks
   - Add endpoint: `https://your-domain.com/api/webhooks/clerk`
   - Subscribe to: `user.created`, `user.updated`, `user.deleted`
   - Copy webhook secret

3. **Run Database Migration**
   \`\`\`bash
   npx prisma migrate dev --name add_users_and_audit_logs
   npx prisma generate
   \`\`\`

4. **Install Clerk Package**
   \`\`\`bash
   npm install @clerk/nextjs svix
   \`\`\`

5. **Set User Roles**
   - First user is automatically CASHIER
   - Use Clerk Dashboard metadata to set roles:
     - Go to Users → Select user → Metadata
     - Add public metadata: `{ "role": "ADMIN" }`

## Role Permissions

- **ADMIN**: Full access to all features
- **MANAGER**: Access to inventory, analytics, orders, customers
- **CASHIER**: Access to orders and basic product viewing
