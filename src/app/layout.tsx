import type { Metadata } from "next";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { EmployeeSidebar } from "@/components/EmployeeSideBar";
// import ThemeToggler from "@/components/ThemeToggler";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "HopeMailer",
  description: "Mail like a pro",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={cn(inter.className, "min-h-screen")}>
        <Toaster />
        <SidebarProvider>
          <div className="flex min-h-screen w-full">
            <EmployeeSidebar />
            <Providers>
              <main className="flex-1">
                <div className="p-4">
                  <SidebarTrigger />
                  {/* <ThemeToggler /> */}

                  {children}
                </div>
              </main>
            </Providers>
          </div>
        </SidebarProvider>
      </body>
    </html>
  );
}
