import { ResponseBody } from "@/types";
import { EmailList } from "../types";
import { useQuery } from "@tanstack/react-query";
import { getEmailRecordsApiFunc } from "@/api/email";
import { QUERY_KEYS } from "@/constants";

export const useEmailRecords = () => {
  return useQuery<ResponseBody<EmailList>, Error>({
    queryKey: [QUERY_KEYS.EMAILS],
    queryFn: () => getEmailRecordsApiFunc(),
    staleTime: 0,
    retry: false,
    refetchOnWindowFocus: false,
  });
};
