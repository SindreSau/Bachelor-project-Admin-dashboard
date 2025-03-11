/**
 * Validates if the Authorization header contains a valid API key.
 * @param headersList The request headers
 * @returns boolean indicating if the API key is valid
 */
const isValidKeyFromHeaders = (headersList: Headers): boolean => {
  try {
    const authHeader = headersList.get('Authorization');
    if (!authHeader) {
      throw new Error('No Authorization header provided');
    }

    const apiKey = authHeader.slice(7); // Remove 'Bearer '

    if (!apiKey) {
      throw new Error('Empty API key');
    }

    const secretToken = process.env.SECRET_API_TOKEN;
    if (!secretToken) {
      throw new Error('SECRET_API_TOKEN is not defined in environment variables');
    }

    return apiKey === secretToken;
  } catch (error) {
    console.error(
      `API key validation error: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
    return false;
  }
};

export default isValidKeyFromHeaders;
