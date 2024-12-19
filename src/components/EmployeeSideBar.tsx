"use client"

import { Home, Users, Mail, BarChart, Settings } from 'lucide-react'
import {
    Sidebar,
    SidebarContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
    SidebarGroupLabel,
    SidebarGroupContent,
    useSidebar
} from "@/components/ui/sidebar"

export function EmployeeSidebar() {

    const { open } = useSidebar()
    return (
        <Sidebar collapsible="icon">
            <SidebarHeader>
                <div className="flex items-center justify-between pt-2 pr-1">
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-md bg-teal-600 text-white grid place-items-center">
                            W
                        </div>
                        {open && <span className="font-semibold hidden lg:inline">Workplace</span>} {/* Add this line */}
                    </div>
                </div>
            </SidebarHeader>
            <SidebarGroupContent>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton tooltip="Dashboard">
                            <Home className="h-4 w-4" />
                            <span>Dashboard</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton isActive tooltip="Employees">
                            <Users className="h-4 w-4" />
                            <span>Employees</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton tooltip="Messages">
                            <Mail className="h-4 w-4" />
                            <span>Messages</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton tooltip="Analytics">
                            <BarChart className="h-4 w-4" />
                            <span>Analytics</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton tooltip="Settings">
                            <Settings className="h-4 w-4" />
                            <span>Settings</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarGroupContent>
            <SidebarRail />
        </Sidebar>
    )
}
