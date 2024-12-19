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
import { CalendarIcon, ChevronDown, MoreVertical, Search } from 'lucide-react'

// Sample data
const employees = [
    {
        id: "163",
        name: "Selivanova Vera",
        position: "Designer",
        team: "15",
        birthday: new Date("1986-08-15"),
        email: "abramov@gmail.com",
        phone: "+375(29)298-44-44",
        address: "Minsk, Pobediteley, 135",
        status: "Full-time",
        experience: "3 years"
    },
    // Add more employees as needed
]

export function EmployeeTable() {
    const [expandedRow, setExpandedRow] = useState<string | null>(null)

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[30px]"></TableHead>
                        <TableHead>Name/ID</TableHead>
                        <TableHead>Position</TableHead>
                        <TableHead>Team</TableHead>
                        <TableHead>BDay</TableHead>
                        <TableHead>E-mail / Mobile</TableHead>
                        <TableHead>Address</TableHead>
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
                                        <div className="text-sm text-muted-foreground">{employee.id}</div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div>
                                        <div>{employee.position}</div>
                                        <div className="text-sm text-muted-foreground">{employee.experience}</div>
                                    </div>
                                </TableCell>
                                <TableCell>{employee.team}</TableCell>
                                <TableCell>{format(employee.birthday, "MMM dd, yyyy")}</TableCell>
                                <TableCell>
                                    <div>
                                        <div>{employee.email}</div>
                                        <div className="text-sm text-muted-foreground">{employee.phone}</div>
                                    </div>
                                </TableCell>
                                <TableCell>{employee.address}</TableCell>
                                <TableCell>{employee.status}</TableCell>
                                <TableCell>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => setExpandedRow(expandedRow === employee.id ? null : employee.id)}
                                    >
                                        <ChevronDown className={`h-4 w-4 transition-transform ${expandedRow === employee.id ? "rotate-180" : ""}`} />
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

