import isValidKeyFromHeaders from '@/utils/api/validate-request';
import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { MAX_FILE_SIZE } from '@/lib/constants';

export async function POST(request: NextRequest) {
  // Authenticate with API key
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

    const email = formData.get('email') as string;
    const documentType = formData.get('documentType') as string;
    const file = formData.get('file') as File;

    // Validate required fields
    if (!email || !documentType) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          message: 'Validation failed',
          errors: ['Missing required fields: email and documentType are required'],
        },
        { status: 400 }
      );
    }

    // Validate document type
    if (documentType !== 'cv' && documentType !== 'grades') {
      return NextResponse.json(
        {
          success: false,
          data: null,
          message: 'Validation failed',
          errors: ['Invalid documentType: must be either "cv" or "grades"'],
        },
        { status: 400 }
      );
    }

    // Validate file
    if (!file) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          message: 'Validation failed',
          errors: ['No file uploaded'],
        },
        { status: 400 }
      );
    }

    // Validate file type
    if (file.type !== 'application/pdf') {
      return NextResponse.json(
        {
          success: false,
          data: null,
          message: 'Validation failed',
          errors: ['File must be a PDF'],
        },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          message: 'Validation failed',
          errors: [`File size exceeds the limit of ${MAX_FILE_SIZE / (1024 * 1024)}MB`],
        },
        { status: 400 }
      );
    }

    // Create a sanitized email for the filename (remove special chars)
    const sanitizedEmail = email.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();

    // Create a filename using the email and document type
    const timestamp = Date.now();
    const filename = `${sanitizedEmail}_${documentType}_${timestamp}.pdf`;

    // TODO: Implement blob-storage service here
    const blobUrl = `https://example.com/files/${filename}`;

    return NextResponse.json(
      {
        success: true,
        data: {
          email: email,
          documentType: documentType,
          filename: file.name,
          size: file.size,
          type: file.type,
          blobUrl: blobUrl,
        },
        message: 'File uploaded successfully',
        errors: null,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error processing file upload:', error);
    return NextResponse.json(
      {
        success: false,
        data: null,
        message: 'Failed to process file upload',
        errors: [error instanceof Error ? error.message : 'Unknown error'],
      },
      { status: 500 }
    );
  }
}
