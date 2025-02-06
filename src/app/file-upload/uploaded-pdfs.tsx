'use client';
import React, { useState, useEffect } from 'react';
import { listAllBlobs } from '@/actions/blobstorage/get-files';
import Link from 'next/link';

function getBlobBaseUrl() {
  const connectionString = process.env.AZURITE_CONNECTION_STRING || '';
  const blobEndpoint = connectionString
    .split(';')
    .find((part) => part.startsWith('BlobEndpoint='))
    ?.split('=')[1];

  return blobEndpoint || 'http://127.0.0.1:10000/devstoreaccount1/';
}

function concatBlobUrl(blobName: string) {
  return `${getBlobBaseUrl()}devstoreaccount1/pdfcontainer/${blobName}`;
}

const UploadedPdfs = () => {
  const [pdfBlobs, setPdfBlobs] = useState<string[]>([]);

  useEffect(() => {
    listAllBlobs()
      .then((blobs) => {
        const pdfBlobUrls = blobs.map((blob) => concatBlobUrl(blob));
        setPdfBlobs(pdfBlobUrls);
      })
      .catch((error) => console.error('Error fetching PDFs:', error));
  }, []);

  if (!pdfBlobs.length) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Uploaded PDFs</h1>
      <ul>
        {pdfBlobs.map((url) => (
          <li key={url}>
            <Link href={url}>{url}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UploadedPdfs;
