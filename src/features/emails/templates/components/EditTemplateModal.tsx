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
import { Loader2, Save, X } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import useEmailTemplatesMutations, {
  emailTemplateFormSchema,
} from "@/features/emails/templates/hooks/useEmailTemplatesMutations";
import { EmailTemplateI, PlaceHolders } from "@/features/emails/templates/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";

interface EditTemplateModalProps {
  isEditModalOpen: boolean;
  setIsEditModalOpen: (__open: boolean) => void;
  editEmailTemplateFormData: UseFormReturn<
    { name: string; subject: string; body: string },
    any,
    { name: string; subject: string; body: string }
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
  const [editPlaceholderField, setEditPlaceholderField] = useState<"subject" | "body" | null>(null);
  const [editCursorPosition, setEditCursorPosition] = useState<number | null>(null);

  const placeholders = Object.values(PlaceHolders);

  const handleUpdateEmailTemplate = (values: z.infer<typeof emailTemplateFormSchema>) => {
    if (editingTemplate) {
      requestUpdateEmailTemplate.mutate({
        ...values,
        id: editingTemplate.id,
        createdAt: editingTemplate.createdAt,
        updatedAt: editingTemplate.updatedAt,
      });
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

  const handleSelectEditPlaceholder = (placeholder: string) => {
    if (!editPlaceholderField || editCursorPosition === null) return;
    const currentValue = editEmailTemplateFormData.getValues(editPlaceholderField);
    const newValue =
      currentValue.slice(0, editCursorPosition - 2) +
      placeholder +
      currentValue.slice(editCursorPosition);
    editEmailTemplateFormData.setValue(editPlaceholderField, newValue);
    setTimeout(() => {
      const ref = editPlaceholderField === "subject" ? editSubjectRef : editBodyRef;
      if (ref.current) {
        ref.current.focus();
        const newCursorPos = editCursorPosition - 2 + placeholder.length;
        ref.current.setSelectionRange(newCursorPos, newCursorPos);
      }
    }, 0);
    setShowEditPlaceholders(false);
  };

  useEffect(() => {
    const handleClickOutside = () => setShowEditPlaceholders(false);
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const PlaceholderDropdown = ({ field }: { field: "subject" | "body" }) =>
    showEditPlaceholders && editPlaceholderField === field ? (
      <div className="absolute z-50 top-full mt-1 w-full max-h-52 overflow-auto bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border border-white/70 dark:border-white/[0.1] rounded-xl shadow-xl shadow-black/10 dark:shadow-black/30">
        <div className="px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-600 border-b border-gray-100/60 dark:border-white/[0.06]">
          Select placeholder
        </div>
        <div className="p-1">
          {placeholders.map((p, i) => (
            <div
              key={i}
              className="px-3 py-1.5 text-sm rounded-lg text-gray-700 dark:text-gray-300 hover:bg-violet-500/10 dark:hover:bg-violet-400/10 hover:text-violet-700 dark:hover:text-violet-300 cursor-pointer transition-colors"
              onMouseDown={(e) => { e.preventDefault(); handleSelectEditPlaceholder(p); }}
            >
              {p}
            </div>
          ))}
        </div>
      </div>
    ) : null;

  return (
    <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
      <DialogContent className="sm:max-w-2xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-white/60 dark:border-white/[0.08]">
        <DialogHeader>
          <DialogTitle className="text-base font-semibold text-gray-900 dark:text-gray-100">Edit Template</DialogTitle>
        </DialogHeader>

        <Form {...editEmailTemplateFormData}>
          <form
            onSubmit={editEmailTemplateFormData.handleSubmit(handleUpdateEmailTemplate)}
            className="space-y-4 mt-2"
          >
            <FormField
              name="name"
              control={editEmailTemplateFormData.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-medium text-gray-600 dark:text-gray-400">Template Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="e.g. Cold Outreach"
                      className="bg-white/50 dark:bg-white/[0.04] border-white/70 dark:border-white/[0.08] text-sm"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="subject"
              control={editEmailTemplateFormData.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-medium text-gray-600 dark:text-gray-400">Subject</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        {...field}
                        ref={editSubjectRef}
                        placeholder="e.g. Opportunity at {{companyName}}"
                        className="bg-white/50 dark:bg-white/[0.04] border-white/70 dark:border-white/[0.08] text-sm"
                        onChange={(e) => { field.onChange(e.target.value); handleEditInputChange(e, "subject"); }}
                      />
                      <PlaceholderDropdown field="subject" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="body"
              control={editEmailTemplateFormData.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-medium text-gray-600 dark:text-gray-400">Body</FormLabel>
                  <p className="text-xs text-gray-400 dark:text-gray-600 -mt-1">
                    Type <code className="bg-gray-100 dark:bg-white/[0.06] px-1 rounded text-[10px]">&#123;&#123;</code> to insert a placeholder
                  </p>
                  <FormControl>
                    <div className="relative">
                      <Tabs defaultValue="body">
                        <TabsList className="bg-white/50 dark:bg-white/[0.04] border border-white/60 dark:border-white/[0.08] rounded-xl p-1 h-auto mb-2">
                          <TabsTrigger value="body" className="rounded-lg text-xs data-[state=active]:bg-violet-500/90 data-[state=active]:text-white data-[state=active]:shadow-sm py-1">
                            Write
                          </TabsTrigger>
                          <TabsTrigger value="preview" className="rounded-lg text-xs data-[state=active]:bg-violet-500/90 data-[state=active]:text-white data-[state=active]:shadow-sm py-1">
                            Preview
                          </TabsTrigger>
                        </TabsList>

                        <TabsContent value="body">
                          <Textarea
                            {...field}
                            ref={editBodyRef}
                            placeholder={"Dear {{firstName}},\n\nI wanted to reach out..."}
                            onChange={(e) => { field.onChange(e.target.value); handleEditInputChange(e, "body"); }}
                            className="min-h-[200px] bg-white/50 dark:bg-white/[0.04] border-white/70 dark:border-white/[0.08] text-sm resize-none"
                          />
                        </TabsContent>

                        <TabsContent value="preview">
                          <div className="rounded-xl bg-gray-50/80 dark:bg-white/[0.02] border border-gray-100 dark:border-white/[0.06] p-4 space-y-3 min-h-[200px]">
                            <div className="space-y-1.5">
                              <Label className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-600">Subject</Label>
                              <div className="text-sm pl-3 border-l-2 border-violet-400/40 text-gray-700 dark:text-gray-300">
                                {editEmailTemplateFormData.getValues("subject") || <span className="text-gray-300 dark:text-gray-700">No subject</span>}
                              </div>
                            </div>
                            <div className="space-y-1.5">
                              <Label className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-600">Body</Label>
                              <div
                                className="prose prose-sm max-w-none pl-3 border-l-2 border-violet-400/40 max-h-40 text-sm invisible-scrollbar overflow-y-auto text-gray-700 dark:text-gray-300"
                                dangerouslySetInnerHTML={{ __html: editEmailTemplateFormData.getValues("body") }}
                              />
                            </div>
                          </div>
                        </TabsContent>
                      </Tabs>
                      <PlaceholderDropdown field="body" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 pt-2 border-t border-gray-100 dark:border-white/[0.06]">
              <button
                type="button"
                onClick={closeEditModal}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100/70 dark:hover:bg-white/[0.06] transition-all"
              >
                <X className="h-3.5 w-3.5" /> Cancel
              </button>
              <Button
                type="submit"
                disabled={requestUpdateEmailTemplate.isPending}
                className="bg-violet-500/90 hover:bg-violet-600/90 dark:bg-violet-500/25 dark:hover:bg-violet-500/35 dark:text-violet-300 text-white border border-violet-400/30 dark:border-violet-400/20 shadow-md shadow-violet-500/10 text-sm"
              >
                {requestUpdateEmailTemplate.isPending ? (
                  <><Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" /> Saving...</>
                ) : (
                  <><Save className="h-3.5 w-3.5 mr-1.5" /> Save Changes</>
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
