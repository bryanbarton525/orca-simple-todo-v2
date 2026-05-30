import { uploadFile, UploadResult } from "./s3-uploader.service";
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { jest } from "@jest/globals";

jest.mock("@aws-sdk/client-s3");
jest.mock("@aws-sdk/s3-request-presigner", () => ({
  getSignedUrl: jest.fn().mockResolvedValue("http://localhost:4566/test-url"),
}));

describe("uploadFile", () => {
  const mockSend = jest.fn();
  (S3Client as any).mockImplementation(() => ({
    send: mockSend,
  }));

  beforeEach(() => {
    mockSend.mockClear();
    process.env.S3_ENDPOINT = "http://localhost:4566";
    process.env.AWS_ACCESS_KEY_ID = "test";
    process.env.AWS_SECRET_ACCESS_KEY = "test";
    process.env.S3_BUCKET = "test-bucket";
  });

  it("uploads a valid file and returns key and url", async () => {
    mockSend.mockResolvedValueOnce(undefined);
    const file = {
      name: "test.txt",
      type: "text/plain",
      size: 100,
      buffer: Buffer.from("test"),
    };
    const userId = "user1";

    const result: UploadResult = await uploadFile(file, userId);

    expect(mockSend).toHaveBeenCalledTimes(1);
    expect(result).toHaveProperty("key");
    expect(result).toHaveProperty("url");
    expect(result.url).toContain("http://localhost:4566");
  });

  it("rejects unsupported file type", async () => {
    const file = {
      name: "test.txt",
      type: "application/zip",
      size: 100,
      buffer: Buffer.from("test"),
    };
    const userId = "user1";
    await expect(uploadFile(file, userId)).rejects.toThrow("Unsupported file type");
  });

  it("rejects oversized file", async () => {
    const file = {
      name: "big.txt",
      type: "text/plain",
      size: 10 * 1024 * 1024,
      buffer: Buffer.alloc(10 * 1024 * 1024),
    };
    const userId = "user1";
    await expect(uploadFile(file, userId)).rejects.toThrow("File size exceeds limit");
  });
});\n