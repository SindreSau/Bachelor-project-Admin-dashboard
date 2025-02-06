'use server';
import { BlobServiceClient } from '@azure/storage-blob';

export async function getBlobPdf(blobUrl: string): Promise<File> {
  const connectionString = process.env.AZURITE_CONNECTION_STRING || '';
  const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);

  const containerName = blobUrl.split('/')[4];
  const blobName = blobUrl.split('/')[5];
  console.log('containerName: ', containerName);
  console.log('blobName: ', blobName);

  const containerClient = blobServiceClient.getContainerClient(containerName);
  const blobClient = containerClient.getBlobClient(blobName);
  const downloadBlockBlobResponse = await blobClient.download();

  if (!downloadBlockBlobResponse.readableStreamBody) {
    throw new Error('Failed to download blob: readableStreamBody is undefined');
  }
  const blobData = await streamToBuffer(downloadBlockBlobResponse.readableStreamBody);
  const file = new File([blobData], blobName, { type: 'application/pdf' });
  console.log(file);

  return file;
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
