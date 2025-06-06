import axios from "@/lib/axios";
import {
  ContactList,
  ContactRequestBody,
  ContactI,
} from "@/features/contacts/types";
import { ResponseBody } from "@/types";

export const getContactsApiFunc = async (): Promise<
  ResponseBody<ContactList>
> => {
  const response = await axios.get("/contact/user-contacts");
  return response.data;
};

export const createContactApiFunc = async (
  contact: ContactRequestBody,
): Promise<ResponseBody<ContactI>> => {
  const response = await axios.post("/contact", contact);
  return response.data;
};

export const updateContactApiFunc = async (
  contact: ContactI,
): Promise<ResponseBody<ContactI>> => {
  const response = await axios.put(`/contact/${contact.id}`, contact);
  return response.data;
};

export const deleteContactApiFunc = async (
  id: number,
): Promise<ResponseBody<void>> => {
  const response = await axios.delete(`/contact/${id}`);
  return response.data;
};
