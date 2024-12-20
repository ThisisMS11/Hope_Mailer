"use client";
import { EmployeeTable } from "@/components/EmployeeTable";
import AddEmployeeDialog from "@/components/AddEmployeeDialog";
import { Button } from "@/components/ui/button";
import { useRef, useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/imports/Shadcn_imports";
import { Plus, LayoutGrid, List, RotateCw, Filter, Mails } from "lucide-react";
import FilterCheckBox from "@/components/FilterCheckBox";
import EmailWorkflow from "@/components/EmailWorkflow";
import axios from "axios";

const companies = [
  "Google",
  "Microsoft",
  "Apple",
  "Amazon",
  "Netflix",
  "Spotify",
  "Meta",
  "Tesla",
  "Oracle",
  "Salesforce",
];

const positions = [
  "Manager",
  "Senior SDE",
  "SDE I",
  "SDE II",
  "SDE III",
  "HR",
  "Head",
];

export default function Dashboard() {
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const [selectedPositions, setSelectedPositions] = useState<string[]>([]);
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<any>([]);
  const [selectedEmployees, setSelectedEmployees] = useState<any>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const handleFilter = () => {
    console.log({ selectedCompanies, selectedPositions });

    if (selectedCompanies.length === 0 && selectedCompanies.length === 0) {
      fetchContacts();
      return;
    }

    const filtered = filteredEmployees.filter((employee: any) => {
      const matchesPosition =
        selectedPositions.length === 0 ||
        selectedPositions.includes(employee.position);
      const matchesCompany =
        selectedCompanies.length === 0 ||
        selectedCompanies.includes(employee.company);
      return matchesPosition && matchesCompany && employee.valid;
    });
    setFilteredEmployees(filtered);
  };

  const handleResetFilters = () => {
    setSelectedCompanies([]);
    setSelectedPositions([]);
    fetchContacts();
  };

  const handleColdEmailing = () => {
    setIsModalOpen(true);
    console.log({ selectedEmployees });
  };

  const openAddEmployeeDialog = () => {
    if (buttonRef.current) {
      buttonRef.current.click();
    }
  };

  async function fetchContacts() {
    setIsLoading(true);
    setFetchError(null);
    try {
      const url = `${process.env.NEXT_PUBLIC_URL}/api/contacts`;
      const response = await axios.get(url);
      console.log(response.data.data);
      setFilteredEmployees(response.data.data);
    } catch (error: any) {
      setFetchError(
        error?.response?.data?.message ||
          "An error occurred while fetching employees.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchContacts();
  }, []);

  return (
    <>
      <div className="p-6">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-semibold text-teal-600">Employees</h1>
        </div>
        {isLoading ? (
          <div className="text-center text-gray-500">Loading employees...</div>
        ) : fetchError ? (
          <div className="text-center text-red-500">{fetchError}</div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <div className="flex gap-2">
                <FilterCheckBox
                  filterName="Companies"
                  selectedItems={selectedCompanies}
                  setSelectItems={setSelectedCompanies}
                  list={companies}
                />
                <FilterCheckBox
                  filterName="Positions"
                  selectedItems={selectedPositions}
                  setSelectItems={setSelectedPositions}
                  list={positions}
                />
                <Button
                  onClick={handleFilter}
                  className="bg-teal-600 hover:bg-teal-700"
                >
                  Apply Filters <Filter />
                </Button>
                <Button
                  onClick={handleResetFilters}
                  className="bg-teal-600 hover:bg-teal-700"
                >
                  Reset Filters <RotateCw />
                </Button>
                <Button
                  onClick={handleColdEmailing}
                  className="bg-teal-600 hover:bg-teal-700"
                >
                  Start Cold Emailing <Mails />
                </Button>
              </div>
              <div className="flex items-center gap-4">
                <Button
                  variant="default"
                  className="bg-teal-600 hover:bg-teal-700"
                  onClick={openAddEmployeeDialog}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add employee
                </Button>
                <div className="flex items-center rounded-md border">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-r-none"
                  >
                    <LayoutGrid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-l-none border-l"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
            <EmployeeTable
              employees={filteredEmployees}
              setSelectedEmployees={setSelectedEmployees}
            />
          </>
        )}
        <AddEmployeeDialog buttonRef={buttonRef} />
      </div>

      <EmailWorkflow
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />
    </>
  );
}
