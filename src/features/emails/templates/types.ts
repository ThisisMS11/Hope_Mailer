export interface EmailTemplateRequestBody {
  name: string;
  subject: string;
  body: string;
}

export interface EmailTemplateI extends EmailTemplateRequestBody {
  id: number;
  createdAt: string;
  updatedAt: string;
}

export enum PlaceHolders {
  CONTACT_FIRST_NAME = "{{firstName}}",
  CONTACT_LAST_NAME = "{{lastName}}",
  CONTACT_POSITION = "{{position}}",
  CONTACT_COMPANY = "{{companyName}}",
  CONTACT_EMAIL = "{{email}}",
  CONTACT_MOBILE = "{{mobile}}",
  CONTACT_LINKEDIN = "{{linkedIn}}",
  CONTACT_GENDER = "{{gender}}",
  CONTACT_EXPERIENCE = "{{experience}}",
  CONTACT_POSITION_TYPE = "{{positionType}}",
  INTERNSHIP_LINK = "{{internshipLink}}",
  RESUME_LINK = "{{resumeLink}}",
  COVER_LETTER_LINK = "{{coverLetterLink}}",
  JOB_ROLE= "{{jobRole}}",
}

export type EmailTemplateList = EmailTemplateI[];
