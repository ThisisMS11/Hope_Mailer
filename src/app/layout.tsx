import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";
import { Inter as FontSans } from "next/font/google";
import { Open_Sans } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";

// Default font for shadcn/ui (usually Inter)
const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans", // This variable is used by shadcn/ui
});

// Your custom font: Open Sans
// Import all the weights you plan to use.
const fontOpenSans = Open_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"], // Specify all desired weights
  style: ["normal", "italic"], // Specify normal and italic styles
  display: "swap",
  variable: "--font-open-sans", // A new CSS variable for Open Sans
});

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
      <body
        className={cn(
          fontSans.className,
          fontOpenSans.className,
          "min-h-screen",
        )}
      >
        <Toaster />
        <div className="flex min-h-screen w-full">
          <Providers>
            <main className="flex-1">
              <div className="p-4">
                {/* <ThemeToggler /> */}
                {children}
              </div>
            </main>
          </Providers>
        </div>
      </body>
    </html>
  );
}
