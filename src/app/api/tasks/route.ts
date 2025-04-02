import { getPublishedTasks } from '@/actions/tasks/get-published-tasks';
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import isValidKeyFromHeaders from '@/utils/api/validate-request';
import { RequestLogger, withRequestLogger } from '@/lib/logger.server';

export const GET = withRequestLogger(async function GET(logger: RequestLogger) {
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

    logger.info(
      {
        details: {
          count: tasks.length,
        },
      },
      'Endpoint: Fetched published tasks'
    );
    return NextResponse.json(
      {
        success: true,
        data: tasks,
        message: 'Tasks retrieved successfully',
        errors: null,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    const err = error instanceof Error ? error : new Error(String(error));
    logger.error({ error: err }, 'Failed to fetch tasks');
    return NextResponse.json(
      {
        success: false,
        data: null,
        message: 'Failed to fetch tasks',
        errors: [err.message],
      },
      { status: 500 }
    );
  }
});
