"use client";
import { useEffect } from "react";
import { Home } from "lucide-react";
import {
  Sidebar,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarGroupContent,
  useSidebar,
} from "@/components/ui/sidebar";

export function EmployeeSidebar() {
  const { open, setOpen } = useSidebar();

  useEffect(() => {
    setOpen(false);
  }, []);

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center justify-between pt-2 pr-1">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-md bg-teal-600 text-white grid place-items-center">
              W
            </div>
            {open && (
              <span className="font-semibold hidden lg:inline">Workplace</span>
            )}{" "}
            {/* Add this line */}
          </div>
        </div>
      </SidebarHeader>
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem className="flex justify-center">
            <SidebarMenuButton tooltip="Dashboard" className="pl-4">
              <Home className="h-4 w-4" />
              <span>Dashboard</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
      <SidebarRail />
    </Sidebar>
  );
}
