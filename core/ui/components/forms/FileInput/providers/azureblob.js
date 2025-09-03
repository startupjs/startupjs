import { BlobServiceClient } from '@azure/storage-blob';

// Replace with your Azure Blob Storage connection string or Azurite connection string
const AZURE_BLOB_STORAGE_CONNECTION_STRING = process.env.AZURE_BLOB_STORAGE_CONNECTION_STRING
const CONTAINER_NAME = 'files' // Container name for storing blobs

let blobServiceClient;
let containerClient;

export function validateSupport() {
  if (!AZURE_BLOB_STORAGE_CONNECTION_STRING) {
    throw new Error(ERRORS.azureNotAvailable);
  }
  // Initialize the BlobServiceClient and ContainerClient once
  if (!blobServiceClient) {
    blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_BLOB_STORAGE_CONNECTION_STRING);
    containerClient = blobServiceClient.getContainerClient(CONTAINER_NAME);
    // Ensure container exists
    containerClient.createIfNotExists().catch((err) => {
      console.error('[Azure Blob Storage] Failed to create container:', err);
      throw err;
    });
  }
}

export async function getFileBlob(fileId, range) {
  validateSupport();
  const blobClient = containerClient.getBlobClient(fileId);

  try {
    // Check if blob exists
    const properties = await blobClient.getProperties();
    const actualFileSize = properties.contentLength;

    if (range) {
      console.log('[Azure Blob Storage] Using Range request for optimal streaming:', { fileId, range });

      // Validate range boundaries
      if (range.start >= actualFileSize || range.start < 0) {
        console.log('[Azure Blob Storage] Range start out of bounds:', { start: range.start, actualFileSize });
        throw new Error('Range start out of bounds');
      }

      // Ensure end is within file bounds
      let adjustedEnd = Math.min(range.end, actualFileSize - 1);

      // Ensure end is not before start
      if (adjustedEnd < range.start) {
        console.log('[Azure Blob Storage] Invalid range:', { start: range.start, end: adjustedEnd, actualFileSize });
        throw new Error('Invalid range');
      }

      console.log('[Azure Blob Storage] Downloading blob with range:', {
        start: range.start,
        end: adjustedEnd,
        actualFileSize,
        originalEnd: range.end,
      });

      // Download blob with range
      const response = await blobClient.download(range.start, adjustedEnd - range.start + 1);
      const chunks = [];

      for await (const chunk of response.readableStreamBody) {
        chunks.push(chunk);
      }

      const result = Buffer.concat(chunks);
      const expectedSize = adjustedEnd - range.start + 1;

      console.log('[Azure Blob Storage] Range response:', {
        expected: expectedSize,
        actual: result.length,
        start: range.start,
        end: adjustedEnd,
        fileId,
      });

      if (result.length === 0) {
        console.warn('[Azure Blob Storage] Empty range response - this may indicate a problem');
      }

      return result;
    } else {
      // Regular download for non-Range requests
      const response = await blobClient.download();
      const chunks = [];

      for await (const chunk of response.readableStreamBody) {
        chunks.push(chunk);
      }

      return Buffer.concat(chunks);
    }
  } catch (error) {
    if (error.statusCode === 404) {
      throw new Error(ERRORS.fileNotFound);
    }
    console.error('[Azure Blob Storage] Error downloading blob:', error);
    throw error;
  }
}

export async function getFileSize(fileId) {
  validateSupport();
  const blobClient = containerClient.getBlobClient(fileId);

  try {
    const properties = await blobClient.getProperties();
    return properties.contentLength;
  } catch (error) {
    if (error.statusCode === 404) {
      throw new Error(ERRORS.fileNotFound);
    }
    console.error('[Azure Blob Storage] Error getting blob size:', error);
    throw error;
  }
}

export async function saveFileBlob(fileId, blob) {
  validateSupport();
  const blobClient = containerClient.getBlockBlobClient(fileId);

  try {
    // Upload blob (overwrites if exists)
    await blobClient.upload(blob, blob.length);
    console.log('[Azure Blob Storage] Blob uploaded successfully:', fileId);
  } catch (error) {
    console.error('[Azure Blob Storage] Error uploading blob:', error);
    throw error;
  }
}

export async function deleteFile(fileId) {
  validateSupport();
  const blobClient = containerClient.getBlobClient(fileId);

  try {
    await blobClient.deleteIfExists();
    console.log('[Azure Blob Storage] Blob deleted successfully:', fileId);
  } catch (error) {
    if (error.statusCode === 404) {
      throw new Error(ERRORS.fileNotFound);
    }
    console.error('[Azure Blob Storage] Error deleting blob:', error);
    throw error;
  }
}

const ERRORS = {
  azureNotAvailable: `
    Azure Blob Storage connection is not available.
    Make sure you have configured the AZURE_BLOB_STORAGE_CONNECTION_STRING environment variable.
  `,
  fileNotFound: `
    File not found in Azure Blob Storage.
  `,
};
