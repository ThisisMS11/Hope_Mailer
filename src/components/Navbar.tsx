import React from "react";
import { Button } from "@/components/ui/button";
//@ts-ignore
import { Bell } from "lucide-react";
import ThemeToggler from "@/components/ThemeToggler";

const Navbar = () => {
  return (
    <div className={"w-full bg-sidebar"}>
      <div className={"flex justify-between items-center p-2"}>
        <h1 className={"text-lg font-semibold"}>Opportunities Details</h1>
        <div className={"flex gap-4"}>
          <ThemeToggler />
          <Button>
            <Bell className={"w-8 h-8"} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
