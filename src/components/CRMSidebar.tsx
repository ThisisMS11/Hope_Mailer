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
  useSidebar,
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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

function NavItem({ item, active }: { item: typeof navGroups[0]["items"][0]; active: boolean }) {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  const link = (
    <Link
      href={item.href}
      className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-150 w-full ${
        active
          ? "bg-violet-500/15 text-violet-700 dark:bg-violet-400/10 dark:text-violet-300 shadow-sm"
          : "text-gray-600 dark:text-gray-400 hover:bg-white/60 dark:hover:bg-white/[0.05] hover:text-gray-900 dark:hover:text-gray-200"
      } ${collapsed ? "justify-center px-2" : ""}`}
    >
      <item.icon
        className={`h-4 w-4 shrink-0 ${
          active ? "text-violet-600 dark:text-violet-400" : "text-gray-400 dark:text-gray-500"
        }`}
      />
      {!collapsed && <span>{item.name}</span>}
    </Link>
  );

  if (collapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{link}</TooltipTrigger>
        <TooltipContent side="right" className="text-xs">{item.name}</TooltipContent>
      </Tooltip>
    );
  }

  return link;
}

export default function CRMSidebar() {
  const { user, requestLogout } = useAuth();
  const { state } = useSidebar();
  const pathname = usePathname();
  const collapsed = state === "collapsed";

  const isActive = (href: string) =>
    href === "/dashboard" ? pathname === href : pathname.startsWith(href);

  return (
    <TooltipProvider delayDuration={200}>
      <Sidebar collapsible="icon">
        {/* Header */}
        <SidebarHeader className={`py-4 border-b border-white/50 dark:border-white/[0.06] ${collapsed ? "px-2" : "px-4"}`}>
          <div className={`flex items-center gap-2.5 ${collapsed ? "justify-center" : ""}`}>
            <div className="w-7 h-7 rounded-lg bg-violet-600 flex items-center justify-center shrink-0 shadow-md shadow-violet-500/30">
              <Mail className="w-3.5 h-3.5 text-white" />
            </div>
            {!collapsed && (
              <span className="font-bold text-sm tracking-tight text-gray-800 dark:text-gray-100">
                Syncmate
              </span>
            )}
          </div>
        </SidebarHeader>

        {/* Nav */}
        <SidebarContent className={`py-3 gap-1 ${collapsed ? "px-1" : "px-2"}`}>
          {navGroups.map((group) => (
            <SidebarGroup key={group.label} className="p-0 mb-3">
              {!collapsed && (
                <SidebarGroupLabel className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-600 px-2 mb-1">
                  {group.label}
                </SidebarGroupLabel>
              )}
              <SidebarGroupContent>
                <SidebarMenu>
                  {group.items.map((item) => (
                    <SidebarMenuItem key={item.name}>
                      <SidebarMenuButton asChild className="h-auto p-0 hover:bg-transparent">
                        <NavItem item={item} active={isActive(item.href)} />
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))}
        </SidebarContent>

        {/* Footer */}
        <SidebarFooter className={`py-3 border-t border-white/50 dark:border-white/[0.06] ${collapsed ? "px-1" : "px-2"}`}>
          <SidebarMenu>
            <SidebarMenuItem>
              {collapsed ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex justify-center py-1">
                      <div className="w-7 h-7 rounded-full bg-violet-100 dark:bg-violet-900/40 flex items-center justify-center">
                        <User className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400" />
                      </div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="text-xs">{user?.username ?? "Account"}</TooltipContent>
                </Tooltip>
              ) : (
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
              )}
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
    </TooltipProvider>
  );
}
