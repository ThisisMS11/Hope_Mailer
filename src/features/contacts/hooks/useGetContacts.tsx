import { useQuery } from "@tanstack/react-query";
import { getContactsApiFunc } from "@/api/contact";
import { QUERY_KEYS } from "@/constants";
import { ResponseBody } from "@/types";
import { ContactList } from "@/features/contacts/types";

export default function useGetContacts() {
  return useQuery<ResponseBody<ContactList>, Error>({
    queryKey: [QUERY_KEYS.CONTACTS],
    queryFn: getContactsApiFunc,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
    retry: 3,
  });
}
