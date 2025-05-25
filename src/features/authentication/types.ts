export interface LoginRequest {
  email: string;
  password: string;
}

export interface UserInfo {
  id: number;
  username: string;
  email: string;
  roles: string[];
}
