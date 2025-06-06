import { FilterTypeEnum, GenderEnum, PositionTypeEnum } from "@/enums/enums";

export interface ContactRequestBody {
  firstName: string;
  lastName: string;
  gender: GenderEnum;
  mobile: string;
  linkedIn: string;
  email: string;
  position: string;
  positionType: PositionTypeEnum;
  experience: number;
  valid: boolean;
  companyId: number;
}

export interface ContactI extends ContactRequestBody {
  id: number;
  companyName: string;
  logo: string;
}

export interface FilterI {
  [FilterTypeEnum.POSITION_TYPE]: string[];
  [FilterTypeEnum.COMPANY_NAME]: string[];
  [FilterTypeEnum.IS_VALID]: boolean;
}

export type ContactList = ContactI[];

/* COMPANY TYPES */
export interface CompanyRequestBody {
  name: string;
  domain: string;
  logo: string;
}

export interface CompanyI extends CompanyRequestBody {
  id: number;
  createdAt: string;
  updatedAt: string;
}

export type CompanyList = CompanyI[];
