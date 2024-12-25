"use client";
import { EmployeeTable } from "@/components/EmployeeTable";
import AddEmployeeDialog from "@/components/AddEmployeeDialog";
import { Button } from "@/components/ui/button";
import { useRef, useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Plus, LayoutGrid, List, RotateCw, Mails } from "lucide-react";
import FilterCheckBox from "@/components/FilterCheckBox";
import EmailWorkflowRefactored from "@/components/EmailWorkflowRefactored";
import axios from "axios";
import { EmailWorkflowProvider } from "@/context/EmailWorkflow";
import { positionType } from "@/utils/constants";

export default function Dashboard() {
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const session = useSession();

  const [selectedPositionTypes, setSelectedPositionTypes] = useState<any[]>([]);
  const [selectedCompanies, setSelectedCompanies] = useState<any[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<any>([]);
  const [allEmployees, setAllEmployees] = useState<any>([]);
  const [selectedEmployees, setSelectedEmployees] = useState<any>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(false);

  const [companies, setCompanies] = useState<any[]>([]);

  const handleFilter = () => {
    console.log({ selectedCompanies, selectedPositionTypes });

    if (selectedCompanies.length === 0 && selectedPositionTypes.length === 0) {
      setFilteredEmployees(allEmployees);
      return;
    }

    const filtered = allEmployees.filter((employee: any) => {
      const matchesPosition =
        selectedPositionTypes.length === 0 ||
        selectedPositionTypes.includes(employee.positionType);
      const matchesCompany =
        selectedCompanies.length === 0 ||
        selectedCompanies.includes(employee.company.name);
      return matchesPosition && matchesCompany && employee.valid;
    });

    setFilteredEmployees(filtered);
  };

  const handleResetFilters = () => {
    setSelectedCompanies([]);
    setSelectedPositionTypes([]);
    setFilteredEmployees(allEmployees);
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
    console.log("[Fetch contacts Called]");
    setIsLoading(true);
    setFetchError(null);
    try {
      const url = `${process.env.NEXT_PUBLIC_URL}/api/contacts`;
      const response = await axios.get(url);

      const resultEmployees = response.data.data;
      // console.log(response.data.data);

      setFilteredEmployees(resultEmployees);
      setAllEmployees(resultEmployees);
    } catch (error: any) {
      setFetchError(
        error?.response?.data?.message ||
          "An error occurred while fetching employees.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function fetchCompanies() {
    console.log("[Fetch Companies Called]");
    setIsLoading(true);
    setFetchError(null);
    try {
      const url = `${process.env.NEXT_PUBLIC_URL}/api/company`;
      const response = await axios.get(url);

      const resultCompanies = response.data.data;
      // console.log(response.data.data);
      setCompanies(resultCompanies);
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
    const user = session.data?.user;
    if (user) {
      // @ts-ignore
      setIsAdmin(user.admin);
    }
    fetchContacts();
    fetchCompanies();
  }, [session]);

  useEffect(() => {
    handleFilter();
  }, [selectedPositionTypes, selectedCompanies]);

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
                  filterName="Position Type"
                  selectedItems={selectedPositionTypes}
                  setSelectItems={setSelectedPositionTypes}
                  list={positionType}
                />
                <Button
                  onClick={handleResetFilters}
                  className="bg-teal-600 hover:bg-teal-700"
                >
                  Reset Filters <RotateCw />
                </Button>
                {isAdmin && (
                  <Button
                    onClick={handleColdEmailing}
                    className="bg-teal-600 hover:bg-teal-700"
                  >
                    Start Mailing <Mails />
                  </Button>
                )}
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

      {selectedEmployees.length > 0 && (
        <EmailWorkflowProvider initialState={{}}>
          <EmailWorkflowRefactored
            isModalOpen={isModalOpen}
            setIsModalOpen={setIsModalOpen}
            employees={selectedEmployees}
          />
        </EmailWorkflowProvider>
      )}
    </>
  );
}
