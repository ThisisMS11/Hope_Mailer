'use client'
import { EmployeeTable } from "@/components/EmployeeTable"
import AddEmployeeDialog from "@/components/AddEmployeeDialog"
import { Button } from "@/components/ui/button"
import { useRef } from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Search, Plus, LayoutGrid, List } from 'lucide-react'

export default function Dashboard() {
  const buttonRef = useRef<HTMLButtonElement | null>(null);

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
            <Select defaultValue="all">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                <SelectItem value="design">Design</SelectItem>
                <SelectItem value="development">Development</SelectItem>
                <SelectItem value="management">Management</SelectItem>
              </SelectContent>
            </Select>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search..."
                className="w-[300px] pl-9"
              />
            </div>
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
        <EmployeeTable />

        <AddEmployeeDialog buttonRef={buttonRef} />
      </div>
    </>
  )
}

