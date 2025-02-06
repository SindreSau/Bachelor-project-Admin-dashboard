'use server';
import { BlobServiceClient } from '@azure/storage-blob';

export async function uploadPdf(file: File) {
  if (!file || file.type !== 'application/pdf') {
    throw new Error('Please provide a valid PDF file');
  }

  const connectionString = process.env.AZURITE_CONNECTION_STRING || '';
  const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);

  const containerName = 'pdf';
  const containerClient = blobServiceClient.getContainerClient(containerName);
  await containerClient.createIfNotExists();

  const blobName = `${Date.now()}-${file.name}`;
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  await blockBlobClient.upload(buffer, buffer.length);

  return blockBlobClient.url;
}
