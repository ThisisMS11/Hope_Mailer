"use client";
import React from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import CRMSidebar from "@/components/CRMSidebar";
import { NavigationProvider } from "@/context/NavigationContext";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactElement;
}) {
  return (
    <div>
      <NavigationProvider>
        <SidebarProvider>
          <CRMSidebar />
          <SidebarTrigger />
          {children}
        </SidebarProvider>
      </NavigationProvider>
    </div>
  );
}
