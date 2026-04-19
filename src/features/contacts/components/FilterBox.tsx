"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, LayoutGrid, List, Funnel, Mail } from "lucide-react";
import MultiSelect from "@/features/contacts/components/MultiSelect";
import { positionType } from "@/utils/constants";
import { mockCompanies } from "@/mock/contacts.mock";
import { FilterI } from "@/features/contacts/types";
import { FilterTypeEnum } from "@/enums/enums";

interface FilterBoxProps {
  setFilters: React.Dispatch<React.SetStateAction<FilterI>>;
  applyFilters: () => void;
  checkedContacts: number[];
  startMailing: () => void;
  setIsCreateModalOpen: (__open: boolean) => void;
}

const FilterBox: React.FC<FilterBoxProps> = ({
  setFilters,
  applyFilters,
  startMailing,
  checkedContacts,
  setIsCreateModalOpen,
}) => {
  const [view, setView] = useState<"grid" | "list">("grid");

  return (
    <div className="flex items-center justify-between gap-3 bg-white/50 backdrop-blur-md border border-white/70 dark:bg-white/[0.04] dark:border-white/[0.08] shadow-lg shadow-black/[0.06] dark:shadow-black/20 p-3 rounded-2xl w-full">
      <MultiSelect
        filterName={FilterTypeEnum.POSITION_TYPE}
        options={positionType}
        setFilters={setFilters}
      />

      <MultiSelect
        filterName={FilterTypeEnum.COMPANY_NAME}
        options={mockCompanies}
        setFilters={setFilters}
      />

      {/* More Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="h-10 rounded-lg bg-white/50 hover:bg-white/80 border border-white/70 dark:bg-white/[0.06] dark:hover:bg-white/[0.1] dark:border-white/[0.1] dark:text-gray-300 backdrop-blur-sm shadow-sm"
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

      <Button
        onClick={applyFilters}
        className="bg-violet-500/90 hover:bg-violet-600/90 text-white border border-violet-400/30 backdrop-blur-sm shadow-md shadow-violet-500/20 dark:bg-violet-500/25 dark:hover:bg-violet-500/35 dark:border-violet-400/20 dark:shadow-violet-500/10"
      >
        Apply Filters
      </Button>

      <Button
        onClick={() => setIsCreateModalOpen(true)}
        className="ml-auto bg-violet-500/90 hover:bg-violet-600/90 text-white border border-violet-400/30 backdrop-blur-sm shadow-md shadow-violet-500/20 dark:bg-violet-500/25 dark:hover:bg-violet-500/35 dark:border-violet-400/20 dark:shadow-violet-500/10"
      >
        Add Contact
      </Button>

      {/* Button to show compose email panel */}
      {checkedContacts.length > 0 && (
        <Button
          onClick={startMailing}
          className="flex items-center gap-2 bg-violet-500/90 hover:bg-violet-600/90 text-white border border-violet-400/30 backdrop-blur-sm shadow-md shadow-violet-500/20 dark:bg-violet-500/25 dark:hover:bg-violet-500/35 dark:border-violet-400/20 dark:shadow-violet-500/10"
        >
          <Mail className="h-4 w-4" />
          Compose Email ({checkedContacts.length})
        </Button>
      )}

      <div className="flex-1" />

      {/* Sort By */}
      <span className="text-sm text-gray-600 dark:text-gray-300 mr-2">Sort by:</span>
      <Button
        variant="ghost"
        size="sm"
        className="h-10 px-3 rounded-lg bg-white/50 hover:bg-white/80 border border-white/70 dark:bg-white/[0.06] dark:hover:bg-white/[0.1] dark:border-white/[0.1] dark:text-gray-300 backdrop-blur-sm shadow-sm"
      >
        All
      </Button>

      {/* View Toggle */}
      <Button
        variant="ghost"
        size="sm"
        className={`h-10 p-2 rounded-lg border backdrop-blur-sm shadow-sm transition-all ${
          view === "grid"
            ? "bg-violet-500/90 text-white border-violet-400/30 dark:bg-violet-500/25 dark:border-violet-400/20"
            : "bg-white/50 hover:bg-white/80 border-white/70 dark:bg-white/[0.06] dark:hover:bg-white/[0.1] dark:border-white/[0.1] dark:text-gray-300"
        }`}
        onClick={() => setView("grid")}
      >
        <LayoutGrid className="w-5 h-5" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className={`h-10 p-2 rounded-lg border backdrop-blur-sm shadow-sm transition-all ${
          view === "list"
            ? "bg-violet-500/90 text-white border-violet-400/30 dark:bg-violet-500/25 dark:border-violet-400/20"
            : "bg-white/50 hover:bg-white/80 border-white/70 dark:bg-white/[0.06] dark:hover:bg-white/[0.1] dark:border-white/[0.1] dark:text-gray-300"
        }`}
        onClick={() => setView("list")}
      >
        <List className="w-5 h-5" />
      </Button>
    </div>
  );
};
export default FilterBox;
