import axios from "@/lib/axios";
import {
  CompanyList,
  CompanyRequestBody,
  CompanyI,
} from "@/features/contacts/types";
import { ResponseBody } from "@/types";

export const getCompaniesApiFunc = async (): Promise<
  ResponseBody<CompanyList>
> => {
  const response = await axios.get("/company");
  const data: ResponseBody<CompanyList> = response.data;
  if (data.data) {
    data.data = data.data.map((company) => ({
      ...company,
      logo: company.logo || (company.domain ? `https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://${company.domain}&size=128` : ""),
    }));
  }
  return data;
};

export const createCompanyApiFunc = async (
  company: CompanyRequestBody,
): Promise<ResponseBody<CompanyI>> => {
  const response = await axios.post("/company", company);
  return response.data;
};

export const updateCompanyApiFunc = async (
  company: CompanyI,
): Promise<ResponseBody<CompanyI>> => {
  const response = await axios.put(`/company/${company.id}`, company);
  return response.data;
};
