import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "application/pdf"];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

const s3Client = new S3Client({
  region: process.env.AWS_REGION ?? "us-east-1",
  endpoint: process.env.S3_ENDPOINT,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? "",
  },
});

export interface UploadResult {
  key: string;
  url: string;
}

export async function uploadFile(file: { name: string; type: string; size: number; buffer: Buffer }, userId: string): Promise<UploadResult> {
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error(`Unsupported file type: ${file.type}`);
  }
  if (file.size > MAX_SIZE) {
    throw new Error(`File size exceeds limit of ${MAX_SIZE} bytes`);
  }

  const key = `${userId}/${Date.now()}_${file.name}`;
  const bucket = process.env.S3_BUCKET ?? "uploads";

  const putParams = {
    Bucket: bucket,
    Key: key,
    Body: file.buffer,
    ContentType: file.type,
  };

  const putCommand = new PutObjectCommand(putParams);
  await s3Client.send(putCommand);

  const getParams = {
    Bucket: bucket,
    Key: key,
    Expires: 60 * 60, // 1 hour
  };

  const url = await getSignedUrl(s3Client, new GetObjectCommand(getParams));

  return { key, url };
}\n