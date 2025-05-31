"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  ChevronDown,
  ChevronUp,
  Mail,
  Plus,
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
import Image from "next/image";
import { useAuth } from "@/features/authentication/hooks/useAuth";
import Link from "next/link";
import { usePathname } from "next/navigation";

const projects = [
  {
    name: "Contacts",
    icon: User,
    href: "/dashboard/contacts",
  },
];

export default function CRMSidebar() {
  const { user } = useAuth();
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <Image
                    src="/logo.png"
                    alt="Logo not found"
                    width={200}
                    height={0}
                    className=" h-auto w-auto max-w-full "
                  />
                  <ChevronDown className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[--radix-popper-anchor-width]">
                <DropdownMenuItem>
                  <span>Mohit Saini</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className={"font-open-sans"}>
            Contacts
          </SidebarGroupLabel>
          <SidebarGroupAction title="Add Project">
            <Plus /> <span className="sr-only">Add Project</span>
          </SidebarGroupAction>
          <SidebarGroupContent>
            <SidebarMenu>
              {projects.map((project) => (
                <SidebarMenuItem key={project.name} className="border-b-1">
                  <SidebarMenuButton asChild>
                    <Link
                      href={project.href}
                      className={
                        pathname === project.href
                          ? "bg-muted text-primary font-medium rounded-md"
                          : ""
                      }
                    >
                      <project.icon className="h-4 w-4 mr-2" />
                      <span>{project.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Email</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem className="border-b-1">
                <SidebarMenuButton asChild>
                  <Link
                    href="/dashboard/emails/records"
                    className={
                      pathname === "/dashboard/emails"
                        ? "bg-muted text-primary font-medium rounded-md"
                        : ""
                    }
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    <span>Email Records</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem className="border-b-1">
                <SidebarMenuButton asChild>
                  <Link
                    href="/dashboard/emails/templates"
                    className={
                      pathname === "/dashboard/emails/templates"
                        ? "bg-muted text-primary font-medium rounded-md"
                        : ""
                    }
                  >
                    <BookDashed className="h-4 w-4 mr-2" />
                    <span>Templates</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Files</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem className="border-b-1">
                <SidebarMenuButton asChild>
                  <Link
                    href="/dashboard/files"
                    className={
                      pathname === "/dashboard/files"
                        ? "bg-muted text-primary font-medium rounded-md"
                        : ""
                    }
                  >
                    <File className="h-4 w-4 mr-2" />
                    <span>Files</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <User /> {user ? user?.username : "N/A"}
                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-[--radix-popper-anchor-width]"
              >
                <DropdownMenuItem>
                  <span>Account</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span>Billing</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
