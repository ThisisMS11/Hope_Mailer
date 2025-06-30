import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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

  // Refs for input fields (add form)
  const subjectRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLTextAreaElement>(null);

  // Placeholder suggestion state for an added form
  const [showPlaceholders, setShowPlaceholders] = useState(false);
  const [placeholderField, setPlaceholderField] = useState<
    "subject" | "body" | null
  >(null);
  const [cursorPosition, setCursorPosition] = useState<number | null>(null);

  const placeholders = Object.values(PlaceHolders);

  const handleAddEmailTemplate = (
    values: z.infer<typeof emailTemplateFormSchema>,
  ) => {
    requestCreateEmailTemplate.mutate(values);
    console.log("Adding template:", values);
  };

  // Handle input change for an add form
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: "subject" | "body",
  ) => {
    const value = e.target.value;
    const lastTwoChars = value.slice(-2);
    if (lastTwoChars === "{{") {
      setShowPlaceholders(true);
      setPlaceholderField(field);
      setCursorPosition(e.target.selectionStart);
    } else {
      setShowPlaceholders(false);
    }
  };

  // Handle selecting a placeholder for add form
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

  const resetAddForm = () => {
    emailTemplateFormData.reset();
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

  return (
    <Card className="lg:col-span-1">
      <CardHeader>
        <CardTitle>Add New Template</CardTitle>
        <CardDescription>
          Create a new email template to use later
        </CardDescription>
      </CardHeader>

      <Form {...emailTemplateFormData}>
        <form
          onSubmit={emailTemplateFormData.handleSubmit(handleAddEmailTemplate)}
        >
          <CardContent className="space-y-4">
            <FormField
              name={"name"}
              control={emailTemplateFormData.control}
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
              control={emailTemplateFormData.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subject</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        {...field}
                        ref={subjectRef}
                        placeholder="e.g. Welcome to our platform!"
                        onChange={(e) => {
                          field.onChange(e.target.value);
                          handleInputChange(e, "subject");
                        }}
                        required
                      />
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
                                  e.preventDefault();
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
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name={"body"}
              control={emailTemplateFormData.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Body</FormLabel>
                  <div className="text-xs text-muted-foreground mb-1">
                    type something like &#123;&#123;firstName&#125;&#125; to see
                    available placeholders
                  </div>
                  <FormControl>
                    <div className="relative">
                      <Tabs defaultValue="body">
                        <TabsList>
                          <TabsTrigger value="body">Body</TabsTrigger>
                          <TabsTrigger value="preview">Preview</TabsTrigger>
                        </TabsList>

                        <TabsContent value="body">
                          <Textarea
                            {...field}
                            ref={bodyRef}
                            placeholder="Dear {{firstName}},&#10;&#10;Welcome to our platform..."
                            onChange={(e) => {
                              field.onChange(e.target.value);
                              handleInputChange(e, "body");
                            }}
                            className="min-h-[200px]"
                            required
                          />
                        </TabsContent>

                        <TabsContent value="preview">
                          <div
                            className={"w-full border rounded-lg p-4 space-y-4"}
                          >
                            <div className="space-y-2">
                              <Label className="text-sm font-medium">
                                Subject:
                              </Label>
                              <div className="text-base pl-2 border-l-2 text-sm">
                                {emailTemplateFormData.getValues("subject")}
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label className="text-sm font-medium">
                                Body:
                              </Label>
                              <div
                                className="prose max-w-none pl-2 border-l-2 max-h-48 text-sm invisible-scrollbar overflow-y-scroll"
                                dangerouslySetInnerHTML={{
                                  __html:
                                    emailTemplateFormData.getValues("body"),
                                }}
                              />
                            </div>
                          </div>
                        </TabsContent>
                      </Tabs>

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
                                  e.preventDefault();
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
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>

          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={resetAddForm}>
              <X className="h-4 w-4 mr-2" />
              Clear
            </Button>
            <Button
              type="submit"
              disabled={requestCreateEmailTemplate.isPending}
            >
              {requestCreateEmailTemplate.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Adding Template
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Template
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

export default CreateTemplateForm;
