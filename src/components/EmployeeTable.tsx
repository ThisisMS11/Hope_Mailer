"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Key, Pencil } from "lucide-react";

export function EmployeeTable({
  employees,
  setSelectedEmployees,
}: {
  employees: any;
  setSelectedEmployees: React.Dispatch<React.SetStateAction<any[]>>;
}) {
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const handleCheckboxChange = (employee: any, isChecked: boolean) => {
    setSelectedEmployees((prevSelected) => {
      if (isChecked) {
        return [...prevSelected, employee];
      } else {
        return prevSelected.filter((e) => e.id !== employee.id);
      }
    });
  };

  return (
    <div className="rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[30px]"></TableHead>
            <TableHead className="dark:text-pink-600 ">Name/ID</TableHead>
            <TableHead>Position</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Mobile Number</TableHead>
            <TableHead>E-mail / Mobile</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {employees.map((employee: any) => (
            <>
              <TableRow key={employee.id}>
                <TableCell>
                  <input
                    type="checkbox"
                    className="rounded border-gray-300"
                    onChange={(e) =>
                      handleCheckboxChange(employee, e.target.checked)
                    }
                  />
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium text-teal-600">
                      {employee.name}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <div>{employee.position}</div>
                    <div className="text-sm text-muted-foreground">
                      {employee.experience}
                    </div>
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
                    onClick={() =>
                      setExpandedRow(
                        expandedRow === employee.id ? null : employee.id,
                      )
                    }
                  >
                    <Pencil
                      className={`h-4 w-4 transition-transform ${expandedRow === employee.id ? "text-blue-600" : ""}`}
                    />
                  </Button>
                </TableCell>
              </TableRow>
              {expandedRow === employee.id && (
                <TableRow>
                  <TableCell colSpan={9}>
                    <div className="grid grid-cols-2 gap-4 p-4">
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm text-muted-foreground">
                            Surname
                          </label>
                          <Input defaultValue={employee.name.split(" ")[0]} />
                        </div>
                        <div>
                          <label className="text-sm text-muted-foreground">
                            Name
                          </label>
                          <Input defaultValue={employee.name.split(" ")[1]} />
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm text-muted-foreground">
                            Position
                          </label>
                          <Select
                            defaultValue={employee.position.toLowerCase()}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="designer">Designer</SelectItem>
                              <SelectItem value="developer">
                                Developer
                              </SelectItem>
                              <SelectItem value="manager">Manager</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label className="text-sm text-muted-foreground">
                            Experience
                          </label>
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
                        <Button className="bg-teal-600 hover:bg-teal-700">
                          Save
                        </Button>
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
          <Button variant="outline" size="sm" disabled>
            1
          </Button>
          <Button variant="ghost" size="sm">
            2
          </Button>
          <Button variant="ghost" size="sm">
            3
          </Button>
          <span>...</span>
          <Button variant="ghost" size="sm">
            9
          </Button>
          <Button variant="ghost" size="sm">
            10
          </Button>
        </div>
      </div>
    </div>
  );
}
