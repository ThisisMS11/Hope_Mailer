"use client";
import React from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import CRMSidebar from "@/components/CRMSidebar";
import { NavigationProvider } from "@/context/NavigationContext";
import Navbar from "@/components/Navbar";

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
          <SidebarTrigger className={"mt-3"} />
          <div className="flex-1 flex flex-col">
            <Navbar />
            <div className="flex-1 p-2">{children}</div>
          </div>
        </SidebarProvider>
      </NavigationProvider>
    </div>
  );
}
