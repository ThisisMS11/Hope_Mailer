import { useMutation } from "@tanstack/react-query";
import {
  createEmailTemplate,
  deleteEmailTemplate,
  updateEmailTemplate,
} from "@/api/emailTemplates";
import {
  EmailTemplateI,
  EmailTemplateRequestBody,
} from "@/features/emails/templates/types";
import { queryClient } from "@/lib/queryClient";
import { QUERY_KEYS } from "@/constants";
import { z } from "zod";
import { ResponseBody } from "@/types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useCustomToast from "@/hooks/useCustomToast";

export const emailTemplateFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  subject: z.string().min(1, "Subject is required"),
  body: z.string().min(1, "Body is required"),
});

const useEmailTemplatesMutations = () => {
  const emailTemplateFormData = useForm<
    z.infer<typeof emailTemplateFormSchema>
  >({
    resolver: zodResolver(emailTemplateFormSchema),
    defaultValues: {
      name: "",
      subject: "",
      body: "",
    },
  });
  const { showErrorToast, showSuccessToast } = useCustomToast();

  const requestCreateEmailTemplate = useMutation<
    ResponseBody<EmailTemplateI>,
    Error,
    EmailTemplateRequestBody
  >({
    mutationFn: async (body) => createEmailTemplate(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.EMAIL_TEMPLATES] });
      emailTemplateFormData.reset();
      showSuccessToast("Email template created successfully");
    },
    onError: (error: Error) => {
      console.error(error);
      showErrorToast(error.message);
    },
  });

  const requestUpdateEmailTemplate = useMutation<
    ResponseBody<EmailTemplateI>,
    Error,
    EmailTemplateI
  >({
    mutationFn: async (body) => updateEmailTemplate(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.EMAIL_TEMPLATES] });
      emailTemplateFormData.reset();
      showSuccessToast("Email template updated successfully");
    },
    onError: (error: Error) => {
      console.error(error);
      showErrorToast(error.message);
    },
  });

  const requestDeleteEmailTemplate = useMutation<
    ResponseBody<void>,
    Error,
    number
  >({
    mutationFn: async (body) => deleteEmailTemplate(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.EMAIL_TEMPLATES] });
      emailTemplateFormData.reset();
      showSuccessToast("Email template deleted successfully");
    },
    onError: (error: Error) => {
      console.error(error);
      showErrorToast(error.message);
    },
  });

  return {
    emailTemplateFormData,
    requestCreateEmailTemplate,
    requestUpdateEmailTemplate,
    requestDeleteEmailTemplate,
  };
};

export default useEmailTemplatesMutations;
