import {
  EmailTemplateI,
  EmailTemplateList,
  EmailTemplateRequestBody,
} from "@/features/emails/templates/types";
import axios from "@/lib/axios";
import { ResponseBody } from "@/types";

export const getEmailTemplates = async (): Promise<
  ResponseBody<EmailTemplateList>
> => {
  const response = await axios.get("/email-templates/user-email-templates");
  return response.data;
};

export const getEmailTemplateById = async (
  id: string,
): Promise<ResponseBody<EmailTemplateI>> => {
  const response = await axios.get(`/email-templates/${id}`);
  return response.data;
};

export const createEmailTemplate = async (
  template: EmailTemplateRequestBody,
): Promise<ResponseBody<EmailTemplateI>> => {
  const response = await axios.post("/email-templates", template);
  return response.data;
};

export const updateEmailTemplate = async (
  template: EmailTemplateI,
): Promise<ResponseBody<EmailTemplateI>> => {
  const response = await axios.put(`/email-templates/${template.id}`, template);
  return response.data;
};

export const deleteEmailTemplate = async (
  id: number,
): Promise<ResponseBody<void>> => {
  const response = await axios.delete(`/email-templates/${id}`);
  return response.data;
};
