# Database Schema Documentation

## Overview

The store management system uses PostgreSQL (via Neon) with Prisma ORM. The schema supports a complete POS and inventory management system.

## Entities

### User
- Synced with Clerk authentication
- Roles: ADMIN, MANAGER, CASHIER
- Tracks orders and audit logs

### Customer
- Customer profiles with contact information
- Loyalty points system
- Purchase history tracking

### Supplier
- Supplier information for products
- Contact details and descriptions

### Product
- Complete product catalog
- SKU and barcode support
- Stock levels with min/max thresholds
- Cost and price tracking
- Supplier relationships

### Order
- Order management with status tracking
- Payment method and status
- Tax and discount calculations
- Links to customers and users

### OrderItem
- Individual items in orders
- Quantity and pricing at time of order
- Discount support

### StockMovement
- Complete inventory tracking
- Movement types: PURCHASE, SALE, ADJUSTMENT, RETURN, DAMAGE, TRANSFER
- Audit trail for all stock changes

### AuditLog
- Security and compliance tracking
- Records all user actions
- Searchable by user, entity, and date

## Relationships

\`\`\`
User (1) ----< (N) Order
User (1) ----< (N) AuditLog
Customer (1) ----< (N) Order
Supplier (1) ----< (N) Product
Product (1) ----< (N) OrderItem
Product (1) ----< (N) StockMovement
Order (1) ----< (N) OrderItem
\`\`\`

## Indexes

Optimized indexes for:
- Customer lookups (email, phone)
- Product searches (category, supplier)
- Order queries (customer, user, status, date)
- Stock movements (product, type, date)
- Audit logs (user, date)

## Migration Commands

\`\`\`bash
# Generate Prisma Client
npx prisma generate

# Create migration
npx prisma migrate dev --name migration_name

# Apply migrations
npx prisma migrate deploy

# Seed database
npm run seed
