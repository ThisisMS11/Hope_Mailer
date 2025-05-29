import axios from "@/lib/axios";
import { ContactList } from "@/features/contacts/types";
import { ResponseBody } from "@/types";

export const getContactsApiFunc = async (): Promise<
  ResponseBody<ContactList>
> => {
  const response = await axios.get("/contact/user-contacts");
  return response.data;
};
