import React, { useState, useRef, useEffect } from "react";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Textarea,
} from "@/imports/Shadcn_imports";
import { Loader2, Pencil, Plus, Save, Trash2, X } from "lucide-react";
import {
  EmailTemplateI,
  PlaceHolders,
} from "@/features/emails/templates/types";
import useEmailTemplates from "@/features/emails/templates/hooks/useEmailTemplates";
import useEmailTemplatesMutations, {
  emailTemplateFormSchema,
} from "@/features/emails/templates/hooks/useEmailTemplatesMutations";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { formatDate } from "@/utils/UtilFunctions";

const TemplatesPanel = () => {
  // Add form state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<EmailTemplateI | null>(
    null,
  );

  // Placeholder suggestion state for add form
  const [showPlaceholders, setShowPlaceholders] = useState(false);
  const [placeholderField, setPlaceholderField] = useState<
    "subject" | "body" | null
  >(null);
  const [cursorPosition, setCursorPosition] = useState<number | null>(null);

  // Placeholder suggestion state for edit form
  const [showEditPlaceholders, setShowEditPlaceholders] = useState(false);
  const [editPlaceholderField, setEditPlaceholderField] = useState<
    "subject" | "body" | null
  >(null);
  const [editCursorPosition, setEditCursorPosition] = useState<number | null>(
    null,
  );

  // Refs for input fields (add form)
  const subjectRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLTextAreaElement>(null);

  // Refs for input fields (edit form)
  const editSubjectRef = useRef<HTMLInputElement>(null);
  const editBodyRef = useRef<HTMLTextAreaElement>(null);

  // Available placeholders from enum
  const placeholders = Object.values(PlaceHolders);

  const {
    data: emailTemplates,
    isError,
    isLoading,
    error,
  } = useEmailTemplates();

  const {
    emailTemplateFormData,
    requestCreateEmailTemplate,
    requestUpdateEmailTemplate,
    requestDeleteEmailTemplate,
  } = useEmailTemplatesMutations();

  // Create a separate form for editing
  const { emailTemplateFormData: editEmailTemplateFormData } =
    useEmailTemplatesMutations();

  const [templates, setTemplates] = useState<EmailTemplateI[]>([]);

  // Handle input change for add form
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

  // Handle input change for edit form
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

  // Handle selecting a placeholder for edit form
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

  // Close the placeholder menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setShowPlaceholders(false);
      setShowEditPlaceholders(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const resetAddForm = () => {
    emailTemplateFormData.reset();
  };

  const openEditModal = (template: EmailTemplateI) => {
    setEditingTemplate(template);
    editEmailTemplateFormData.reset();
    editEmailTemplateFormData.setValue("name", template.name);
    editEmailTemplateFormData.setValue("subject", template.subject);
    editEmailTemplateFormData.setValue("body", template.body);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditingTemplate(null);
    editEmailTemplateFormData.reset();
  };

  // Function to delete a template
  const deleteTemplate = (id: number) => {
    if (confirm("Are you sure you want to delete this template?")) {
      setTemplates(templates.filter((template) => template.id != id));
      requestDeleteEmailTemplate.mutate(id);
    }
  };

  // Handle adding new template
  const handleAddEmailTemplate = (
    values: z.infer<typeof emailTemplateFormSchema>,
  ) => {
    requestCreateEmailTemplate.mutate(values);
    console.log("Adding template:", values);
  };

  // Handle updating template
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

  useEffect(() => {
    if (emailTemplates && emailTemplates.data) {
      setTemplates(emailTemplates.data);
    }
  }, [emailTemplates, requestCreateEmailTemplate]);

  if (isError) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-red-500 text-lg font-medium mb-2">
            Oops! Something went wrong
          </p>
          <p className="text-gray-600 dark:text-gray-400">
            {error?.message || "Failed to load templates"}
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">Loading...</div>
    );
  }

  // TODO : MAKE THIS COMPONENT MODULAR
  return (
    <div>
      {/* heading - fixed height */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Email Templates</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Add Template Form Card */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Add New Template</CardTitle>
            <CardDescription>
              Create a new email template to use later
            </CardDescription>
          </CardHeader>

          <Form {...emailTemplateFormData}>
            <form
              onSubmit={emailTemplateFormData.handleSubmit(
                handleAddEmailTemplate,
              )}
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
                          {showPlaceholders &&
                            placeholderField === "subject" && (
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
                        type something like &#123;&#123;firstName&#125;&#125; to
                        see available placeholders
                      </div>
                      <FormControl>
                        <div className="relative">
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

        {/* Templates Table Card */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Your Templates</CardTitle>
            <CardDescription>Manage your email templates</CardDescription>
          </CardHeader>
          <CardContent>
            {templates.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground">
                No templates yet. Create your first template.
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Last Updated</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {templates.map((template) => (
                      <TableRow key={template.id}>
                        <TableCell className="font-medium">
                          {template.name}
                        </TableCell>
                        <TableCell className="max-w-[200px] truncate">
                          {template.subject}
                        </TableCell>
                        <TableCell>{formatDate(template.updatedAt)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  View
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-md">
                                <DialogHeader>
                                  <DialogTitle>{template.name}</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div>
                                    <p className="text-sm text-muted-foreground">
                                      Created: {formatDate(template.createdAt)}
                                    </p>
                                  </div>
                                  <div className="space-y-1">
                                    <h4 className="font-medium">Subject</h4>
                                    <p>{template.subject}</p>
                                  </div>
                                  <div className="space-y-1">
                                    <h4 className="font-medium">Body</h4>
                                    <div className="border rounded-md p-3 whitespace-pre-wrap">
                                      {template.body}
                                    </div>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>

                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openEditModal(template)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>

                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteTemplate(template.id)}
                              className="text-destructive hover:text-destructive/90"
                              disabled={requestDeleteEmailTemplate.isPending}
                            >
                              {requestDeleteEmailTemplate.isPending ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Edit Template Modal */}
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
                      type something like &#123;&#123;firstName&#125;&#125; to
                      see available placeholders
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
                <Button
                  type="button"
                  variant="outline"
                  onClick={closeEditModal}
                >
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
    </div>
  );
};

export default TemplatesPanel;
