import { LoginRequest } from "@/features/authentication/types";
import axios from "@/lib/axios";
import { ResponseBody } from "@/types";
import { UserInfo } from "@/features/authentication/types";

export const loginApiFunc = async (
  loginRequest: LoginRequest,
): Promise<ResponseBody<UserInfo>> => {
  const response = await axios.post("/public/login", loginRequest);
  return response.data;
};

export const getUserInfoApiFunc = async (): Promise<ResponseBody<UserInfo>> => {
  const response = await axios.get("/user");
  return response.data;
};

export const logoutApiFunc = async (): Promise<ResponseBody<null>> => {
  const response = await axios.get("/user/logout");
  return response.data;
};
