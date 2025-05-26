"use client";
import React, { useState, useEffect } from "react";
import ContactCard from "@/features/contacts/components/ContactCard";
import FilterBox from "@/features/contacts/components/FilterBox";
import { mockContacts } from "@/mock/contacts.mock";
import { ContactI, FilterI } from "@/features/contacts/types";
import { FilterTypeEnum } from "@/enums/enums";
import { Button } from "@/components/ui/button";
import { X, Send } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const ContactsPage = () => {
  const [filteredContacts, setFilteredContacts] =
    useState<ContactI[]>(mockContacts);
  const [filters, setFilters] = useState<FilterI>({
    [FilterTypeEnum.POSITION_TYPE]: [],
    [FilterTypeEnum.COMPANY_NAME]: [],
    isValid: true,
  });
  const [checkedContacts, setCheckedContacts] = useState<number[]>([]);
  const [isEmailPanelOpen, setIsEmailPanelOpen] = useState(false);
  const [emailFormData, setEmailFormData] = useState({
    subject: "",
    body: "",
    cc: "",
    bcc: "",
  });
  const [mainContentWidth, setMainContentWidth] = useState("100%");

  useEffect(() => {
    // Adjust the main content width when email panel opens/closes
    setMainContentWidth(isEmailPanelOpen ? "65%" : "100%");
  }, [isEmailPanelOpen]);

  const handleContactCheck = (contactId: number, isChecked: boolean) => {
    if (isChecked) {
      setCheckedContacts((prev) => [...prev, contactId]);
    } else {
      setCheckedContacts((prev) => prev.filter((id) => id !== contactId));
    }
  };

  const ApplyFilters = () => {
    console.log(filters);
    const filtered = mockContacts.filter(
      (contact) =>
        (!filters?.[FilterTypeEnum.POSITION_TYPE]?.length ||
          filters[FilterTypeEnum.POSITION_TYPE].includes(
            contact.positionType,
          )) &&
        (!filters?.[FilterTypeEnum.COMPANY_NAME]?.length ||
          filters[FilterTypeEnum.COMPANY_NAME].includes(contact.companyName)),
    );
    console.log(filtered);
    setFilteredContacts(filtered);
  };

  const printCheckedContactIds = () => {
    console.log("Selected Contact IDs:", checkedContacts);
    setIsEmailPanelOpen(true);
  };

  const closeEmailPanel = () => {
    setIsEmailPanelOpen(false);
  };

  const handleEmailFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setEmailFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSendEmail = () => {
    console.log("Sending email to contacts:", checkedContacts);
    console.log("Email data:", emailFormData);
    // Here you would implement the actual email sending logic
    alert("Email would be sent to " + checkedContacts.length + " contacts");
  };

  // Get recipient information for display
  const selectedContactsInfo = filteredContacts.filter((contact) =>
    checkedContacts.includes(contact.id),
  );

  return (
    <div className="flex h-full">
      {/* Main content - will resize when email panel opens */}
      <section
        className="flex flex-col h-full transition-all duration-300 ease-in-out"
        style={{ width: mainContentWidth }}
      >
        {/* heading - fixed height */}
        <h1 className="text-2xl font-semibold py-2">Contacts</h1>

        {/* filters - fixed height */}
        <div className="flex flex-row justify-between items-center gap-4 py-2 mb-4">
          <FilterBox
            applyFilters={ApplyFilters}
            setFilters={setFilters}
            startMailing={printCheckedContactIds}
            checkedContacts={checkedContacts}
          />
        </div>

        {/* people profiles - takes remaining height with scroll */}
        <div className="flex-1 overflow-y-auto">
          <div
            className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 ${isEmailPanelOpen ? "xl:grid-cols-3" : "xl:grid-cols-4"} gap-6 pb-4`}
          >
            {filteredContacts.map((contact: ContactI) => (
              <ContactCard
                key={contact.id}
                contact={contact}
                isChecked={checkedContacts.includes(contact.id)}
                onCheckChange={handleContactCheck}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Email composition panel - right side */}
      {isEmailPanelOpen && (
        <section className="w-[35%] max-h-screen border-l border-gray-200 bg-white dark:bg-gray-800 p-4 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Compose Email</h2>
            <Button variant="ghost" size="icon" onClick={closeEmailPanel}>
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

          <div className="space-y-4 flex-1 flex flex-col">
            <div>
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                name="subject"
                value={emailFormData.subject}
                onChange={handleEmailFormChange}
                placeholder="Enter email subject"
                className="w-full"
              />
            </div>

            <div className="flex-1">
              <Label htmlFor="body">Message</Label>
              <Textarea
                id="body"
                name="body"
                value={emailFormData.body}
                onChange={handleEmailFormChange}
                placeholder="Write your message here..."
                className="w-full h-[calc(100%-28px)]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="cc">CC</Label>
                <Input
                  id="cc"
                  name="cc"
                  value={emailFormData.cc}
                  onChange={handleEmailFormChange}
                  placeholder="CC recipients"
                />
              </div>
              <div>
                <Label htmlFor="bcc">BCC</Label>
                <Input
                  id="bcc"
                  name="bcc"
                  value={emailFormData.bcc}
                  onChange={handleEmailFormChange}
                  placeholder="BCC recipients"
                />
              </div>
            </div>

            <Button onClick={handleSendEmail} className="mt-auto">
              <Send className="mr-2 h-4 w-4" />
              Send Email
            </Button>
          </div>
        </section>
      )}
    </div>
  );
};

export default ContactsPage;
