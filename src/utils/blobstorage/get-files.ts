'use server';
import { BlobServiceClient } from '@azure/storage-blob';

export async function getBlobPdf(blobUrl: string, containerName: string = 'pdf'): Promise<File> {
  console.log('Full blob URL:', blobUrl);

  const connectionString = process.env.AZURITE_CONNECTION_STRING || '';
  const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);

  if (!blobUrl) {
    throw new Error('Blob URL is undefined or empty');
  }

  try {
    // Parse URL
    const url = new URL(blobUrl);
    const pathParts = url.pathname.split('/').filter(Boolean);

    // Use the provided containerName or default to 'pdf'
    const container = containerName || 'pdf';

    // Get the filename (last part of the URL)
    const blobName = pathParts[pathParts.length - 1];

    console.log('Container:', container);
    console.log('Blob name:', blobName);

    const containerClient = blobServiceClient.getContainerClient(container);
    const blobClient = containerClient.getBlobClient(blobName);

    const downloadBlockBlobResponse = await blobClient.download();

    if (!downloadBlockBlobResponse.readableStreamBody) {
      throw new Error('Failed to download blob: readableStreamBody is undefined');
    }

    const blobData = await streamToBuffer(downloadBlockBlobResponse.readableStreamBody);
    const file = new File([blobData], blobName, { type: 'application/pdf' });

    return file;
  } catch (error) {
    console.error('Error in getBlobPdf:', error);
    throw error;
  }
}

async function streamToBuffer(readableStream: NodeJS.ReadableStream): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    readableStream.on('data', (data) => {
      chunks.push(data instanceof Buffer ? data : Buffer.from(data));
    });
    readableStream.on('end', () => {
      resolve(Buffer.concat(chunks));
    });
    readableStream.on('error', reject);
  });
}

export async function listAllBlobs(): Promise<string[]> {
  const connectionString = process.env.AZURITE_CONNECTION_STRING || '';
  const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);

  const blobNames: string[] = [];

  for await (const container of blobServiceClient.listContainers()) {
    const containerClient = blobServiceClient.getContainerClient(container.name);
    for await (const blob of containerClient.listBlobsFlat()) {
      blobNames.push(`${container.name}/${blob.name}`);
    }
  }

  return blobNames;
}
