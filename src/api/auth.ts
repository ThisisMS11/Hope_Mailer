import { LoginRequest } from "@/features/authentication/types";
import axios from "axios";

export const loginFunc = async (loginRequest: LoginRequest) => {
  return axios.post("/public/login", loginRequest);
};
