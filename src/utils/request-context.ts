// utils/request-context.ts
'use server';

import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { headers } from 'next/headers';
import { v4 as uuidv4 } from 'uuid';

// Define types for context
export interface UserContext {
  id: string;
  email: string | null;
  name: string;
}

export interface HttpContext {
  method: string;
  path: string;
  userAgent: string;
  referer: string;
  clientIp: string;
}

export interface RequestContext {
  requestId: string;
  timestamp: string;
  environment: string;
  http: HttpContext;
  user?: UserContext;
}

// This function creates a request context with standardized information
export async function getRequestContext(): Promise<RequestContext> {
  const requestId = uuidv4(); // Generate a unique ID for each request
  const headersList = await headers();
  const user = await getKindeServerSession()?.getUser();

  const requestContext: RequestContext = {
    requestId,
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    http: {
      method: headersList.get('x-http-method') || 'GET',
      path: headersList.get('x-path') || '',
      userAgent: headersList.get('user-agent') || '',
      referer: headersList.get('referer') || '',
      clientIp: headersList.get('x-forwarded-for') || '',
    },
  };

  // Add user information if available
  if (user) {
    requestContext.user = {
      id: user.id,
      email: user.email,
      name: `${user.given_name || ''} ${user.family_name || ''}`.trim(),
    };
  }

  return requestContext;
}
