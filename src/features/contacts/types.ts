export interface ContactI {
  id: number;
  firstName: string;
  lastName: string;
  gender: "MALE" | "FEMALE" | "UNKNOWN";
  mobile: string;
  linkedIn: string;
  email: string;
  position: string;
  positionType: "TALENT" | "ENGINEERING" | "MANAGER" | "HEAD" | "OTHERS";
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
