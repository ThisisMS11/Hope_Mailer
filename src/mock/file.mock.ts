import { FileI, FileType } from "@/features/files/types";
import { faker } from "@faker-js/faker";

export const mockFiles: FileI[] = [
  {
    id: 1,
    originalFileName: "product-image.jpg",
    gcsFileName: "files/product-image-12345.jpg",
    publicUrl: faker.image.avatar(),
    contentType: "image/jpeg",
    size: 1024000, // 1MB
    bucketName: "my-bucket",
    fileType: FileType.IMAGE,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 2,
    originalFileName: "proposal.pdf",
    gcsFileName: "files/proposal-67890.pdf",
    publicUrl: "https://storage.googleapis.com/bucket/files/proposal-67890.pdf",
    contentType: "application/pdf",
    size: 2048000, // 2MB
    bucketName: "my-bucket",
    fileType: FileType.DOCUMENT,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 3,
    originalFileName: "product-demo.mp4",
    gcsFileName: "files/product-demo-24680.mp4",
    publicUrl:
      "https://storage.googleapis.com/bucket/files/product-demo-24680.mp4",
    contentType: "video/mp4",
    size: 15728640, // 15MB
    bucketName: "my-bucket",
    fileType: FileType.VIDEO,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 4,
    originalFileName: "screenshot.png",
    gcsFileName: "files/screenshot-13579.png",
    publicUrl: faker.image.avatar(),
    contentType: "image/png",
    size: 512000, // 500KB
    bucketName: "my-bucket",
    fileType: FileType.IMAGE,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];
