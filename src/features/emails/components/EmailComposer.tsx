"use client";
import React, { useEffect, useRef, useState } from "react";
import {
  EmailTemplateI,
  PlaceHolders,
} from "@/features/emails/templates/types";
// import { mockTemplates } from "@/mock/templates.mock";
import { Button } from "@/components/ui/button";
import { Send, X, CircleCheck } from "lucide-react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ContactI } from "@/features/contacts/types";
import {
  formSchema,
  useCreateEmailRecords,
} from "@/features/emails/hooks/useCreateEmailRecords";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { DateTimePicker } from "@/features/emails/components/DateTimePicker";
import useCustomToast from "@/hooks/useCustomToast";
import useEmailTemplates from "@/features/emails/templates/hooks/useEmailTemplates";

interface EmailComposerProps {
  checkedContacts: number[];
  selectedContactsInfo: ContactI[];
  setIsEmailPanelOpen: any;
}

const EmailComposer: React.FC<EmailComposerProps> = ({
  checkedContacts,
  selectedContactsInfo,
  setIsEmailPanelOpen,
}) => {
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("");

  const [requiredLinks, setRequiredLinks] = useState({
    internshipLink: false,
    resumeLink: false,
    coverLetterLink: false,
  });

  const {
    data: emailTemplates,
    isError,
    isLoading,
    error,
  } = useEmailTemplates();

  const [templates, setTemplates] = useState<EmailTemplateI[]>([]);
  const { emailFormData, requestCreateEmailRecords } = useCreateEmailRecords();
  const { showErrorToast } = useCustomToast();

  // Placeholder suggestion state
  const [showPlaceholders, setShowPlaceholders] = useState(false);
  const [placeholderField, setPlaceholderField] = useState<
    "subject" | "body" | null
  >(null);
  const [cursorPosition, setCursorPosition] = useState<number | null>(null);

  // Refs for input fields
  const subjectRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLTextAreaElement>(null);

  // Available placeholders from enum
  const placeholders = Object.values(PlaceHolders);

  // Check if a placeholder exists in the text
  const checkForPlaceholder = (text: string, placeholder: PlaceHolders) => {
    return text.includes(placeholder);
  };

  // Update required links based on current content
  const updateRequiredLinks = (subject: string, body: string) => {
    setRequiredLinks({
      internshipLink:
        checkForPlaceholder(subject, PlaceHolders.INTERNSHIP_LINK) ||
        checkForPlaceholder(body, PlaceHolders.INTERNSHIP_LINK),
      resumeLink:
        checkForPlaceholder(subject, PlaceHolders.RESUME_LINK) ||
        checkForPlaceholder(body, PlaceHolders.RESUME_LINK),
      coverLetterLink:
        checkForPlaceholder(subject, PlaceHolders.COVER_LETTER_LINK) ||
        checkForPlaceholder(body, PlaceHolders.COVER_LETTER_LINK),
    });
  };

  // Handle subject input with placeholder detection
  const handleSubjectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    // Check if we just typed {{
    const lastTwoChars = value.slice(-2);
    if (lastTwoChars === "{{") {
      setShowPlaceholders(true);
      setPlaceholderField("subject");
      setCursorPosition(e.target.selectionStart);
    } else {
      setShowPlaceholders(false);
    }

    // Update required links based on current content
    updateRequiredLinks(value, emailFormData.getValues("body"));
  };

  // Handle body input with placeholder detection
  const handleBodyChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target;
    emailFormData.setValue("body", value);

    // Check if we just typed {{
    const lastTwoChars = value.slice(-2);
    if (lastTwoChars === "{{") {
      setShowPlaceholders(true);
      setPlaceholderField("body");
      setCursorPosition(e.target.selectionStart);
    } else {
      setShowPlaceholders(false);
    }
    // Update required links based on current content
    updateRequiredLinks(emailFormData.getValues("body"), value);
    updateRequiredLinks(emailFormData.getValues("subject"), value);
  };

  // Handle selecting a placeholder
  const handleSelectPlaceholder = (placeholder: string) => {
    if (!placeholderField || cursorPosition === null) return;

    // Remove the {{ that triggered the menu
    const field =
      placeholderField === "subject"
        ? emailFormData.getValues("subject")
        : emailFormData.getValues("body");
    const newValue =
      field.slice(0, cursorPosition - 2) +
      placeholder +
      field.slice(cursorPosition);

    // Check if the placeholder is a link type and update required links
    if (placeholder === PlaceHolders.INTERNSHIP_LINK) {
      setRequiredLinks((prev) => ({ ...prev, internshipLink: true }));
    } else if (placeholder === PlaceHolders.RESUME_LINK) {
      setRequiredLinks((prev) => ({ ...prev, resumeLink: true }));
    } else if (placeholder === PlaceHolders.COVER_LETTER_LINK) {
      setRequiredLinks((prev) => ({ ...prev, coverLetterLink: true }));
    }

    if (placeholderField === "subject") {
      emailFormData.setValue("subject", newValue);
      setTimeout(() => {
        if (subjectRef.current) {
          subjectRef.current.focus();
          const newCursorPos = cursorPosition - 2 + placeholder.length;
          subjectRef.current.setSelectionRange(newCursorPos, newCursorPos);
        }
      }, 0);
    } else {
      emailFormData.setValue("body", newValue);
      setTimeout(() => {
        if (bodyRef.current) {
          bodyRef.current.focus();
          const newCursorPos = cursorPosition - 2 + placeholder.length;
          bodyRef.current.setSelectionRange(newCursorPos, newCursorPos);
        }
      }, 0);
    }
    setShowPlaceholders(false);
  };

  // Handle link input changes
  const handleLinkChange = (
    type: "internshipLink" | "resumeLink" | "coverLetterLink" | "jobRole",
    value: string,
  ) => {
    emailFormData.setValue(`additionalData.${type}`, value);
  };

  // Close the placeholder menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setShowPlaceholders(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    emailFormData.setValue("contactIds", checkedContacts);
    if (!emailFormData.getValues("scheduledTime")) {
      emailFormData.setValue("scheduledTime", Date.now());
    }
  }, [checkedContacts, emailFormData]);

  useEffect(() => {
    if (emailTemplates && emailTemplates.data) {
      setTemplates(emailTemplates.data);
    }
  }, [emailTemplates]);

  // Handle template selection
  const handleTemplateChange = (templateId: string) => {
    setSelectedTemplateId(templateId);

    if (templateId) {
      const selectedTemplate = templates.find(
        (template) => String(template.id) === templateId,
      );
      if (selectedTemplate) {
        // Update form data with the selected template
        emailFormData.setValue("subject", selectedTemplate.subject);
        emailFormData.setValue("body", selectedTemplate.body);
        // Update required links when the template changes
        updateRequiredLinks(selectedTemplate.subject, selectedTemplate.body);
      }
    }
  };

  useEffect(() => {
    console.log("Form errors:", emailFormData.formState.errors);
    const errors = emailFormData.formState.errors;
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
  }, [emailFormData.formState.errors]);

  const handleSendEmail = async (values: z.infer<typeof formSchema>) => {
    if (
      requiredLinks.internshipLink ||
      requiredLinks.resumeLink ||
      requiredLinks.coverLetterLink
    ) {
      if (
        !values.additionalData.internshipLink &&
        requiredLinks.internshipLink
      ) {
        showErrorToast("Internship link is required.");
        return;
      }
      if (!values.additionalData.resumeLink && requiredLinks.resumeLink) {
        showErrorToast("Resume link is required.");
        return;
      }
      if (
        !values.additionalData.coverLetterLink &&
        requiredLinks.coverLetterLink
      ) {
        showErrorToast("Cover letter link is required.");
        return;
      }
    }

    console.log("Form submitted with values:", values);
    requestCreateEmailRecords.mutate(values);
  };

  // TODO : Put this login in custom hook
  useEffect(() => {
    if (requestCreateEmailRecords.isSuccess) {
      emailFormData.reset();
      setSelectedTemplateId("");
      setRequiredLinks({
        internshipLink: false,
        resumeLink: false,
        coverLetterLink: false,
      });

      setTimeout(() => {
        setIsEmailPanelOpen(false);
      }, 2000);
    }
  }, [requestCreateEmailRecords.isSuccess]);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Compose Email</h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            setIsEmailPanelOpen(false);
          }}
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      <div className="mb-4">
        <Label htmlFor="recipients">To:</Label>
        <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-md text-sm max-h-20 overflow-y-auto">
          {selectedContactsInfo.map((contact) => (
            <div key={contact.id} className="flex items-center gap-2 mb-1">
              <span className="font-medium">
                {contact.firstName} {contact.lastName}
              </span>
              <span className="text-gray-500">({contact.email})</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <Label>Templates</Label>
        <Select onValueChange={handleTemplateChange} value={selectedTemplateId}>
          <SelectTrigger>
            <SelectValue placeholder="Choose a template" />
          </SelectTrigger>
          <SelectContent>
            {templates.map((template) => (
              <SelectItem key={template.id} value={String(template.id)}>
                {template.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Form {...emailFormData}>
        <form
          onSubmit={emailFormData.handleSubmit(handleSendEmail)}
          className="space-y-4 flex-1 flex flex-col"
        >
          <FormField
            name={"subject"}
            control={emailFormData.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subject</FormLabel>
                <div className="relative">
                  <FormControl>
                    <Input
                      {...field}
                      ref={subjectRef}
                      placeholder="Enter email subject"
                      onChange={(e) => {
                        field.onChange(e);
                        handleSubjectChange(e);
                      }}
                    />
                  </FormControl>
                  {/* Placeholder dropdown for a subject */}
                  {showPlaceholders && placeholderField === "subject" && (
                    <div className="absolute z-50 mt-1 w-full max-h-60 overflow-auto bg-popover border border-border rounded-md shadow-md">
                      <div className="p-2 text-xs font-semibold border-b">
                        Select a placeholder:
                      </div>
                      <div className="p-1">
                        {placeholders.map((placeholder, index) => (
                          <div
                            key={index}
                            className="px-2 py-1.5 text-sm rounded-sm hover:bg-accent cursor-pointer"
                            onMouseDown={(e) => {
                              e.preventDefault(); // Prevent focus loss
                              handleSelectPlaceholder(placeholder);
                            }}
                          >
                            {placeholder}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Scheduled time */}
          <DateTimePicker
            name="scheduledTime"
            control={emailFormData.control}
            label="Schedule Email For"
          />

          <FormField
            name={"body"}
            control={emailFormData.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Body</FormLabel>
                <div className="relative">
                  <FormControl>
                    <Textarea
                      {...field}
                      ref={bodyRef}
                      placeholder="Write your message here..."
                      onChange={(e) => {
                        field.onChange(e);
                        handleBodyChange(e);
                      }}
                      className="h-[200px]"
                    />
                  </FormControl>
                  {/* Placeholder dropdown for body */}
                  {showPlaceholders && placeholderField === "body" && (
                    <div className="absolute z-50 mt-1 w-full max-h-60 overflow-auto bg-popover border border-border rounded-md shadow-md">
                      <div className="p-2 text-xs font-semibold border-b">
                        Select a placeholder:
                      </div>
                      <div className="p-1">
                        {placeholders.map((placeholder, index) => (
                          <div
                            key={index}
                            className="px-2 py-1.5 text-sm rounded-sm hover:bg-accent cursor-pointer"
                            onMouseDown={(e) => {
                              e.preventDefault(); // Prevent focus loss
                              handleSelectPlaceholder(placeholder);
                            }}
                          >
                            {placeholder}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <div>
            {/* Dynamic Link Inputs */}
            {(requiredLinks.internshipLink ||
              requiredLinks.resumeLink ||
              requiredLinks.coverLetterLink) && (
              <div className="space-y-3 p-4 border rounded-md bg-muted/50">
                <h3 className="text-sm font-medium">Required Links</h3>

                {requiredLinks.internshipLink && (
                  <>
                    <FormField
                      name={"additionalData.internshipLink"}
                      control={emailFormData.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Internship Link</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              id="internshipLink"
                              placeholder="Enter internship posting link"
                              onChange={(e) =>
                                handleLinkChange(
                                  "internshipLink",
                                  e.target.value,
                                )
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      name={"additionalData.jobRole"}
                      control={emailFormData.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Job Role</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              id="jobRole"
                              placeholder="Enter job role"
                              onChange={(e) =>
                                handleLinkChange("jobRole", e.target.value)
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}

                {requiredLinks.coverLetterLink && (
                  <div className="space-y-2">
                    <FormField
                      name={"additionalData.coverLetterLink"}
                      control={emailFormData.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cover Letter Link</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              id="coverLetterLink"
                              placeholder="Enter cover letter link"
                              onChange={(e) =>
                                handleLinkChange(
                                  "coverLetterLink",
                                  e.target.value,
                                )
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                {requiredLinks.resumeLink && (
                  <div className="space-y-2">
                    <FormField
                      name={"additionalData.resumeLink"}
                      control={emailFormData.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Resume Link</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              id="resumeLink"
                              placeholder="Enter resume link"
                              onChange={(e) =>
                                handleLinkChange("resumeLink", e.target.value)
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
          <Button
            type="submit"
            className="mt-auto"
            disabled={requestCreateEmailRecords.isPending}
          >
            {requestCreateEmailRecords.isPending ? (
              <>
                <span className="animate-spin mr-2">⏳</span>
                Sending...
              </>
            ) : requestCreateEmailRecords.isError ? (
              <>
                <X className="mr-2 h-4 w-4" />
                Failed to Send
              </>
            ) : requestCreateEmailRecords.isSuccess ? (
              <>
                <CircleCheck className="mr-2 h-4 w-4 text-green-300" />
                Sent Successfully
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Send Email
              </>
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default EmailComposer;
