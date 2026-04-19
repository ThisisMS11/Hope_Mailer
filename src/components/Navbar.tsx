import React from "react";
import { Button } from "@/components/ui/button";
//@ts-ignore
import { Bell } from "lucide-react";
import ThemeToggler from "@/components/ThemeToggler";

const Navbar = () => {
  return (
    <div className={"w-full bg-white/40 dark:bg-transparent backdrop-blur-md border-b border-white/60 dark:border-white/[0.06]"}>
      <div className={"flex justify-end items-center p-2"}>
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
