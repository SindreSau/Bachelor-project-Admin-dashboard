'use server';
import { BlobServiceClient } from '@azure/storage-blob';

export async function deleteByUrl(blobUrl: string): Promise<void> {
  console.log('blobUrl to delete: ', blobUrl);

  const connectionString = process.env.AZURITE_CONNECTION_STRING || '';
  const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);

  const url = new URL(blobUrl);
  const pathSegments = url.pathname.split('/');
  console.log('pathSegments: ', pathSegments);

  const containerName = pathSegments[2];
  const blobName = pathSegments.slice(3).join('/');

  if (!containerName || !blobName) {
    throw new Error('Invalid blob URL');
  }

  console.log('containerName: ', containerName);
  console.log('blobName: ', blobName);

  const containerClient = blobServiceClient.getContainerClient(containerName);
  const blobClient = containerClient.getBlobClient(blobName);

  await blobClient.deleteIfExists();
  console.log(`Deleted blob: ${blobUrl}`);
}

export async function deleteAll(): Promise<void> {
  const connectionString = process.env.AZURITE_CONNECTION_STRING || '';
  const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);

  for await (const container of blobServiceClient.listContainers()) {
    const containerClient = blobServiceClient.getContainerClient(container.name);
    for await (const blob of containerClient.listBlobsFlat()) {
      const blobClient = containerClient.getBlobClient(blob.name);
      await blobClient.deleteIfExists();
      console.log(`Deleted blob: ${container.name}/${blob.name}`);
    }
  }
}
