import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

const isPublicRoute = createRouteMatcher(["/", "/sign-in(.*)", "/sign-up(.*)", "/api/webhooks(.*)"])

const isAdminRoute = createRouteMatcher(["/dashboard/settings(.*)", "/dashboard/users(.*)"])

const isManagerRoute = createRouteMatcher(["/dashboard/inventory(.*)", "/dashboard/analytics(.*)"])

export default clerkMiddleware(async (auth, req) => {
  const { userId, sessionClaims } = await auth()

  // Protect all routes except public ones
  if (!isPublicRoute(req)) {
    await auth.protect()
  }

  // Role-based access control
  if (userId && sessionClaims) {
    const role = sessionClaims.metadata?.role as string

    // Admin-only routes
    if (isAdminRoute(req) && role !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", req.url))
    }

    // Manager and Admin routes
    if (isManagerRoute(req) && role !== "ADMIN" && role !== "MANAGER") {
      return NextResponse.redirect(new URL("/dashboard", req.url))
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
}
