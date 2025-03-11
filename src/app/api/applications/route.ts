import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Define schemas for student data validation
const studentSchema = z.object({
  email: z.string().email(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  cv_blob: z.string().url(),
  grades_blob: z.string().url(),
});

// Create a unified validation schema for FormData
const applicationSchema = z.object({
  school: z.string(),
  students: z.string().transform((str, ctx) => {
    try {
      const parsed = JSON.parse(str);
      // Validate that it's an array of student objects
      const studentArraySchema = z.array(studentSchema);
      const result = studentArraySchema.safeParse(parsed);

      if (!result.success) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Invalid student data: ${result.error.message}`,
        });
        return z.NEVER;
      }

      return result.data;
    } catch {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Invalid JSON for students field',
      });
      return z.NEVER;
    }
  }),
  coverLetter: z.string(),
  prioritizedTasks: z.array(z.coerce.number()),
});

// Type for validated data
type ApplicationData = z.infer<typeof applicationSchema>;

export async function POST(request: NextRequest) {
  // Get the API key from request headers
  const headersList = await headers();
  const secretApiTokenFromClient = headersList.get('X-API-Key');

  // Check if API key is provided and valid
  if (!secretApiTokenFromClient || secretApiTokenFromClient !== process.env.SECRET_API_TOKEN) {
    return NextResponse.json({ error: 'Unauthorized', success: false }, { status: 401 });
  }

  try {
    const formData = await request.formData();

    // Parse and validate form data
    const validationResult = applicationSchema.safeParse({
      school: formData.get('school'),
      students: formData.get('students'),
      coverLetter: formData.get('coverLetter'),
      prioritizedTasks: formData.getAll('prioritizedTasks'),
    });

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: validationResult.error.format(),
          success: false,
        },
        { status: 400 }
      );
    }

    const applicationData: ApplicationData = validationResult.data;
    console.log('Application data:', applicationData);

    return NextResponse.json(
      {
        success: true,
        data: validationResult.data,
        message: 'Application received successfully!',
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json(
      {
        error: 'Failed to process request',
        success: false,
      },
      { status: 500 }
    );
  }
}
