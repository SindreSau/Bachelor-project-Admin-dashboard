# Dashboard API Routes Documentation

## Authentication

All API routes require authentication unless specifically noted. Authentication is done via an API key sent in the `X-API-Key` header.

```
X-API-Key: your-secret-api-token
```

This token should match the `SECRET_API_TOKEN` environment variable set in both applications.

## API Endpoints

### Tasks

#### GET `/api/tasks`

Retrieves all published tasks available in the system.

**Authentication Required**: Yes (`X-API-Key` header)

**Response:**

```json
{
  "tasks": [
    {
      "id": 1,
      "taskName": "Example Task",
      "taskDescription": "This is an example task description",
      "isPublished": true,
      "createdAt": "2025-03-07T12:00:00Z",
      "updatedAt": "2025-03-07T13:30:00Z"
    }
  ],
  "success": true
}
```

### Applications

#### POST `/api/applications`

Submits a new application. Currently implemented as a dummy endpoint that always returns success.

**Authentication Required**: No

**Response:**

```json
{
  "success": true,
  "message": "Application received"
}
```

## Integration with Application Project

### Revalidation (External)

The Dashboard application includes functionality to trigger revalidation in the external Application project.

> **Note:** The revalidation endpoint (`/api/revalidate`) exists in the Application project, not in this Dashboard.

When task data is updated in the Dashboard (publish/unpublish tasks), the Dashboard automatically triggers revalidation in the Application project to ensure users see the latest task information.

**How it works:**

1. The Dashboard calls the Application's `/api/revalidate` endpoint
2. Authentication is performed using the shared `SECRET_API_TOKEN`
3. The Application revalidates its `/` route, refreshing the task display
4. Future visitors to the Application will see the updated task list

## Environment Variables

The following environment variables must be configured:

| Variable                   | Description                                                         |
| -------------------------- | ------------------------------------------------------------------- |
| `SECRET_API_TOKEN`         | Shared secret token used for API authentication between projects    |
| `APPLICATION_APP_BASE_URL` | Base URL of the Application project (e.g., `http://localhost:3000`) |

## Error Handling

All API routes return standardized error responses:

```json
{
  "error": "Error message",
  "success": false
}
```

HTTP status codes are used appropriately:

- 200: Success
- 401: Unauthorized (Invalid or missing API key)
- 500: Server error
