import { useQuery } from "@tanstack/react-query";
import { ResponseBody } from "@/types";
import { QUERY_KEYS } from "@/constants";
import { getEmailTemplates } from "@/api/emailTemplates";
import { EmailTemplateList } from "@/features/emails/templates/types";

const useEmailTemplates = () => {
  return useQuery<ResponseBody<EmailTemplateList>, Error>({
    queryKey: [QUERY_KEYS.EMAIL_TEMPLATES],
    queryFn: getEmailTemplates,
    staleTime: 0,
    retry: false,
    refetchOnWindowFocus: false,
  });
};

export default useEmailTemplates;
