/**
 * Database Migration Script
 * Run this after updating the schema to create all tables
 */

import { exec } from "child_process"
import { promisify } from "util"

const execAsync = promisify(exec)

async function migrate() {
  console.log("🔄 Running database migration...")

  try {
    // Generate Prisma Client
    console.log("📦 Generating Prisma Client...")
    await execAsync("npx prisma generate")

    // Run migration
    console.log("🗄️  Creating database tables...")
    await execAsync("npx prisma migrate dev --name add_complete_schema")

    console.log("✅ Migration completed successfully!")
    console.log("\n📝 Next steps:")
    console.log("1. Run seed script: npm run seed")
    console.log("2. Start development server: npm run dev")
  } catch (error) {
    console.error("❌ Migration failed:", error)
    process.exit(1)
  }
}

migrate()
