"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CircleCheck, Loader2, Save } from "lucide-react";
import { GenderEnum, PositionTypeEnum } from "@/enums/enums";
import useContactMutations from "../hooks/useContactMutations";
import AddEmployeeCompany from "@/features/contacts/components/AddEmployeeCompany";
import React, { useEffect } from "react";
import useCustomToast from "@/hooks/useCustomToast";

interface CreateContactModalProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const CreateContactModal = ({ isOpen, setIsOpen }: CreateContactModalProps) => {
  const { contactFormData, requestCreateContact } =
    useContactMutations(setIsOpen);
  const { showErrorToast } = useCustomToast();

  const handleCreateContact = (values: any) => {
    requestCreateContact.mutate(values);
    // setIsOpen(false);
  };

  useEffect(() => {
    console.log("Form errors:", contactFormData.formState.errors);
    const errors = contactFormData.formState.errors;
    if (Object.keys(errors).length > 0) {
      Object.entries(errors).forEach(([field, error]) => {
        if (
          error &&
          typeof error.message === "string" &&
          !["subject", "body"].includes(field)
        ) {
          showErrorToast(`${field}: ${error.message}`);
        }
      });
      return;
    }
  }, [contactFormData.formState.errors]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create New Contact</DialogTitle>
        </DialogHeader>

        <Form {...contactFormData}>
          <form
            onSubmit={contactFormData.handleSubmit(handleCreateContact)}
            className="space-y-4 grid grid-cols-2 gap-4"
          >
            <FormField
              name="firstName"
              control={contactFormData.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="lastName"
              control={contactFormData.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="gender"
              control={contactFormData.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gender</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(GenderEnum).map((gender) => (
                        <SelectItem key={gender} value={gender}>
                          {gender.charAt(0).toUpperCase() +
                            gender.slice(1).toLowerCase()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="mobile"
              control={contactFormData.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mobile No.</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <Input type="tel" placeholder="+1234567890" {...field} />
                    </FormControl>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={contactFormData.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="example@domain.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={contactFormData.control}
              name="linkedIn"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>LinkedIn</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://www.linkedin.com/in/mohitsaini11/"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={contactFormData.control}
              name="position"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Position</FormLabel>
                  <FormControl>
                    <Input placeholder="Software Engineer" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={contactFormData.control}
              name="positionType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Position Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(PositionTypeEnum).map((gender) => (
                        <SelectItem key={gender} value={gender}>
                          {gender.charAt(0).toUpperCase() +
                            gender.slice(1).toLowerCase()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={contactFormData.control}
              name="experience"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Experience (Years)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={contactFormData.control}
              name="companyId"
              render={() => (
                <FormItem>
                  <FormLabel>Select Company</FormLabel>
                  <FormControl>
                    <AddEmployeeCompany contactFormData={contactFormData} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Add the remaining fields similarly */}

            <div className="col-span-2 flex justify-end gap-3 pt-4">
              <Button
                type="submit"
                variant="outline"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                className="mt-auto"
                disabled={requestCreateContact.isPending}
              >
                {requestCreateContact.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : requestCreateContact.isSuccess ? (
                  <>
                    <CircleCheck className="mr-2 h-4 w-4 text-green-300" />
                    Contact Created
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Add Contact
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateContactModal;
