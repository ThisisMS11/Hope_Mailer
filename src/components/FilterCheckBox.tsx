import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Input,
  Button,
} from "@/imports/Shadcn_imports";

interface FilterCheckBoxProps {
  filterName: string;
  selectedItems: string[];
  setSelectItems: React.Dispatch<React.SetStateAction<string[]>>;
  list: string[];
}

const FilterCheckBox: React.FC<FilterCheckBoxProps> = ({
  filterName,
  list,
  selectedItems,
  setSelectItems,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const toggleSelection = (item: string) => {
    setSelectItems((prev) =>
      prev.includes(item) ? prev.filter((c) => c !== item) : [...prev, item],
    );
  };

  const filteredItems = list.filter((item) =>
    item.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          {selectedItems.length > 0
            ? `${selectedItems.length} Selected`
            : `Select ${filterName}`}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 max-h-64 overflow-y-auto">
        <DropdownMenuLabel>{filterName}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="p-2">
          <Input
            placeholder={`Search ${filterName}`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-2"
          />
        </div>
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => (
            <DropdownMenuCheckboxItem
              key={item}
              checked={selectedItems.includes(item)}
              onCheckedChange={() => toggleSelection(item)}
            >
              {item}
            </DropdownMenuCheckboxItem>
          ))
        ) : (
          <div className="p-2 text-sm text-gray-500">No results found</div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default FilterCheckBox;
