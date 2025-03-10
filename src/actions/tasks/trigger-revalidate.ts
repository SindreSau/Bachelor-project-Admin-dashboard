'use server';

export default async function triggerRevalidation() {
  console.debug('Triggering revalidation...');
  const appUrl = process.env.APPLICATION_APP_BASE_URL;
  const apiToken = process.env.SECRET_API_TOKEN;

  if (!appUrl || !apiToken) {
    console.error('Missing required environment variables');
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
      console.error(`Revalidation failed with status ${response.status}:`, text);
      return;
    }

    // Check content type to ensure we're getting JSON
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      console.error('Received non-JSON response:', text);
      return;
    }

    const data = await response.json();
    console.log('Revalidation result:', data);
  } catch (error) {
    console.error('Failed to trigger revalidation:', error);
  }
}
