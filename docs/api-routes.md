# Dashboard API Routes Documentation

## Table of Contents

- [Authentication](#authentication)
- [Tasks](#tasks)
  - [GET `/api/tasks`](#get-apitasks)
- [Applications](#applications)
  - [POST `/api/applications`](#post-apiapplications)
- [Files](#files)
  - [POST `/api/files`](#post-apifiles)
- [Integration with Application Project](#integration-with-application-project)
  - [Revalidation (External)](#revalidation-external)
- [Environment Variables](#environment-variables)
- [Error Handling](#error-handling)

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

### Files

#### POST `/api/files`

Uploads a PDF document (CV or grades) associated with a student email. Remember to use **Promise.all()** to upload both CV and grades documents in parallel for all students before submitting an application.

**Request Format**: FormData with the following fields:

- `email` (string, required): Student's email address
- `documentType` (string, required): Type of document - must be either "cv" or "grades"
- `file` (File, required): PDF document to upload (max 5MB)

**Response Structure**:

- `success` (boolean): Indicates if the upload was successful
- `data` (object|null): Contains information about the uploaded file when successful
  - `email` (string): Original student email
  - `documentType` (string): Type of document uploaded
  - `filename` (string): Original filename
  - `size` (number): File size in bytes
  - `type` (string): File MIME type
  - `blobUrl` (string): URL to access the uploaded file
- `message` (string): Description of the operation result
- `errors` (array|null): Error messages if any

**Response Examples**:

Success Response (201 Created):

```json
{
  "success": true,
  "data": {
    "email": "student@example.com",
    "documentType": "cv",
    "filename": "resume.pdf",
    "size": 245789,
    "type": "application/pdf",
    "blobUrl": "https://example.com/files/student_example_com_cv_1615478956789.pdf"
  },
  "message": "File uploaded successfully",
  "errors": null
}
```

Validation Error Response (400 Bad Request):

```json
{
  "success": false,
  "data": null,
  "message": "Validation failed",
  "errors": ["File size exceeds the limit of 5MB"]
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
  "message": "Failed to process file upload",
  "errors": ["Error message details"]
}
```

**Example Usage**:

```javascript
// Example of creating FormData for file upload
const formData = new FormData();
formData.append('email', 'student@example.com');
formData.append('documentType', 'cv');

// Get file from file input element
const fileInput = document.getElementById('fileUpload');
formData.append('file', fileInput.files[0]);

// Send the request
fetch('/api/files', {
  method: 'POST',
  headers: {
    Authorization: 'Bearer your-secret-api-token',
  },
  body: formData,
})
  .then((response) => response.json())
  .then((data) => console.log(data));
```

**Notes**:

- Files must be in PDF format
- Maximum file size is 5MB
- Each student must upload both CV and grades documents before submitting an application
- The returned blob URL must be included in the application submission

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
