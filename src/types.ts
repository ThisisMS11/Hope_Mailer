export interface ResponseBody<T> {
  success: boolean;
  message: string;
  data?: T;
}
