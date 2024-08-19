import { clerkMiddleware } from '@clerk/nextjs/server';

export default clerkMiddleware({secretKey: process.env.CLERK_API_KEY});

export const config = {
  matcher: ["/((?!_next/static|favicon.ico).*)"],
};
