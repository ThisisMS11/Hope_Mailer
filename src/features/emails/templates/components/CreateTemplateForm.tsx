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
import { Loader2, Plus, X } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import useEmailTemplatesMutations, {
  emailTemplateFormSchema,
} from "@/features/emails/templates/hooks/useEmailTemplatesMutations";
import { z } from "zod";
import { PlaceHolders } from "@/features/emails/templates/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";

const CreateTemplateForm = () => {
  const { emailTemplateFormData, requestCreateEmailTemplate } =
    useEmailTemplatesMutations();

  const subjectRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLTextAreaElement>(null);

  const [showPlaceholders, setShowPlaceholders] = useState(false);
  const [placeholderField, setPlaceholderField] = useState<"subject" | "body" | null>(null);
  const [cursorPosition, setCursorPosition] = useState<number | null>(null);

  const placeholders = Object.values(PlaceHolders);

  const handleAddEmailTemplate = (values: z.infer<typeof emailTemplateFormSchema>) => {
    requestCreateEmailTemplate.mutate(values);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: "subject" | "body",
  ) => {
    const value = e.target.value;
    const cursorPos = e.target.selectionStart ?? value.length;
    const lastTwoChars = value.slice(0, cursorPos).slice(-2);
    if (lastTwoChars === "{{") {
      setShowPlaceholders(true);
      setPlaceholderField(field);
      setCursorPosition(cursorPos);
    } else {
      setShowPlaceholders(false);
    }
  };

  const handleSelectPlaceholder = (placeholder: string) => {
    if (!placeholderField || cursorPosition === null) return;
    const currentValue = emailTemplateFormData.getValues(placeholderField);
    const newValue =
      currentValue.slice(0, cursorPosition - 2) +
      placeholder +
      currentValue.slice(cursorPosition);
    emailTemplateFormData.setValue(placeholderField, newValue);
    setTimeout(() => {
      const ref = placeholderField === "subject" ? subjectRef : bodyRef;
      if (ref.current) {
        ref.current.focus();
        const newCursorPos = cursorPosition - 2 + placeholder.length;
        ref.current.setSelectionRange(newCursorPos, newCursorPos);
      }
    }, 0);
    setShowPlaceholders(false);
  };

  useEffect(() => {
    const handleClickOutside = () => setShowPlaceholders(false);
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="lg:col-span-1 bg-white/50 backdrop-blur-md border border-white/70 dark:bg-white/[0.04] dark:border-white/[0.08] shadow-xl shadow-black/[0.06] dark:shadow-black/25 rounded-2xl overflow-hidden flex flex-col">
      {/* Header */}
      <div className="px-5 py-4 border-b border-gray-100/60 dark:border-white/[0.06]">
        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">New Template</p>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Create a reusable email template</p>
      </div>

      <Form {...emailTemplateFormData}>
        <form
          onSubmit={emailTemplateFormData.handleSubmit(handleAddEmailTemplate)}
          className="flex flex-col flex-1"
        >
          <div className="p-5 space-y-4 flex-1">
            <FormField
              name="name"
              control={emailTemplateFormData.control}
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
              control={emailTemplateFormData.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-medium text-gray-600 dark:text-gray-400">Subject</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        {...field}
                        ref={subjectRef}
                        placeholder="e.g. Opportunity at {{companyName}}"
                        className="bg-white/50 dark:bg-white/[0.04] border-white/70 dark:border-white/[0.08] text-sm"
                        onChange={(e) => {
                          field.onChange(e.target.value);
                          handleInputChange(e, "subject");
                        }}
                      />
                      {showPlaceholders && placeholderField === "subject" && (
                        <div className="absolute z-50 top-full mt-1 w-full max-h-52 overflow-auto bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border border-white/70 dark:border-white/[0.1] rounded-xl shadow-xl shadow-black/10 dark:shadow-black/30">
                          <div className="px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-600 border-b border-gray-100/60 dark:border-white/[0.06]">
                            Select placeholder
                          </div>
                          <div className="p-1">
                            {placeholders.map((p, i) => (
                              <div
                                key={i}
                                className="px-3 py-1.5 text-sm rounded-lg text-gray-700 dark:text-gray-300 hover:bg-violet-500/10 dark:hover:bg-violet-400/10 hover:text-violet-700 dark:hover:text-violet-300 cursor-pointer transition-colors"
                                onMouseDown={(e) => { e.preventDefault(); handleSelectPlaceholder(p); }}
                              >
                                {p}
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
              name="body"
              control={emailTemplateFormData.control}
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
                            ref={bodyRef}
                            placeholder={"Dear {{firstName}},\n\nI wanted to reach out..."}
                            onChange={(e) => { field.onChange(e.target.value); handleInputChange(e, "body"); }}
                            className="min-h-[180px] bg-white/50 dark:bg-white/[0.04] border-white/70 dark:border-white/[0.08] text-sm resize-none"
                          />
                        </TabsContent>

                        <TabsContent value="preview">
                          <div className="rounded-xl bg-gray-50/80 dark:bg-white/[0.02] border border-gray-100 dark:border-white/[0.06] p-4 space-y-3 min-h-[180px]">
                            <div className="space-y-1">
                              <Label className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-600">Subject</Label>
                              <div className="text-sm pl-3 border-l-2 border-violet-400/40 text-gray-700 dark:text-gray-300">
                                {emailTemplateFormData.getValues("subject") || <span className="text-gray-300 dark:text-gray-700">No subject</span>}
                              </div>
                            </div>
                            <div className="space-y-1">
                              <Label className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-600">Body</Label>
                              <div
                                className="prose prose-sm max-w-none pl-3 border-l-2 border-violet-400/40 max-h-40 text-sm invisible-scrollbar overflow-y-auto text-gray-700 dark:text-gray-300"
                                dangerouslySetInnerHTML={{ __html: emailTemplateFormData.getValues("body") }}
                              />
                            </div>
                          </div>
                        </TabsContent>
                      </Tabs>

                      {showPlaceholders && placeholderField === "body" && (
                        <div className="absolute z-50 top-full mt-1 w-full max-h-52 overflow-auto bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border border-white/70 dark:border-white/[0.1] rounded-xl shadow-xl shadow-black/10 dark:shadow-black/30">
                          <div className="px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-600 border-b border-gray-100/60 dark:border-white/[0.06]">
                            Select placeholder
                          </div>
                          <div className="p-1">
                            {placeholders.map((p, i) => (
                              <div
                                key={i}
                                className="px-3 py-1.5 text-sm rounded-lg text-gray-700 dark:text-gray-300 hover:bg-violet-500/10 dark:hover:bg-violet-400/10 hover:text-violet-700 dark:hover:text-violet-300 cursor-pointer transition-colors"
                                onMouseDown={(e) => { e.preventDefault(); handleSelectPlaceholder(p); }}
                              >
                                {p}
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
          </div>

          {/* Footer */}
          <div className="px-5 py-4 border-t border-gray-100/60 dark:border-white/[0.06] flex justify-between gap-3">
            <button
              type="button"
              onClick={() => emailTemplateFormData.reset()}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100/70 dark:hover:bg-white/[0.06] transition-all"
            >
              <X className="h-3.5 w-3.5" /> Clear
            </button>
            <Button
              type="submit"
              disabled={requestCreateEmailTemplate.isPending}
              className="bg-violet-500/90 hover:bg-violet-600/90 dark:bg-violet-500/25 dark:hover:bg-violet-500/35 dark:text-violet-300 text-white border border-violet-400/30 dark:border-violet-400/20 shadow-md shadow-violet-500/10 text-sm"
            >
              {requestCreateEmailTemplate.isPending ? (
                <><Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" /> Saving...</>
              ) : (
                <><Plus className="h-3.5 w-3.5 mr-1.5" /> Add Template</>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CreateTemplateForm;
