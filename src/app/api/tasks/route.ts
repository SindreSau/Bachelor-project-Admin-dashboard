import { getPublishedTasks } from '@/actions/tasks/get-published-tasks';
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

export async function GET() {
  try {
    // Get the API key from request headers
    const headersList = await headers();
    const secretApiTokenFromClient = headersList.get('X-API-Key');

    // Check if API key is provided and valid
    if (!secretApiTokenFromClient || secretApiTokenFromClient !== process.env.SECRET_API_TOKEN) {
      return NextResponse.json({ error: 'Unauthorized', success: false }, { status: 401 });
    }

    const tasks = await getPublishedTasks();
    return NextResponse.json({ tasks, success: true });
  } catch (error) {
    console.error('Failed to fetch published tasks:', error);
    return NextResponse.json({ error: 'Failed to fetch tasks', success: false }, { status: 500 });
  }
}
