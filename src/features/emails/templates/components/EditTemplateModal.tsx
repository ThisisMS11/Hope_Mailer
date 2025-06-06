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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, Save } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import useEmailTemplatesMutations, {
  emailTemplateFormSchema,
} from "@/features/emails/templates/hooks/useEmailTemplatesMutations";
import {
  EmailTemplateI,
  PlaceHolders,
} from "@/features/emails/templates/types";

interface EditTemplateModalProps {
  isEditModalOpen: boolean;
  setIsEditModalOpen: (__open: boolean) => void;
  editEmailTemplateFormData: UseFormReturn<
    {
      name: string;
      subject: string;
      body: string;
    },
    any,
    {
      name: string;
      subject: string;
      body: string;
    }
  >;
  closeEditModal: () => void;
  editingTemplate: EmailTemplateI | null;
}

const EditTemplateModal: React.FC<EditTemplateModalProps> = ({
  isEditModalOpen,
  setIsEditModalOpen,
  editEmailTemplateFormData,
  editingTemplate,
  closeEditModal,
}) => {
  const { requestUpdateEmailTemplate } = useEmailTemplatesMutations();
  const editSubjectRef = useRef<HTMLInputElement>(null);
  const editBodyRef = useRef<HTMLTextAreaElement>(null);
  const [showEditPlaceholders, setShowEditPlaceholders] = useState(false);
  const [editPlaceholderField, setEditPlaceholderField] = useState<
    "subject" | "body" | null
  >(null);

  const [editCursorPosition, setEditCursorPosition] = useState<number | null>(
    null,
  );

  const placeholders = Object.values(PlaceHolders);
  const handleUpdateEmailTemplate = (
    values: z.infer<typeof emailTemplateFormSchema>,
  ) => {
    if (editingTemplate) {
      const updateData = {
        ...values,
        id: editingTemplate.id,
        createdAt: editingTemplate.createdAt,
        updatedAt: editingTemplate.updatedAt,
      };
      requestUpdateEmailTemplate.mutate(updateData);
      console.log("Updating template:", updateData);
      closeEditModal();
    }
  };

  const handleEditInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: "subject" | "body",
  ) => {
    const value = e.target.value;
    const lastTwoChars = value.slice(-2);
    if (lastTwoChars === "{{") {
      setShowEditPlaceholders(true);
      setEditPlaceholderField(field);
      setEditCursorPosition(e.target.selectionStart);
    } else {
      setShowEditPlaceholders(false);
    }
  };

  // Handle selecting a placeholder for an edit form
  const handleSelectEditPlaceholder = (placeholder: string) => {
    if (!editPlaceholderField || editCursorPosition === null) return;

    const currentValue =
      editEmailTemplateFormData.getValues(editPlaceholderField);
    const newValue =
      currentValue.slice(0, editCursorPosition - 2) +
      placeholder +
      currentValue.slice(editCursorPosition);

    editEmailTemplateFormData.setValue(editPlaceholderField, newValue);

    setTimeout(() => {
      const ref =
        editPlaceholderField === "subject" ? editSubjectRef : editBodyRef;
      if (ref.current) {
        ref.current.focus();
        const newCursorPos = editCursorPosition - 2 + placeholder.length;
        ref.current.setSelectionRange(newCursorPos, newCursorPos);
      }
    }, 0);

    setShowEditPlaceholders(false);
  };

  useEffect(() => {
    const handleClickOutside = () => {
      setShowEditPlaceholders(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Template</DialogTitle>
        </DialogHeader>

        <Form {...editEmailTemplateFormData}>
          <form
            onSubmit={editEmailTemplateFormData.handleSubmit(
              handleUpdateEmailTemplate,
            )}
            className="space-y-4"
          >
            <FormField
              name={"name"}
              control={editEmailTemplateFormData.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Template Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="e.g. Welcome Email"
                      required
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name={"subject"}
              control={editEmailTemplateFormData.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subject</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        {...field}
                        ref={editSubjectRef}
                        placeholder="e.g. Welcome to our platform!"
                        onChange={(e) => {
                          field.onChange(e.target.value);
                          handleEditInputChange(e, "subject");
                        }}
                        required
                      />
                      {showEditPlaceholders &&
                        editPlaceholderField === "subject" && (
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
                                    e.preventDefault();
                                    handleSelectEditPlaceholder(placeholder);
                                  }}
                                >
                                  {placeholder}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name={"body"}
              control={editEmailTemplateFormData.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Body</FormLabel>
                  <div className="text-xs text-muted-foreground mb-1">
                    type something like &#123;&#123;firstName&#125;&#125; to see
                    available placeholders
                  </div>
                  <FormControl>
                    <div className="relative">
                      <Textarea
                        {...field}
                        ref={editBodyRef}
                        placeholder="Dear {{firstName}},&#10;&#10;Welcome to our platform..."
                        onChange={(e) => {
                          field.onChange(e.target.value);
                          handleEditInputChange(e, "body");
                        }}
                        className="min-h-[200px]"
                        required
                      />
                      {showEditPlaceholders &&
                        editPlaceholderField === "body" && (
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
                                    e.preventDefault();
                                    handleSelectEditPlaceholder(placeholder);
                                  }}
                                >
                                  {placeholder}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={closeEditModal}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={requestUpdateEmailTemplate.isPending}
              >
                {requestUpdateEmailTemplate.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Updating Template
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Update Template
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

export default EditTemplateModal;
