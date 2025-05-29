import { queryClient } from "@/lib/queryClient";
import { useMutation } from "@tanstack/react-query";
import { ResponseBody } from "@/types";
import { EmailList, EmailRecordRequestBody } from "@/features/emails/types";
import { createEmailApiFunc } from "@/api/email";
import { QUERY_KEYS } from "@/constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";

export const formSchema = z.object({
  subject: z.string().min(5, "Subject is required"),
  body: z.string().min(5, "Body is required"),
  scheduledTime: z.number().min(0, "Scheduled time must be a positive number"),
  additionalData: z.object({
    internshipLink: z
      .string()
      .url("Invalid URL")
      .optional()
      .transform((val) => (val === "" ? undefined : val)),
    coverLetterLink: z
      .string()
      .url("Invalid URL")
      .optional()
      .transform((val) => (val === "" ? undefined : val)),
    resumeLink: z
      .string()
      .url("Invalid URL")
      .optional()
      .transform((val) => (val === "" ? undefined : val)),
  }),
  attachmentIds: z.array(z.number()),
  contactIds: z.array(z.number()).min(1, "At least one Contact is required"),
});

export const useCreateEmailRecords = () => {
  const initialValues = {
    subject: "",
    body: "",
    scheduledTime: 0,
    additionalData: {},
    attachmentIds: [],
    contactIds: [],
  };

  const emailFormData = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues,
  });

  const requestCreateEmailRecords = useMutation<
    ResponseBody<EmailList>,
    Error,
    EmailRecordRequestBody
  >({
    mutationFn: async (body) => createEmailApiFunc(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.EMAILS] });
      emailFormData.reset();
    },
    onError: (error: Error) => {
      console.error(error);
    },
  });

  return { emailFormData, requestCreateEmailRecords };
};
