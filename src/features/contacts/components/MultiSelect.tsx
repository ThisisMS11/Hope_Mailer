import React, { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { Image } from "@/imports/Nextjs_imports";

export interface optionI {
  id?: any;
  key: string;
  value: string;
  logo?: string;
}

interface MultiSelectProps {
  filterName: string;
  options: optionI[];
}

const MultiSelect: React.FC<MultiSelectProps> = ({ filterName, options }) => {
  const [selectedValues, setSelectedValues] = useState<string[]>([]);

  const handleCheckboxChange = (value: string) => {
    setSelectedValues((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
    );
  };

  // Get display text for selected items
  const displayText =
    selectedValues.length > 0
      ? options
          .filter((option) => selectedValues.includes(option.value))
          .map((option) => option.key)
          .join(", ")
      : `Select ${filterName}`;

  const isCompanyFilter = filterName === "companyFilter";

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-[140px] h-10 rounded-lg border bg-gray-50 hover:bg-gray-100 dark:bg-secondary flex items-center justify-between"
        >
          <span className="text-sm truncate">{displayText}</span>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className={`${isCompanyFilter ? "w-[180px]" : "w-[140px]"} p-0`}
      >
        <div className="p-2 max-h-60 overflow-y-auto scrollbar-transparent">
          {options.map((option) => (
            <div key={option.value} className="flex items-center space-x-2 p-1">
              <Checkbox
                id={option.value}
                checked={selectedValues.includes(option.value)}
                onCheckedChange={() => handleCheckboxChange(option.value)}
              />
              <label
                htmlFor={option.value}
                className="text-sm cursor-pointer flex-1"
              >
                {option.key}
              </label>
              {isCompanyFilter && option.logo && (
                <div className="flex-shrink-0">
                  <Image
                    src={option.logo}
                    alt={option.key}
                    width={24}
                    height={24}
                    className="w-5 h-5 rounded-full object-cover"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default MultiSelect;
