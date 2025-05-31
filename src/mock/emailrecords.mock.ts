import { EmailList } from "@/features/emails/types";
export const mockEmailRecords: EmailList = [
  {
    id: 1,
    subject: "Interview Invitation - Software Developer Position",
    body: "Dear Candidate,\n\nWe are pleased to invite you for an interview for the Software Developer position...",
    scheduledTime: Date.now() + 86400000, // Tomorrow
    status: "scheduled",
    attachmentsList: [
      {
        id: 1,
        originalFilename: "job_description.pdf",
        publicUrl: "https://example.com/job_description.pdf",
        contentType: "application/pdf",
        size: 245000,
        fileType: "pdf",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 2,
    subject: "Welcome to Our Platform",
    body: "Hello,\n\nThank you for joining our platform. We're excited to have you on board...",
    scheduledTime: Date.now() - 172800000, // 2 days ago
    status: "sent",
    attachmentsList: [],
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    updatedAt: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    id: 3,
    subject: "Your Application Status Update",
    body: "Dear Applicant,\n\nWe've reviewed your application and would like to provide you with an update...",
    scheduledTime: Date.now() - 432000000, // 5 days ago
    status: "sent",
    attachmentsList: [
      {
        id: 2,
        originalFilename: "next_steps.docx",
        publicUrl: "https://example.com/next_steps.docx",
        contentType:
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        size: 125000,
        fileType: "docx",
        createdAt: new Date(Date.now() - 432000000).toISOString(),
        updatedAt: new Date(Date.now() - 432000000).toISOString(),
      },
      {
        id: 3,
        originalFilename: "feedback.pdf",
        publicUrl: "https://example.com/feedback.pdf",
        contentType: "application/pdf",
        size: 189000,
        fileType: "pdf",
        createdAt: new Date(Date.now() - 432000000).toISOString(),
        updatedAt: new Date(Date.now() - 432000000).toISOString(),
      },
    ],
    createdAt: new Date(Date.now() - 432000000).toISOString(),
    updatedAt: new Date(Date.now() - 432000000).toISOString(),
  },
  {
    id: 4,
    subject: "Job Opportunity - Senior Developer",
    body: "Hello,\n\nWe have an exciting job opportunity for a Senior Developer position at our company...",
    scheduledTime: Date.now() + 259200000, // 3 days from now
    status: "scheduled",
    attachmentsList: [
      {
        id: 4,
        originalFilename: "senior_dev_job_description.pdf",
        publicUrl: "https://example.com/senior_dev_job_description.pdf",
        contentType: "application/pdf",
        size: 310000,
        fileType: "pdf",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 5,
    subject: "Weekly Newsletter - Tech Updates",
    body: "Dear Subscriber,\n\nHere are this week's top tech news and updates...",
    scheduledTime: Date.now() - 86400000, // Yesterday
    status: "sent",
    attachmentsList: [],
    createdAt: new Date(Date.now() - 90000000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
  },
];
