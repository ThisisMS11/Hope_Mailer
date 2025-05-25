"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, LayoutGrid, List, Funnel } from "lucide-react";
import MultiSelect from "@/features/contacts/components/MultiSelect";
import { positionType } from "@/utils/constants";
import { mockCompanies } from "@/mock/contacts.mock";

export default function FilterBox() {
  const [view, setView] = useState<"grid" | "list">("grid");

  return (
    <div className="flex items-center justify-between gap-3 bg-white dark:bg-secondary p-3 rounded-2xl shadow-sm w-full">
      <MultiSelect filterName={"Position"} options={positionType} />

      <MultiSelect filterName={"companyFilter"} options={mockCompanies} />

      {/* More Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="h-10 rounded-lg bg-gray-50 hover:bg-gray-100 border"
          >
            <Funnel />
            <ChevronDown className="w-4 h-4 ml-1 opacity-60" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem>Location</DropdownMenuItem>
          <DropdownMenuItem>Experience</DropdownMenuItem>
          <DropdownMenuItem>Salary</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Button> Apply Filters </Button>

      <div className="flex-1" />

      {/* Sort By */}
      <span className="text-sm text-gray-600 mr-2">Sort by:</span>
      <Button
        variant="ghost"
        size="sm"
        className="h-10 px-3 rounded-lg bg-gray-50 hover:bg-gray-100 border"
      >
        All
      </Button>

      {/* View Toggle */}
      <Button
        variant={view === "grid" ? "default" : "ghost"}
        size="sm"
        className="h-10 p-2 rounded-lg border"
        onClick={() => setView("grid")}
      >
        <LayoutGrid className="w-5 h-5" />
      </Button>
      <Button
        variant={view === "list" ? "default" : "ghost"}
        size="sm"
        className="h-10 p-2 rounded-lg border"
        onClick={() => setView("list")}
      >
        <List className="w-5 h-5" />
      </Button>
    </div>
  );
}
