// middleware.ts
import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware();

export const config = {
  matcher: [
    // Alle App-Routen und Server Actions erfassen, statische Assets ausschließen
    "/((?!_next|public|api|favicon.ico).*)",
    // Optional: alle API-Routen
    "/api(.*)",
  ],
};
