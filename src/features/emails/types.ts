export interface EmailRecordRequestBody {
  subject: string;
  body: string;
  scheduledTime: number;
  contactIds: number[];
  attachmentIds: number[];
  additionalData: {
    internshipLink?: string;
    resumeLink?: string;
    coverLetterLink?: string;
  };
}

export interface Attachment {
  id: number;
  originalFilename: string;
  gcsFilename?: string;
  publicUrl: string;
  contentType: string;
  size: number;
  bucketName?: string;
  fileType: string;
  createdAt: string;
  updatedAt: string;
}

export interface EmailRecord {
  id: number;
  subject: string;
  body: string;
  scheduledTime: number;
  status: string;
  attachmentsList: Attachment[];
  createdAt: string;
  updatedAt: string;
}

export type EmailList = EmailRecord[];
