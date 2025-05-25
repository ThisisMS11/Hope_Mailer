import {FilterTypeEnum, GenderEnum, PositionTypeEnum} from "@/enums/enums";

export interface ContactI {
  id: number;
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
  companyName: string;
  logo: string;
}

export interface CompanyResponseI {
  id: number;
  name: string;
  logo: string;
}


export interface FilterI {
  [FilterTypeEnum.POSITION_TYPE]: string[];
  [FilterTypeEnum.COMPANY_NAME]: string[];
  [FilterTypeEnum.IS_VALID] : boolean;
}