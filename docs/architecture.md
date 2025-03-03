# Authentication Setup for Next.js Applications

This document outlines the authentication setup for two Next.js 15 applications that need to communicate securely.

## System Architecture Overview

- **Dashboard Application**: Protected by Kinde auth with API endpoints using API keys
- **Application Portal**: Public-facing with API endpoint secured by API key
- **Communication**: Secured via API keys and CORS

## Dashboard Application Setup

### Middleware Configuration

```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getAuth } from '@kinde-oss/kinde-auth-nextjs/server';

export async function middleware(request: NextRequest) {
  // Skip Kinde auth for specific API endpoints
  if (
    request.nextUrl.pathname === '/api/tasks' ||
    request.nextUrl.pathname === '/api/applications'
  ) {
    return NextResponse.next();
  }

  // For all other routes, use Kinde authentication
  const auth = await getAuth(request);

  if (!auth.isAuthenticated) {
    return auth.redirectToLogin();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
```

### API Endpoints with API Key Authentication

```typescript
// app/api/tasks/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // API key authentication
  const apiKey = request.headers.get('x-api-key');
  if (apiKey !== process.env.API_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Proceed with API functionality
  // ...
}
```

```typescript
// app/api/applications/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  // API key authentication
  const apiKey = request.headers.get('x-api-key');
  if (apiKey !== process.env.API_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Proceed with API functionality
  // ...
}
```

## Application Portal Setup

### API Endpoint for Rebuild

```typescript
// app/api/rebuild/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export async function POST(request: NextRequest) {
  // Verify API key
  const apiKey = request.headers.get('x-api-key');
  if (apiKey !== process.env.API_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Revalidate the tasks page
  revalidatePath('/tasks');

  return NextResponse.json({ revalidated: true });
}
```

## CORS Configuration

```typescript
// middleware.ts (Dashboard app)
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  if (
    request.nextUrl.pathname.startsWith('/api/tasks') ||
    request.nextUrl.pathname.startsWith('/api/applications')
  ) {
    const allowedOrigin = process.env.ALLOWED_ORIGINS;
    const origin = request.headers.get('origin') || '';

    if (allowedOrigin && allowedOrigin === origin) {
      const response = NextResponse.next();

      response.headers.set('Access-Control-Allow-Origin', origin);
      response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
      response.headers.set('Access-Control-Allow-Headers', 'Content-Type, x-api-key');

      return response;
    }

    if (request.method === 'OPTIONS') {
      return new NextResponse(null, { status: 200 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/tasks', '/api/applications'],
};
```

## Environment Configuration

### Dashboard `.env`

```
KINDE_CLIENT_ID=your_kinde_client_id
KINDE_CLIENT_SECRET=your_kinde_client_secret
KINDE_ISSUER_URL=https://your-kinde-domain.kinde.com
KINDE_SITE_URL=https://your-dashboard-url.com
API_KEY=your_secure_api_key_string
ALLOWED_ORIGINS=https://your-application-portal-url.com
```

### Application Portal `.env`

```
API_KEY=your_secure_api_key_string  # Same as in Dashboard
DASHBOARD_API_URL=https://your-dashboard-url.com
```
