import React from "react";
import ContactCard from "@/features/contacts/components/ContactCard";
import FilterBox from "@/features/contacts/components/FilterBox";
import { mockContacts } from "@/mock/contacts.mock";
import { ContactI } from "@/features/contacts/types";

const ContactsPage = () => {
  return (
    <section className="flex flex-col h-full">
      {/* heading - fixed height */}
      <h1 className="text-2xl font-semibold py-2">Contacts</h1>

      {/* filters - fixed height */}
      <div className="flex flex-row gap-4 py-2 mb-4">
        <FilterBox />
      </div>

      {/* people profiles - takes remaining height with scroll */}
      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pb-4">
          {mockContacts.map((contact: ContactI) => (
            <ContactCard key={contact.id} contact={contact} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ContactsPage;
