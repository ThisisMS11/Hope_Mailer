import { useQuery } from "@tanstack/react-query";
import { ResponseBody } from "@/types";
import { CompanyList } from "@/features/contacts/types";
import { QUERY_KEYS } from "@/constants";
import { getCompaniesApiFunc } from "@/api/companies";

export default function useGetCompanies() {
  return useQuery<ResponseBody<CompanyList>, Error>({
    queryKey: [QUERY_KEYS.COMPANIES],
    queryFn: getCompaniesApiFunc,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
    retry: 3,
  });
}
