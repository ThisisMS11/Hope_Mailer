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
import { Building2 } from "lucide-react";

const AddEmployeeCompany: React.FC<any> = ({ formData, setFormData }: any) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [companies, setCompanies] = useState<any[]>([]);
  const [filteredItems, setFilteredItems] = useState<any[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<any>({});
  // const [isAdding, setIsAdding] = useState(false);

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

  const toggleSelection = async (item?: any) => {
    const companyName = item?.name || searchTerm;

    if (!companyName) {
      console.error("No company name provided.");
      return;
    }

    const isCompanyInDB = companies.some((company) => company.id === item?.id);

    if (!isCompanyInDB) {
      const addToDB = confirm(`${companyName} is not in the database. Add it?`);

      if (addToDB) {
        // setIsAdding(true);
        try {
          const url = `${process.env.NEXT_PUBLIC_URL}/api/company`;
          const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: companyName,
              domain: item?.domain || "", // Optional field
              logo: item?.logo || "", // Optional field
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
        }
      }
    } else {
      // Use fallback for existing company
      const selectedCompany =
        item || companies.find((company) => company.name === searchTerm);

      if (selectedCompany) {
        setFormData((prev: any) => ({
          ...prev,
          companyId: selectedCompany.id,
        }));
        setSelectedCompany(selectedCompany);
      } else {
        console.error("Company not found in the database.");
      }
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          {formData.company !== "" ? (
            <>
              {selectedCompany.logo ? (
                <Image
                  src={selectedCompany.logo}
                  alt={selectedCompany.name}
                  width={24}
                  height={24}
                  className="w-6 h-6 rounded-full"
                />
              ) : (
                <Building2 />
              )}
              {selectedCompany.name
                ? selectedCompany.name + "Selected"
                : "Select Company"}
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
              <div className="flex items-center">
                {item.logo ? (
                  <Image
                    src={item.logo}
                    alt={item.name}
                    width={24}
                    height={24}
                    className="w-6 h-6 mr-2 rounded-full"
                  />
                ) : (
                  <Building2 className="w-6 h-6 mr-2 rounded-full" />
                )}
                {item.name}
              </div>
            </DropdownMenuCheckboxItem>
          ))
        ) : (
          <div className="p-2 text-sm text-gray-500">
            {" "}
            <Button onClick={toggleSelection}>click to add this one ?</Button>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AddEmployeeCompany;
