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
import { Pencil, Plus, Save, Trash2, X } from "lucide-react";
import { EmailTemplate, PlaceHolders } from "@/features/emails/templates/types";
import { mockTemplates } from "@/mock/templates.mock";

const TemplatesPanel = () => {
  const [templateName, setTemplateName] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [currentTemplateId, setCurrentTemplateId] = useState<string | null>(
    null,
  );

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

  // Mock templates data (replace with actual API calls later)
  const [templates, setTemplates] = useState<EmailTemplate[]>(mockTemplates);

  // Handle subject input
  const handleSubjectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSubject(value);

    // Check if we just typed {{
    const lastTwoChars = value.slice(-2);
    if (lastTwoChars === "{{") {
      setShowPlaceholders(true);
      setPlaceholderField("subject");
      setCursorPosition(e.target.selectionStart);
    } else {
      setShowPlaceholders(false);
    }
  };

  // Handle body input
  const handleBodyChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setBody(value);

    // Check if we just typed {{
    const lastTwoChars = value.slice(-2);
    if (lastTwoChars === "{{") {
      setShowPlaceholders(true);
      setPlaceholderField("body");
      setCursorPosition(e.target.selectionStart);
    } else {
      setShowPlaceholders(false);
    }
  };

  // Handle selecting a placeholder
  const handleSelectPlaceholder = (placeholder: string) => {
    if (!placeholderField || cursorPosition === null) return;

    // Remove the {{ that triggered the menu
    const field = placeholderField === "subject" ? subject : body;
    const newValue =
      field.slice(0, cursorPosition - 2) +
      placeholder +
      field.slice(cursorPosition);

    if (placeholderField === "subject") {
      setSubject(newValue);
      setTimeout(() => {
        if (subjectRef.current) {
          subjectRef.current.focus();
          const newCursorPos = cursorPosition - 2 + placeholder.length;
          subjectRef.current.setSelectionRange(newCursorPos, newCursorPos);
        }
      }, 0);
    } else {
      setBody(newValue);
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

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!templateName || !subject || !body) {
      alert("Please fill all fields");
      return;
    }

    if (isEditing && currentTemplateId) {
      // Update existing template
      const updatedTemplates = templates.map((template) =>
        template.id === currentTemplateId
          ? {
              ...template,
              name: templateName,
              subject: subject,
              body: body,
              updatedAt: new Date(),
            }
          : template,
      );
      setTemplates(updatedTemplates);
    } else {
      // Add new template
      const newTemplate: EmailTemplate = {
        id: Date.now().toString(),
        name: templateName,
        subject: subject,
        body: body,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setTemplates([...templates, newTemplate]);
    }

    // Reset form
    resetForm();
  };

  // Function to reset form fields
  const resetForm = () => {
    setTemplateName("");
    setSubject("");
    setBody("");
    setIsEditing(false);
    setCurrentTemplateId(null);
  };

  // Function to edit a template
  const editTemplate = (template: EmailTemplate) => {
    setTemplateName(template.name);
    setSubject(template.subject);
    setBody(template.body);
    setIsEditing(true);
    setCurrentTemplateId(template.id);
  };

  // Function to delete a template
  const deleteTemplate = (id: string) => {
    if (confirm("Are you sure you want to delete this template?")) {
      setTemplates(templates.filter((template) => template.id !== id));
    }
  };

  // Format date for display
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <div>
      {/* heading - fixed height */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Email Templates</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Template Form Card */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>
              {isEditing ? "Edit Template" : "Add New Template"}
            </CardTitle>
            <CardDescription>
              {isEditing
                ? "Update your email template details"
                : "Create a new email template to use later"}
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Template Name
                </label>
                <Input
                  id="name"
                  placeholder="e.g. Welcome Email"
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2 relative">
                <label htmlFor="subject" className="text-sm font-medium">
                  Email Subject
                </label>
                <Input
                  id="subject"
                  ref={subjectRef}
                  placeholder="e.g. Welcome to our platform!"
                  value={subject}
                  onChange={handleSubjectChange}
                  required
                />

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

              <div className="space-y-2 relative">
                <label htmlFor="body" className="text-sm font-medium">
                  Email Body
                </label>

                <div className="text-xs text-muted-foreground mb-1">
                  type something like &#123;&#123;firstName&#125;&#125; to see
                  available placeholders
                </div>
                <Textarea
                  id="body"
                  ref={bodyRef}
                  placeholder="Dear {{firstName}},&#10;&#10;Welcome to our platform..."
                  value={body}
                  onChange={handleBodyChange}
                  className="min-h-[200px]"
                  required
                />

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
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" type="button" onClick={resetForm}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button type="submit">
                {isEditing ? (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Update Template
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
                                <div className="space-y-4">
                                  <div>
                                    <h3 className="text-lg font-semibold">
                                      {template.name}
                                    </h3>
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
                              onClick={() => editTemplate(template)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>

                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteTemplate(template.id)}
                              className="text-destructive hover:text-destructive/90"
                            >
                              <Trash2 className="h-4 w-4" />
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
    </div>
  );
};

export default TemplatesPanel;
