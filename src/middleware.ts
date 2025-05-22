import { withAuth } from '@kinde-oss/kinde-auth-nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
  const allowedRoutes = ['/api/tasks', '/api/applications', '/api/files'];
  if (allowedRoutes.includes(req.nextUrl.pathname)) {
    return NextResponse.next();
  }

  // bypass auth for testing purposes
  // return NextResponse.next();

  return withAuth(req);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
