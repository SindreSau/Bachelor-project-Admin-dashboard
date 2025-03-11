import submitApplication from '@/actions/applications/submit-application';
import isValidKeyFromHeaders from '@/utils/api/validate-request';
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
  school: z.string().min(1),
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
export type ApplicationData = z.infer<typeof applicationSchema>;

export async function POST(request: NextRequest) {
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
          success: false,
          data: null,
          message: 'Validation failed',
          errors: validationResult.error.format(),
        },
        { status: 400 }
      );
    }

    const applicationData: ApplicationData = validationResult.data;

    // Submit the application to the database
    const result = await submitApplication(applicationData);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          message: result.message,
          errors: [result.message],
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: validationResult.data,
        message: result.message,
        errors: null,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json(
      {
        success: false,
        data: null,
        message: 'Failed to process request',
        errors: [error instanceof Error ? error.message : 'Unknown error'],
      },
      { status: 500 }
    );
  }
}
