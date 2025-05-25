import axios from "axios";

const api = axios.create({
  baseURL:
    process.env.NODE_ENV === "development"
      ? process.env.NEXT_PUBLIC_BACKEND_URL_LOCAL
      : process.env.NEXT_PUBLIC_BACKEND_URL_REMOTE,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export default api;
