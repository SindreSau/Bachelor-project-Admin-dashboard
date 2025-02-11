'use server';
import { BlobServiceClient } from '@azure/storage-blob';

export async function uploadPdf(file: File) {
  if (!file || file.type !== 'application/pdf') {
    throw new Error('Please provide a valid PDF file');
  }

  try {
    const connectionString = process.env.AZURITE_CONNECTION_STRING || '';
    const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);

    const containerName = 'pdf';
    const containerClient = blobServiceClient.getContainerClient(containerName);

    // Create container with public access
    await containerClient.createIfNotExists({
      access: 'blob', // Makes blobs publicly readable
    });

    const blobName = `${Date.now()}-${file.name}`;
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    // Log the upload attempt
    console.log('Attempting to upload blob:', {
      containerName,
      blobName,
      fileSize: file.size,
      fileType: file.type,
    });

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    await blockBlobClient.upload(buffer, buffer.length, {
      blobHTTPHeaders: {
        blobContentType: 'application/pdf',
      },
    });

    console.log('Upload successful. Blob URL:', blockBlobClient.url);

    return blockBlobClient.url;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
}
