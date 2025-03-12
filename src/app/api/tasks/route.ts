import { getPublishedTasks } from '@/actions/tasks/get-published-tasks';
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import isValidKeyFromHeaders from '@/utils/api/validate-request';

export async function GET() {
  try {
    // Authenticate with api keys
    if (!isValidKeyFromHeaders(await headers())) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          message: 'Unauthorized',
          errors: ['Invalid or missing API key'],
        },
        { status: 401 }
      );
    }

    const tasks = await getPublishedTasks();

    return NextResponse.json(
      {
        success: true,
        data: tasks,
        message: 'Tasks retrieved successfully',
        errors: null,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Failed to fetch published tasks:', error);
    return NextResponse.json(
      {
        success: false,
        data: null,
        message: 'Failed to fetch tasks',
        errors: [error instanceof Error ? error.message : 'Unknown error'],
      },
      { status: 500 }
    );
  }
}
