import axios from "@/lib/axios";
import { EmailRecordRequestBody, EmailList } from "@/features/emails/types";
import { ResponseBody } from "@/types";

export const createEmailApiFunc = async (
  emailRecordRequestBody: EmailRecordRequestBody,
): Promise<ResponseBody<EmailList>> => {
  const response = await axios.post("/emails-records", emailRecordRequestBody);
  return response.data;
};

export const getEmailRecordsApiFunc = async (): Promise<
  ResponseBody<EmailList>
> => {
  const response = await axios.get("/emails-records");
  return response.data;
};

// ! TODO : https://chat.deepseek.com/a/chat/s/c1b71ed7-098f-4d7d-8db7-41187357efbc
