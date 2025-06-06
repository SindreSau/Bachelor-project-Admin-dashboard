'use server';
import { logger } from '@/lib/logger.server';
import { BlobServiceClient } from '@azure/storage-blob';

export async function deleteFileByUrlFromBlobStorage(blobUrl: string): Promise<void> {
  const connectionString = process.env.AZURITE_CONNECTION_STRING || '';
  const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);

  const url = new URL(blobUrl);
  const pathSegments = url.pathname.split('/');

  const containerName = pathSegments[2];
  const blobName = pathSegments.slice(3).join('/');

  if (!containerName || !blobName) {
    logger.error(
      {
        action: 'deleteFileByUrlFromBlobStorage',
        blobUrl,
      },
      'Invalid blob URL'
    );
    return;
  }

  const containerClient = blobServiceClient.getContainerClient(containerName);
  const blobClient = containerClient.getBlobClient(blobName);

  await blobClient.deleteIfExists();
  logger.info(
    {
      action: 'deleteFileByUrlFromBlobStorage',
      blobUrl,
    },
    `Deleted blob: ${containerName}/${blobName}`
  );
}

export async function deleteAllFilesFromBlobStorage(): Promise<void> {
  const connectionString = process.env.AZURITE_CONNECTION_STRING || '';
  const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);

  try {
    for await (const container of blobServiceClient.listContainers()) {
      const containerClient = blobServiceClient.getContainerClient(container.name);
      for await (const blob of containerClient.listBlobsFlat()) {
        const blobClient = containerClient.getBlobClient(blob.name);
        await blobClient.deleteIfExists();
      }
    }
  } catch (error) {
    logger.error(
      {
        action: 'deleteAllFilesFromBlobStorage',
        error: error instanceof Error ? error : new Error(String(error)),
      },
      'Failed to delete all blobs'
    );
    return;
  }
  logger.info(
    {
      action: 'deleteAllFilesFromBlobStorage',
    },
    'Deleted all blobs from all containers'
  );
}
