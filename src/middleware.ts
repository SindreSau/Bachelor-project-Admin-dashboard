import { withAuth } from '@kinde-oss/kinde-auth-nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { logger } from './lib/logger';

export async function middleware(req: NextRequest) {
  logger.debug('Middleware called');
  const allowedRoutes = ['/api/tasks', '/api/applications', '/api/files'];
  if (allowedRoutes.includes(req.nextUrl.pathname)) {
    return NextResponse.next();
  }

  return withAuth(req);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
