'use server';

import { RequestLogger, withRequestLogger } from '@/lib/logger.server';

const triggerRevalidation = withRequestLogger(async (logger: RequestLogger) => {
  console.debug('Triggering revalidation...');
  const appUrl = process.env.APPLICATION_APP_BASE_URL;
  const apiToken = process.env.SECRET_API_TOKEN;

  if (!appUrl || !apiToken) {
    logger.error(
      { action: 'triggerRevalidationError' },
      'Missing required environment variables for revalidation - authentication failed!'
    );
    return;
  }

  // Note the URL now includes /revalidate at the end
  const revalidateUrl = `${appUrl}/api/revalidate`;

  try {
    const response = await fetch(revalidateUrl, {
      method: 'POST',
      headers: {
        'X-Revalidate-Token': apiToken,
      },
    });

    // Check if response is OK before trying to parse as JSON
    if (!response.ok) {
      const text = await response.text();
      logger.error(
        { action: 'triggerRevalidationError', status: response.status, text },
        'Failed to trigger revalidation'
      );
      return;
    }

    // Check content type to ensure we're getting JSON
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      logger.error(
        { action: 'triggerRevalidationError', status: response.status, text },
        'Unexpected response format from revalidation endpoint'
      );
      return;
    }

    const data = await response.json();
    if (data.error) {
      logger.error(
        { action: 'triggerRevalidationError', error: data.error },
        'Revalidation endpoint returned an error'
      );
      return;
    } else {
      logger.info(
        { action: 'triggerRevalidationSuccess', data },
        'Revalidation triggered successfully'
      );
    }
  } catch (err) {
    const errorObject = {
      message: err instanceof Error ? err.message : String(err),
      code: (err as { code?: string })?.code,
      stack: process.env.NODE_ENV !== 'production' && err instanceof Error ? err.stack : undefined,
    };
    logger.error(
      { action: 'triggerRevalidationError', error: errorObject },
      'Error triggering revalidation'
    );
  }
});

export default triggerRevalidation;
