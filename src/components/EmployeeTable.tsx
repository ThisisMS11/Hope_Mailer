"use client"

import { useState } from "react"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { format } from "date-fns"
import { ChevronDown, Pencil } from 'lucide-react'

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
        position: "HR Manager",
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


export function EmployeeTable() {
    const [expandedRow, setExpandedRow] = useState<string | null>(null)

    return (
        <div className="rounded-md">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[30px]"></TableHead>
                        <TableHead>Name/ID</TableHead>
                        <TableHead>Position</TableHead>
                        <TableHead>Company</TableHead>
                        <TableHead>Mobile Number</TableHead>
                        <TableHead>E-mail / Mobile</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {employees.map((employee) => (
                        <>
                            <TableRow key={employee.id}>
                                <TableCell>
                                    <input type="checkbox" className="rounded border-gray-300" />
                                </TableCell>
                                <TableCell>
                                    <div>
                                        <div className="font-medium text-teal-600">{employee.name}</div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div>
                                        <div>{employee.position}</div>
                                        <div className="text-sm text-muted-foreground">{employee.experience}</div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div>
                                        <div>{employee.company}</div>
                                    </div>
                                </TableCell>
                                <TableCell>{employee.phone}</TableCell>
                                <TableCell>
                                    <div>
                                        <div>{employee.email}</div>
                                    </div>
                                </TableCell>
                                <TableCell>{employee.status}</TableCell>
                                <TableCell>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => setExpandedRow(expandedRow === employee.id ? null : employee.id)}
                                    >
                                        <Pencil className={`h-4 w-4 transition-transform ${expandedRow === employee.id ? "text-blue-600" : ""}`} />
                                    </Button>
                                </TableCell>
                            </TableRow>
                            {expandedRow === employee.id && (
                                <TableRow>
                                    <TableCell colSpan={9}>
                                        <div className="grid grid-cols-2 gap-4 p-4">
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="text-sm text-muted-foreground">Surname</label>
                                                    <Input defaultValue={employee.name.split(" ")[0]} />
                                                </div>
                                                <div>
                                                    <label className="text-sm text-muted-foreground">Name</label>
                                                    <Input defaultValue={employee.name.split(" ")[1]} />
                                                </div>
                                            </div>
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="text-sm text-muted-foreground">Position</label>
                                                    <Select defaultValue={employee.position.toLowerCase()}>
                                                        <SelectTrigger>
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="designer">Designer</SelectItem>
                                                            <SelectItem value="developer">Developer</SelectItem>
                                                            <SelectItem value="manager">Manager</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div>
                                                    <label className="text-sm text-muted-foreground">Experience</label>
                                                    <Select defaultValue={employee.experience}>
                                                        <SelectTrigger>
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="1 year">1 year</SelectItem>
                                                            <SelectItem value="2 years">2 years</SelectItem>
                                                            <SelectItem value="3 years">3 years</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </div>
                                            <div className="col-span-2 flex justify-end">
                                                <Button className="bg-teal-600 hover:bg-teal-700">Save</Button>
                                            </div>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}
                        </>
                    ))}
                </TableBody>
            </Table>
            <div className="flex items-center justify-between px-4 py-2 border-t">
                <div className="text-sm text-muted-foreground">58 employees</div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" disabled>1</Button>
                    <Button variant="ghost" size="sm">2</Button>
                    <Button variant="ghost" size="sm">3</Button>
                    <span>...</span>
                    <Button variant="ghost" size="sm">9</Button>
                    <Button variant="ghost" size="sm">10</Button>
                </div>
            </div>
        </div>
    )
}

