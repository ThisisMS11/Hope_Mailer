"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  ChevronUp,
  Mail,
  User,
  BookDashed,
  File,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/imports/Shadcn_imports";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useAuth } from "@/features/authentication/hooks/useAuth";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navGroups = [
  {
    label: "Overview",
    items: [
      { name: "Dashboard", icon: Mail, href: "/dashboard" },
    ],
  },
  {
    label: "Contacts",
    items: [
      { name: "Contacts", icon: User, href: "/dashboard/contacts" },
    ],
  },
  {
    label: "Email",
    items: [
      { name: "Email Records", icon: Mail, href: "/dashboard/emails/records" },
      { name: "Templates", icon: BookDashed, href: "/dashboard/emails/templates" },
    ],
  },
  {
    label: "Files",
    items: [
      { name: "Files", icon: File, href: "/dashboard/files" },
    ],
  },
];

export default function CRMSidebar() {
  const { user, requestLogout } = useAuth();
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/dashboard" ? pathname === href : pathname.startsWith(href);

  return (
    <Sidebar>
      {/* Header */}
      <SidebarHeader className="px-4 py-4 border-b border-white/50 dark:border-white/[0.06]">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-violet-600 flex items-center justify-center shrink-0 shadow-md shadow-violet-500/30">
            <Mail className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-bold text-sm tracking-tight text-gray-800 dark:text-gray-100">
            HopeMailer
          </span>
        </div>
      </SidebarHeader>

      {/* Nav */}
      <SidebarContent className="px-2 py-3 gap-1">
        {navGroups.map((group) => (
          <SidebarGroup key={group.label} className="p-0 mb-3">
            <SidebarGroupLabel className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-600 px-2 mb-1">
              {group.label}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton asChild>
                      <Link
                        href={item.href}
                        className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-150 ${
                          isActive(item.href)
                            ? "bg-violet-500/15 text-violet-700 dark:bg-violet-400/10 dark:text-violet-300 shadow-sm"
                            : "text-gray-600 dark:text-gray-400 hover:bg-white/60 dark:hover:bg-white/[0.05] hover:text-gray-900 dark:hover:text-gray-200"
                        }`}
                      >
                        <item.icon
                          className={`h-4 w-4 shrink-0 ${
                            isActive(item.href)
                              ? "text-violet-600 dark:text-violet-400"
                              : "text-gray-400 dark:text-gray-500"
                          }`}
                        />
                        <span>{item.name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="px-2 py-3 border-t border-white/50 dark:border-white/[0.06]">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-white/60 dark:hover:bg-white/[0.05] transition-all">
                  <div className="w-7 h-7 rounded-full bg-violet-100 dark:bg-violet-900/40 flex items-center justify-center shrink-0">
                    <User className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400" />
                  </div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate flex-1">
                    {user?.username ?? "N/A"}
                  </span>
                  <ChevronUp className="w-3.5 h-3.5 text-gray-400 dark:text-gray-600 shrink-0" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-[--radix-popper-anchor-width] bg-white/70 dark:bg-gray-900/70 backdrop-blur-md border border-white/60 dark:border-white/[0.08]"
              >
                <DropdownMenuItem
                  onClick={requestLogout.mutate as () => void}
                  className="text-sm text-red-500 dark:text-red-400 cursor-pointer"
                >
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
