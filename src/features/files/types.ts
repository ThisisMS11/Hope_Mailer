export enum FileType {
  IMAGE,
  VIDEO,
  DOCUMENT,
  UNKNOWN,
}
export interface FileI {
  id: number;
  originalFileName: string;
  gcsFileName: string;
  publicUrl: string;
  contentType: string;
  size: number;
  bucketName: string;
  fileType: FileType;
  createdAt: string;
  updatedAt: string;
}
