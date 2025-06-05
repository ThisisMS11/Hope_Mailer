"use client";
import React, { useState, useEffect } from "react";
import ContactCard from "@/features/contacts/components/ContactCard";
import FilterBox from "@/features/contacts/components/FilterBox";
import { mockContacts } from "@/mock/contacts.mock";
import { ContactI, ContactList, FilterI } from "@/features/contacts/types";
import { FilterTypeEnum } from "@/enums/enums";
import EmailComposer from "@/features/emails/components/EmailComposer";
import useGetContacts from "@/features/contacts/hooks/useGetContacts";

const ContactsPage = () => {
  const { data: contactsData, isLoading, isError, error } = useGetContacts();

  const [filters, setFilters] = useState<FilterI>({
    [FilterTypeEnum.POSITION_TYPE]: [],
    [FilterTypeEnum.COMPANY_NAME]: [],
    isValid: true,
  });
  const [checkedContacts, setCheckedContacts] = useState<number[]>([]);
  const [isEmailPanelOpen, setIsEmailPanelOpen] = useState(false);
  const [mainContentWidth, setMainContentWidth] = useState("100%");
  const [filteredContacts, setFilteredContacts] = useState<ContactList>([]);

  useEffect(() => {
    // Adjust the main content width when an email panel opens/closes
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

  // Initialize filtered contacts when data is loaded
  useEffect(() => {
    if (contactsData && contactsData?.data) {
      setFilteredContacts(contactsData.data);
    }
  }, [contactsData]);

  // Get recipient information for display
  const selectedContactsInfo = filteredContacts.filter((contact) =>
    checkedContacts.includes(contact.id),
  );

  if (isError) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-red-500 text-lg font-medium mb-2">
            Oops! Something went wrong
          </p>
          <p className="text-gray-600 dark:text-gray-400">
            {error?.message || "Failed to load contacts"}
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

  return (
    <div className="flex max-h-screen">
      {/* Main content - will resize when an email panel opens */}
      <section
        className="flex flex-col transition-all duration-300 ease-in-out overflow-y-auto invisible-scrollbar"
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
        <div className="flex-1 ">
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
        <section className="w-[35%] overflow-y-auto border-l border-gray-200 bg-white dark:bg-gray-800 p-4 flex flex-col invisible-scrollbar">
          <EmailComposer
            checkedContacts={checkedContacts}
            selectedContactsInfo={selectedContactsInfo}
            setIsEmailPanelOpen={setIsEmailPanelOpen}
          />
        </section>
      )}
    </div>
  );
};

export default ContactsPage;
