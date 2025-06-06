import { useMutation } from "@tanstack/react-query";
import { ContactI, ContactRequestBody } from "@/features/contacts/types";
import { queryClient } from "@/lib/queryClient";
import { QUERY_KEYS } from "@/constants";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useCustomToast from "@/hooks/useCustomToast";
import { GenderEnum, PositionTypeEnum } from "@/enums/enums";
import { ResponseBody } from "@/types";
import {
  deleteContactApiFunc,
  updateContactApiFunc,
  createContactApiFunc,
} from "@/api/contact";

export const contactFormSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  gender: z.nativeEnum(GenderEnum),
  mobile: z.string().min(1, "Mobile is required"),
  linkedIn: z.string().url("Must be a valid LinkedIn URL"),
  email: z.string().email("Must be a valid email"),
  position: z.string().min(1, "Position is required"),
  positionType: z.nativeEnum(PositionTypeEnum),
  experience: z.number().min(0),
  valid: z.boolean(),
  companyId: z.number().min(1, "Company is required"),
});

const useContactMutations = () => {
  const { showErrorToast, showSuccessToast } = useCustomToast();

  const contactFormData = useForm<z.infer<typeof contactFormSchema>>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      gender: GenderEnum.MALE,
      mobile: "",
      linkedIn: "",
      email: "",
      position: "",
      positionType: PositionTypeEnum.OTHERS,
      experience: 0,
      valid: true,
      companyId: 0,
    },
  });

  const requestCreateContact = useMutation<
    ResponseBody<ContactI>,
    Error,
    ContactRequestBody
  >({
    mutationFn: async (body) => createContactApiFunc(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CONTACTS] });
      contactFormData.reset();
      showSuccessToast("Contact created successfully");
    },
    onError: (error: Error) => {
      showErrorToast(error.message);
    },
  });

  const requestUpdateContact = useMutation<
    ResponseBody<ContactI>,
    Error,
    ContactI
  >({
    mutationFn: async (body) => updateContactApiFunc(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CONTACTS] });
      contactFormData.reset();
      showSuccessToast("Contact updated successfully");
    },
    onError: (error: Error) => {
      console.error(error);
      showErrorToast(error.message);
    },
  });

  const requestDeleteContact = useMutation<ResponseBody<void>, Error, number>({
    mutationFn: async (body) => deleteContactApiFunc(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CONTACTS] });
      contactFormData.reset();
      showSuccessToast("Contact deleted successfully");
    },
    onError: (error: Error) => {
      console.error(error);
      showErrorToast(error.message);
    },
  });

  return {
    contactFormData,
    requestCreateContact,
    requestUpdateContact,
    requestDeleteContact,
  };
};

export default useContactMutations;
