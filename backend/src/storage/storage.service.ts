import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import dotenv from 'dotenv';

dotenv.config();

const s3Client = new S3Client({
    endpoint: process.env.DO_SPACES_ENDPOINT, // e.g., https://nyc3.digitaloceanspaces.com
    region: "us-east-1", // DigitalOcean Spaces uses this region
    credentials: {
        accessKeyId: process.env.DO_SPACES_KEY || '',
        secretAccessKey: process.env.DO_SPACES_SECRET || ''
    }
});

export const generateUploadUrl = async (bucket: string, key: string, contentType: string) => {
    const command = new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        ACL: 'private',
        ContentType: contentType
    });
    return getSignedUrl(s3Client, command, { expiresIn: 3600 });
};

export const generateDownloadUrl = async (bucket: string, key: string) => {
    const command = new GetObjectCommand({
        Bucket: bucket,
        Key: key
    });
    return getSignedUrl(s3Client, command, { expiresIn: 3600 });
};
