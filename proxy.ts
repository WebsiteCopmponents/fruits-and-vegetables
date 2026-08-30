import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { isClerkServerConfigured } from "@/lib/clerk";

/**
 * Next.js 16 uses `proxy.ts` (formerly middleware).
 * Keep Clerk when secret is present; otherwise pass through.
 */
export default isClerkServerConfigured()
  ? clerkMiddleware()
  : function proxy() {
      return NextResponse.next();
    };

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
