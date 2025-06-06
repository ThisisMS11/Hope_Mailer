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
  return response.data;
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
