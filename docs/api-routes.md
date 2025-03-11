# Dashboard API Routes Documentation

## Authentication

All API routes require authentication unless specifically noted. Authentication is done via an API key sent in the `Authorization` header.

```http
Authorization: Bearer your-secret-api-token
```

---

### Tasks

#### GET `/api/tasks`

Retrieves all published tasks available in the system.

**Response Structure**:

- `success` (boolean): Indicates if the request was successful
- `data` (array): List of task objects
- `message` (string): Description of the operation result
- `errors` (array|null): List of error messages if any

**Response Examples**:

Success Response (200 OK):

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "taskName": "Example Task",
      "taskDescription": "This is an example task description",
      "isPublished": true,
      "createdAt": "2025-03-07T12:00:00Z",
      "updatedAt": "2025-03-07T13:30:00Z"
    }
  ],
  "message": "Tasks retrieved successfully",
  "errors": null
}
```

Unauthorized Response (401 Unauthorized):

```json
{
  "success": false,
  "data": null,
  "message": "Unauthorized",
  "errors": ["Invalid or missing API key"]
}
```

Server Error Response (500 Internal Server Error):

```json
{
  "success": false,
  "data": null,
  "message": "Failed to fetch tasks",
  "errors": ["Error message details"]
}
```

---

### Applications

#### POST `/api/applications`

Submits a new application with student information and related documents as blob urls.

**Request Format**: FormData with the following fields:

- `school` (string): Name of the school
- `students` (string): JSON string containing an array of student objects
- `coverLetter` (string): Application cover letter
- `prioritizedTasks` (array): Array of task IDs in order of priority

**Student Object Structure**:

- `email` (string): Student's email address
- `firstName` (string): Student's first name
- `lastName` (string): Student's last name
- `cv_blob` (string): URL to the student's CV document
- `grades_blob` (string): URL to the student's grades document

**Response Structure**:

- `success` (boolean): Indicates if the request was successful
- `data` (object|null): Contains the submitted and processed application data when successful
- `message` (string): Description of the operation result
- `errors` (array|object|null): Validation errors or error messages if any

**Response Examples**:

Success Response (201 Created):

```json
{
  "success": true,
  "data": {
    "school": "Oslomet",
    "students": [
      {
        "email": "student@example.com",
        "firstName": "Student",
        "lastName": "Example",
        "cv_blob": "https://storage.example.com/pdf/student-123-cv-12345.pdf",
        "grades_blob": "https://storage.example.com/pdf/student-123-grades-12345.pdf"
      }
    ],
    "coverLetter": "Application cover letter text",
    "prioritizedTasks": [1, 3]
  },
  "message": "Application received successfully!",
  "errors": null
}
```

Validation Error Response (400 Bad Request):

```json
{
  "success": false,
  "data": null,
  "message": "Validation failed",
  "errors": {
    "_errors": [],
    "school": {
      "_errors": ["String must contain at least 1 character(s)"]
    }
  }
}
```

Unauthorized Response (401 Unauthorized):

```json
{
  "success": false,
  "data": null,
  "message": "Unauthorized",
  "errors": ["Invalid or missing API key"]
}
```

Server Error Response (500 Internal Server Error):

```json
{
  "success": false,
  "data": null,
  "message": "Failed to process request",
  "errors": ["Error message details"]
}
```

**Example Usage**:

```javascript
// Example of creating FormData for submission
const formData = new FormData();
formData.append('school', 'Oslomet');

// Students data needs to be stringified JSON
const students = [
  {
    email: 'student@example.com',
    firstName: 'Student',
    lastName: 'Example',
    cv_blob: 'https://storage.example.com/pdf/student-123-cv-12345.pdf',
    grades_blob: 'https://storage.example.com/pdf/student-123-grades-12345.pdf',
  },
];
formData.append('students', JSON.stringify(students));

formData.append('coverLetter', 'This is our application cover letter...');
formData.append('prioritizedTasks', 1);
formData.append('prioritizedTasks', 3);

// Send the request
fetch('/api/applications', {
  method: 'POST',
  headers: {
    Authorization: 'Bearer your-secret-api-token',
  },
  body: formData,
})
  .then((response) => response.json())
  .then((data) => console.log(data));
```

---

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
