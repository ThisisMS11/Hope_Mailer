import React, { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Input,
  Button,
} from "@/imports/Shadcn_imports";
import Image from "next/image";

const AddEmployeeCompany: React.FC<any> = ({ formData, setFormData }: any) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [companies, setCompanies] = useState<any[]>([]);
  const [filteredItems, setFilteredItems] = useState<any[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<any>({});
  const [isAdding, setIsAdding] = useState(false);

  // Fetch companies from the database on mount
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const url = `${process.env.NEXT_PUBLIC_URL}/api/company`;
        const response = await fetch(url);
        const data = await response.json();
        setCompanies(data.data);
      } catch (error) {
        console.error("Failed to fetch companies", error);
      }
    };
    fetchCompanies();
  }, []);

  // Filter companies based on the search term
  useEffect(() => {
    if (companies) {
      console.log(companies);
      const results = companies.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()),
      );

      if (results.length === 0 && searchTerm) {
        fetchClearbitSuggestions(searchTerm);
      } else {
        setFilteredItems(results);
      }
    }
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

  const toggleSelection = async (item: any) => {
    if (!companies.some((company) => company.id === item.id)) {
      const addToDB = confirm(`${item.name} is not in the database. Add it?`);

      if (addToDB) {
        setIsAdding(true);
        try {
          const url = `${process.env.NEXT_PUBLIC_URL}/api/company`;
          const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: item.name,
              domain: item.domain,
              logo: item.logo,
            }),
          });
          const newCompany = await response.json();

          console.log(newCompany);

          const newCompanyData = newCompany.data;

          console.log(newCompanyData);

          setCompanies((prev) => [...prev, newCompanyData]);
          setFormData((prev: any) => ({
            ...prev,
            companyId: newCompanyData.id,
          }));
          setSelectedCompany(newCompanyData);
        } catch (error) {
          console.error("Failed to add company to the database", error);
        } finally {
          setIsAdding(false);
        }
      }
    } else {
      setFormData((prev: any) => ({ ...prev, companyId: item.id }));
      setSelectedCompany(item);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          {formData.company !== "" ? (
            <>
              <Image
                src={selectedCompany.logo}
                alt={selectedCompany.name}
                width={24}
                height={24}
                className="w-6 h-6 rounded-full"
              />
              {selectedCompany.name} Selected
            </>
          ) : (
            `Select Company`
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 max-h-64 overflow-y-scroll ">
        <DropdownMenuLabel>Select Company</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="p-2">
          <Input
            placeholder={`Search Company`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-2"
          />
        </div>
        {filteredItems.length > 0 ? (
          filteredItems.map((item: any) => (
            <DropdownMenuCheckboxItem
              key={item.id || item.domain}
              checked={selectedCompany.name === item.name}
              onCheckedChange={() => toggleSelection(item)}
            >
              {item.logo ? (
                <div className="flex items-center">
                  <Image
                    src={item.logo}
                    alt={item.name}
                    width={24}
                    height={24}
                    className="w-6 h-6 mr-2 rounded-full"
                  />
                  {item.name}
                </div>
              ) : (
                item.name
              )}
            </DropdownMenuCheckboxItem>
          ))
        ) : (
          <div className="p-2 text-sm text-gray-500">No results found</div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AddEmployeeCompany;
