"use client";
import { useEffect } from "react";
import { Home, LayoutTemplate } from "lucide-react";
import { useRouter } from "next/navigation";
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

const sideBarOptions = [
  {
    name: "Dashboard",
    url: "/dashboard",
    icon: <Home className="h-4 w-4" />,
  },
  {
    name: "Templates",
    url: "/templates",
    icon: <LayoutTemplate className="h-4 w-4" />,
  },
];

export function EmployeeSidebar() {
  const { open, setOpen } = useSidebar();
  const router = useRouter();

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
          </div>
        </div>
      </SidebarHeader>
      <SidebarGroupContent>
        <SidebarMenu>
          {sideBarOptions.map((option, index) => {
            return (
              <SidebarMenuItem className="flex justify-center" key={index}>
                <SidebarMenuButton
                  tooltip={option.name}
                  className="pl-4"
                  onClick={() => {
                    router.push(option.url);
                  }}
                >
                  {option.icon}
                  <span>{option.name}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
      <SidebarRail />
    </Sidebar>
  );
}
