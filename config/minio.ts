import { Client } from 'minio';

const parseUseSsl = (value: string | undefined): boolean => {
  return value === '1' || value === 'true';
};

export const minioBucket = process.env.MINIO_BUCKET || 'diploma-images';
export const minioPublicBaseUrl =
  process.env.MINIO_PUBLIC_BASE_URL || 'http://localhost:9000';

export const minioClient = new Client({
  endPoint: process.env.MINIO_ENDPOINT || 'localhost',
  port: Number(process.env.MINIO_PORT) || 9000,
  useSSL: parseUseSsl(process.env.MINIO_USE_SSL),
  accessKey: process.env.MINIO_ACCESS_KEY || 'minioadmin',
  secretKey: process.env.MINIO_SECRET_KEY || 'minioadminpassword',
});

export const initMinio = async (): Promise<void> => {
  try {
    const exists = await minioClient.bucketExists(minioBucket);

    if (!exists) {
      throw new Error(`MinIO bucket "${minioBucket}" does not exist`);
    }

    console.log('MinIO connection established.');
  } catch (error) {
    console.error('MinIO connection failed.', error);
    throw error;
  }
};

export const buildPublicObjectUrl = (objectKey: string): string => {
  return `${minioPublicBaseUrl}/${minioBucket}/${objectKey}`;
};

export const extractObjectKeyFromPublicUrl = (url: string): string | null => {
  const prefix = `${minioPublicBaseUrl}/${minioBucket}/`;

  if (!url.startsWith(prefix)) {
    return null;
  }

  return url.slice(prefix.length);
};
