import { withAuth } from '@kinde-oss/kinde-auth-nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
  const allowedRoutes = ['/api/tasks', '/api/applications'];
  if (allowedRoutes.includes(req.nextUrl.pathname)) {
    // TODO: Handle with API keys instead
    // Allow requests to the specific API routes
    return NextResponse.next();
  }

  return withAuth(req);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
