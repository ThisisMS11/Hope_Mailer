"use client";
import { contactFormSchema } from "@/features/contacts/hooks/useContactMutations";
import { z } from "zod";
import { UseFormReturn } from "react-hook-form";
import useGetCompanies from "@/features/contacts/hooks/useGetCompanies";
import { Button } from "@/components/ui/button";
import React, { useState, useEffect } from "react";
import { CompanyI } from "@/features/contacts/types";
import { Building2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Input,
} from "@/imports/Shadcn_imports";
import useCompanyMutations from "@/features/contacts/hooks/useCompanyMutations";
import Image from "next/image";
import CustomLoader from "@/components/CustomLoader";

type YourFormType = z.infer<typeof contactFormSchema>;

interface AddEmployeeCompanyProps {
  contactFormData?: UseFormReturn<YourFormType>;
}

const AddEmployeeCompany: React.FC<AddEmployeeCompanyProps> = ({
  contactFormData,
}) => {
  const { data: companies, isLoading, isError, error } = useGetCompanies();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredItems, setFilteredItems] = useState<CompanyI[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<CompanyI | null>(null);
  const { companyFormData, requestCreateCompany } = useCompanyMutations();

  // Filter companies based on search term
  useEffect(() => {
    if (!companies?.data) {
      setFilteredItems([]);
      return;
    }

    if (!searchTerm.trim()) {
      setFilteredItems(companies.data);
    } else {
      const filtered = companies.data.filter((company) =>
        company.name.toLowerCase().includes(searchTerm.toLowerCase()),
      );

      if (filtered.length === 0 && searchTerm) {
        fetchClearbitSuggestions(searchTerm);
      } else {
        setFilteredItems(filtered ?? []);
      }
    }
  }, [companies?.data, searchTerm]);

  // Initialize the selected company based on form data
  useEffect(() => {
    if (contactFormData && companies?.data) {
      const companyId = contactFormData.getValues("companyId");
      if (companyId) {
        const company = companies.data.find(
          (c: CompanyI) => c.id === companyId,
        );
        if (company) {
          setSelectedCompany(company);
        }
      }
    }
  }, [contactFormData, companies?.data]);

  useEffect(() => {
    const fetchData = async () => {
      if (companies) {
        console.log(companies);
        const results = companies.data?.filter((item) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase()),
        );

        if (results?.length === 0 && searchTerm) {
          await fetchClearbitSuggestions(searchTerm);
        } else {
          setFilteredItems(results ?? []);
        }
      }
    };
    fetchData();
  }, [searchTerm, companies]);

  const fetchClearbitSuggestions = async (query: string) => {
    try {
      const response = await fetch(
        `https://autocomplete.clearbit.com/v1/companies/suggest?query=${query}`,
      );
      const data = await response.json();
      setFilteredItems(data);
    } catch (error) {
      console.error("Failed to fetch suggestions from Clearbit", error);
    }
  };

  const toggleSelection = async (item?: CompanyI) => {
    const companyName = item?.name || searchTerm;
    if (!companyName) {
      console.error("No company name provided.");
      return;
    }

    // Check if a company exists in a database
    const isCompanyInDB = companies?.data?.some(
      (company: CompanyI) => company.id === item?.id,
    );

    if (!isCompanyInDB) {
      const addToDB = confirm(`${companyName} is not in the database. Add it?`);

      if (addToDB) {
        try {
          companyFormData.setValue("name", companyName);
          companyFormData.setValue("domain", item?.domain || "");
          companyFormData.setValue("logo", item?.logo || "");

          const response = await requestCreateCompany.mutateAsync(
            companyFormData.getValues(),
          );
          const newCompanyData = response.data;

          console.log("New company added:", newCompanyData);

          if (response.success && newCompanyData) {
            contactFormData?.setValue("companyId", newCompanyData.id);
            setSelectedCompany(newCompanyData);
          }
        } catch (error) {
          console.error("Failed to add company to the database", error);
        }
      }
    } else {
      const selectedCompany =
        item ||
        companies?.data?.find(
          (company: CompanyI) =>
            company.name.toLowerCase() === searchTerm.toLowerCase(),
        );

      if (selectedCompany) {
        contactFormData?.setValue("companyId", selectedCompany.id);
        setSelectedCompany(selectedCompany);
      } else {
        console.error("Company not found in the database.");
      }
    }
  };

  if (isError) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-red-500 text-lg font-medium mb-2">
            Oops! Something went wrong
          </p>
          <p className="text-gray-600 dark:text-gray-400">
            {error?.message || "Failed to load companies"}
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return <CustomLoader />;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-full justify-between">
          {selectedCompany ? (
            <div className="flex items-center gap-2">
              {selectedCompany.logo ? (
                <Image
                  src={selectedCompany.logo}
                  alt={selectedCompany.name}
                  width={10}
                  height={10}
                  className="w-6 h-6 rounded-full"
                />
              ) : (
                <Building2 className="h-4 w-4" />
              )}
              <span>{selectedCompany.name}</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              <span>Select Company</span>
            </div>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="max-h-64 overflow-y-auto w-80"
        align="start"
        alignOffset={0}
        forceMount
      >
        <DropdownMenuLabel>Select Company</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="p-2">
          <Input
            placeholder="Search Company"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-2"
          />
        </div>

        {filteredItems.length > 0 ? (
          filteredItems.map((item: CompanyI) => (
            <DropdownMenuCheckboxItem
              key={item.id}
              checked={selectedCompany?.id === item.id}
              onCheckedChange={() => toggleSelection(item)}
            >
              <div className="flex items-center">
                {item.logo ? (
                  <Image
                    src={item.logo}
                    alt={item.name}
                    width={10}
                    height={10}
                    className="w-6 h-6 mr-2 rounded-full"
                  />
                ) : (
                  <Building2 className="w-6 h-6 mr-2" />
                )}
                {item.name}
              </div>
            </DropdownMenuCheckboxItem>
          ))
        ) : searchTerm.trim() ? (
          <div className="p-2 text-sm text-gray-500">
            <div className="flex flex-col gap-2">
              <span>No companies found matching &#34;{searchTerm}&#34; </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => toggleSelection()}
                className="w-full"
              >
                Add &#34;{searchTerm}&#34; as new company
              </Button>
            </div>
          </div>
        ) : (
          <div className="p-2 text-sm text-gray-500">
            Start typing to search companies...
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AddEmployeeCompany;
