"use client";
import React, {useState} from "react";
import ContactCard from "@/features/contacts/components/ContactCard";
import FilterBox from "@/features/contacts/components/FilterBox";
import {mockContacts} from "@/mock/contacts.mock";
import {ContactI, FilterI} from "@/features/contacts/types";
import {FilterTypeEnum} from "@/enums/enums";

const ContactsPage = () => {
    const [filteredContacts , setFilteredContacts] =useState<ContactI[]>(mockContacts)
    const [filters , setFilters] = useState<FilterI>({positionFilter :[], companyFilter : [],isValid : true});

    const ApplyFilters = () => {
        console.log(filters)
        const filtered = mockContacts.filter(contact =>
            (!filters?.[FilterTypeEnum.POSITION_TYPE]?.length || filters[FilterTypeEnum.POSITION_TYPE].includes(contact.positionType)) &&
            (!filters?.[FilterTypeEnum.COMPANY_NAME]?.length || filters[FilterTypeEnum.COMPANY_NAME].includes(contact.companyName))
        );
        console.log(filtered);
        setFilteredContacts(filtered)
    }

  return (
    <section className="flex flex-col h-full">
      {/* heading - fixed height */}
      <h1 className="text-2xl font-semibold py-2">Contacts</h1>

      {/* filters - fixed height */}
      <div className="flex flex-row gap-4 py-2 mb-4">
        <FilterBox applyFilters={ApplyFilters} setFilters={setFilters}/>
      </div>

      {/* people profiles - takes remaining height with scroll */}
      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pb-4">
          {filteredContacts.map((contact: ContactI) => (
            <ContactCard key={contact.id} contact={contact} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ContactsPage;
