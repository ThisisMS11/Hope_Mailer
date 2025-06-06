import { useMutation } from "@tanstack/react-query";
import { CompanyI, CompanyRequestBody } from "@/features/contacts/types";
import { queryClient } from "@/lib/queryClient";
import { QUERY_KEYS } from "@/constants";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useCustomToast from "@/hooks/useCustomToast";
import { ResponseBody } from "@/types";
import { createCompanyApiFunc, updateCompanyApiFunc } from "@/api/companies";

export const companyFormSchema = z.object({
  name: z.string().min(1, " name is required"),
  domain: z.string().min(1, "domain is required"),
  logo: z.string().url("Must be a valid LinkedIn URL"),
});

const useCompanyMutations = () => {
  const { showErrorToast, showSuccessToast } = useCustomToast();

  const companyFormData = useForm<z.infer<typeof companyFormSchema>>({
    resolver: zodResolver(companyFormSchema),
    defaultValues: {
      name: "",
      domain: "",
      logo: "",
    },
  });

  const requestCreateCompany = useMutation<
    ResponseBody<CompanyI>,
    Error,
    CompanyRequestBody
  >({
    mutationFn: async (body) => createCompanyApiFunc(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.COMPANIES] });
      companyFormData.reset();
      showSuccessToast("Company created successfully");
    },
    onError: (error: Error) => {
      showErrorToast(error.message);
    },
  });

  const requestUpdateCompany = useMutation<
    ResponseBody<CompanyI>,
    Error,
    CompanyI
  >({
    mutationFn: async (body) => updateCompanyApiFunc(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.COMPANIES] });
      companyFormData.reset();
      showSuccessToast("Company updated successfully");
    },
    onError: (error: Error) => {
      console.error(error);
      showErrorToast(error.message);
    },
  });

  return {
    companyFormData,
    requestCreateCompany,
    requestUpdateCompany,
  };
};

export default useCompanyMutations;
