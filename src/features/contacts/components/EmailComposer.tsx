import React, { useState, useRef, useEffect } from "react";
import { EmailTemplate, PlaceHolders } from "@/features/emails/templates/types";
import { mockTemplates } from "@/mock/templates.mock";
import { Button } from "@/components/ui/button";
import { Send, X } from "lucide-react";
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
  const [emailFormData, setEmailFormData] = useState({
    subject: "",
    body: "",
  });
  const [templates, setTemplates] = useState<EmailTemplate[]>(mockTemplates);

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

  // Handle subject input with placeholder detection
  const handleSubjectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setEmailFormData((prev) => ({
      ...prev,
      subject: value,
    }));

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

  // Handle body input with placeholder detection
  const handleBodyChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target;
    setEmailFormData((prev) => ({
      ...prev,
      body: value,
    }));

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
    const field =
      placeholderField === "subject"
        ? emailFormData.subject
        : emailFormData.body;
    const newValue =
      field.slice(0, cursorPosition - 2) +
      placeholder +
      field.slice(cursorPosition);

    if (placeholderField === "subject") {
      setEmailFormData((prev) => ({
        ...prev,
        subject: newValue,
      }));
      setTimeout(() => {
        if (subjectRef.current) {
          subjectRef.current.focus();
          const newCursorPos = cursorPosition - 2 + placeholder.length;
          subjectRef.current.setSelectionRange(newCursorPos, newCursorPos);
        }
      }, 0);
    } else {
      setEmailFormData((prev) => ({
        ...prev,
        body: newValue,
      }));
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

  // Close placeholder menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setShowPlaceholders(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle template selection
  const handleTemplateChange = (templateId: string) => {
    setSelectedTemplateId(templateId);

    if (templateId) {
      const selectedTemplate = templates.find(
        (template) => template.id === templateId,
      );
      if (selectedTemplate) {
        setEmailFormData({
          subject: selectedTemplate.subject,
          body: selectedTemplate.body,
        });
      }
    }
  };

  const handleSendEmail = () => {
    console.log("Sending email to contacts:", checkedContacts);
    console.log("Email data:", emailFormData);
    // Here you would implement the actual email sending logic
    alert("Email would be sent to " + checkedContacts.length + " contacts");
  };

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
              <SelectItem key={template.id} value={template.id}>
                {template.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4 flex-1 flex flex-col">
        <div className="relative">
          <Label htmlFor="subject">Subject</Label>
          <Input
            id="subject"
            name="subject"
            ref={subjectRef}
            value={emailFormData.subject}
            onChange={handleSubjectChange}
            placeholder="Enter email subject"
            className="w-full"
          />

          {/* Placeholder dropdown for subject */}
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

        <div className="flex-1 relative">
          <Label htmlFor="body">Message</Label>
          <div className="text-xs text-muted-foreground mb-1">
            type something like &#123;&#123;firstName&#125;&#125; to see
            available placeholders
          </div>
          <Textarea
            id="body"
            name="body"
            ref={bodyRef}
            value={emailFormData.body}
            onChange={handleBodyChange}
            placeholder="Write your message here..."
            className="w-full h-[calc(100%-28px)]"
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

        <Button onClick={handleSendEmail} className="mt-auto">
          <Send className="mr-2 h-4 w-4" />
          Send Email
        </Button>
      </div>
    </div>
  );
};

export default EmailComposer;
