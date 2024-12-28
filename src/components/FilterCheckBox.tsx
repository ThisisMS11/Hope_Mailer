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
import Image from "next/image";
import { Building2 } from "lucide-react";

interface FilterCheckBoxProps {
  filterName: string;
  selectedItems: any;
  setSelectItems: React.Dispatch<React.SetStateAction<any>>;
  list: any;
}

const FilterCheckBox: React.FC<FilterCheckBoxProps> = ({
  filterName,
  list,
  selectedItems,
  setSelectItems,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const toggleSelection = (item: any) => {
    setSelectItems((prev: any) =>
      prev.includes(item.name)
        ? prev.filter((c: any) => c !== item.name)
        : [...prev, item.name],
    );
  };

  const filteredItems = list.filter((item: any) => {
    return item.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

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
          filteredItems.map((item: any) => (
            <DropdownMenuCheckboxItem
              key={item.id}
              checked={selectedItems.includes(item.name)}
              onCheckedChange={() => toggleSelection(item)}
            >
              {filterName === "Companies" ? (
                <div className="flex items-center">
                  {item.logo ? (
                    <Image
                      src={item.logo}
                      alt={item.name}
                      width={4}
                      height={4}
                      className="w-6 h-6 mr-2 rounded-full"
                    />
                  ) : (
                    <Building2 className="w-6 h-6 mr-2 rounded-full" />
                  )}
                  {item.name}
                </div>
              ) : (
                item.name
              )}
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
