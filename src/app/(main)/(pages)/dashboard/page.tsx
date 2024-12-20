'use client'
import { EmployeeTable } from "@/components/EmployeeTable"
import AddEmployeeDialog from "@/components/AddEmployeeDialog"
import { Button } from "@/components/ui/button"
import { useRef, useState } from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/imports/Shadcn_imports"
import { Plus, LayoutGrid, List, RotateCw, Filter, Mails } from 'lucide-react'
import FilterCheckBox from "@/components/FilterCheckBox"
import EmailWorkflow from "@/components/something"

// Sample data
const employees = [
  {
    id: "163",
    name: "Selivanova Vera",
    position: "Designer",
    company: "Google",
    email: "selivanova.vera@gmail.com",
    phone: "+375(29)298-44-44",
    status: "Valid",
    experience: "3 years"
  },
  {
    id: "164",
    name: "John Doe",
    position: "Software Engineer",
    company: "Microsoft",
    email: "john.doe@microsoft.com",
    phone: "+1(555)123-4567",
    status: "Valid",
    experience: "5 years"
  },
  {
    id: "165",
    name: "Alicia Park",
    position: "Project Manager",
    company: "Amazon",
    email: "alicia.park@amazon.com",
    phone: "+1(555)987-6543",
    status: "Valid",
    experience: "7 years"
  },
  {
    id: "166",
    name: "Michael Smith",
    position: "Marketing Specialist",
    company: "Facebook",
    email: "michael.smith@facebook.com",
    phone: "+44(20)7946-0958",
    status: "Valid",
    experience: "4 years"
  },
  {
    id: "167",
    name: "Emma Williams",
    position: "Product Designer",
    company: "Apple",
    email: "emma.williams@apple.com",
    phone: "+1(555)555-1212",
    status: "Valid",
    experience: "6 years"
  },
  {
    id: "168",
    name: "David Johnson",
    position: "Software Developer",
    company: "IBM",
    email: "david.johnson@ibm.com",
    phone: "+49(0)171-123-4567",
    status: "Valid",
    experience: "2 years"
  },
  {
    id: "169",
    name: "Sophia Brown",
    position: "UI/UX Designer",
    company: "Adobe",
    email: "sophia.brown@adobe.com",
    phone: "+1(555)432-7654",
    status: "Valid",
    experience: "3 years"
  },
  {
    id: "170",
    name: "Lucas Miller",
    position: "Data Analyst",
    company: "Netflix",
    email: "lucas.miller@netflix.com",
    phone: "+33(0)1-234-5678",
    status: "Valid",
    experience: "5 years"
  },
  {
    id: "171",
    name: "Olivia Taylor",
    position: "HR",
    company: "Spotify",
    email: "olivia.taylor@spotify.com",
    phone: "+34(0)912-345-678",
    status: "Valid",
    experience: "8 years"
  },
  {
    id: "172",
    name: "James Anderson",
    position: "Full Stack Developer",
    company: "Twitter",
    email: "james.anderson@twitter.com",
    phone: "+1(555)678-9876",
    status: "Valid",
    experience: "4 years"
  }
];

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
  const [filteredEmployees, setFilteredEmployees] = useState(employees);
  const [selectedEmployees, setSelectedEmployees] = useState<any>([]);
  const [isModalOpen, setIsModalOpen] = useState(true);

  const handleFilter = () => {
    console.log({ selectedCompanies, selectedPositions })
    const filtered = employees.filter((employee: any) => {
      const matchesPosition =
        selectedPositions.length === 0 || selectedPositions.includes(employee.position);
      const matchesCompany =
        selectedCompanies.length === 0 || selectedCompanies.includes(employee.company);
      const isValid = employee.status === "Valid";
      return matchesPosition && matchesCompany && isValid;
    });
    setFilteredEmployees(filtered);
  };

  const handleResetFilters = () => {
    setSelectedCompanies([]);
    setSelectedPositions([]);
    setFilteredEmployees(employees);
  };

  const handleColdEmailing = () => {
    setIsModalOpen(true)
    console.log({ selectedEmployees });
  }

  const openAddEmployeeDialog = () => {
    if (buttonRef.current) {
      buttonRef.current.click();
    }
  }
  return (
    <>
      <div className="p-6">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-semibold text-teal-600">Employees</h1>
        </div>
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-2">

            <FilterCheckBox filterName="Companies" selectedItems={selectedCompanies} setSelectItems={setSelectedCompanies} list={companies} />

            <FilterCheckBox filterName="Positions" selectedItems={selectedPositions} setSelectItems={setSelectedPositions} list={positions} />


            <Button onClick={handleFilter} className="bg-teal-600 hover:bg-teal-700">
              Apply Filters <Filter />
            </Button>

            <Button onClick={handleResetFilters} className="bg-teal-600 hover:bg-teal-700">
              Reset Filters <RotateCw />
            </Button>

            <Button onClick={handleColdEmailing} className="bg-teal-600 hover:bg-teal-700">
              Start Cold Emailing <Mails />
            </Button>

          </div>
          <div className="flex items-center gap-4">
            <Button variant="default" className="bg-teal-600 hover:bg-teal-700" onClick={openAddEmployeeDialog}>
              <Plus className="mr-2 h-4 w-4" />
              Add employee
            </Button>
            <div className="flex items-center rounded-md border">
              <Button variant="ghost" size="icon" className="rounded-r-none">
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-l-none border-l">
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        <EmployeeTable employees={filteredEmployees} setSelectedEmployees={setSelectedEmployees} />

        <AddEmployeeDialog buttonRef={buttonRef} />
      </div>

      <EmailWorkflow isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
    </>
  )
}

