import type { Metadata } from "next";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { EmployeeSidebar } from "@/components/EmployeeSideBar"
import { cn } from "@/lib/utils"
import { Inter } from 'next/font/google'
import "./globals.css";


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "LiveMe",
  description: "Will make you go live.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={cn(inter.className, "min-h-screen")}>
        <SidebarProvider>
          <div className="flex min-h-screen w-full">
            <EmployeeSidebar />
            <main className="flex-1">
              <div className="p-4">
                <SidebarTrigger />
                {children}
              </div>
            </main>
          </div>
        </SidebarProvider>
      </body>
    </html>
  )
}
