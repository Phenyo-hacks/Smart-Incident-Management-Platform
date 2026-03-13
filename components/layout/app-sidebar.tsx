"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  AlertCircle,
  BarChart3,
  Bell,
  ChevronRight,
  Clock,
  FolderKanban,
  Gauge,
  LayoutDashboard,
  LogOut,
  Plus,
  Route,
  Settings,
  Shield,
  ShieldCheck,
  Users,
  UserCog,
} from "lucide-react";
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
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

// Mock user data - South African
const mockUser = {
  name: "Thabo Mokoena",
  email: "thabo.mokoena@simp.co.za",
  role: "Admin",
  avatarUrl: "",
  phone: "+27 82 456 7890",
};

// Navigation structure
const navigation = [
  {
    label: "Main",
    items: [
      {
        title: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
      },
      {
        title: "My Incidents",
        href: "/incidents/my-incidents",
        icon: FolderKanban,
        badge: "3",
      },
    ],
  },
  {
    label: "Incidents",
    items: [
      {
        title: "All Incidents",
        href: "/incidents",
        icon: AlertCircle,
      },
      {
        title: "Assigned to Me",
        href: "/incidents/assigned",
        icon: Users,
        badge: "5",
      },
      {
        title: "Create New",
        href: "/incidents/new",
        icon: Plus,
      },
    ],
  },
  {
    label: "Analytics",
    items: [
      {
        title: "Overview",
        href: "/analytics",
        icon: BarChart3,
      },
      {
        title: "SLA Compliance",
        href: "/analytics/sla",
        icon: Clock,
      },
      {
        title: "Agent Performance",
        href: "/analytics/performance",
        icon: Gauge,
      },
    ],
  },
  {
    label: "Administration",
    items: [
      {
        title: "Categories",
        href: "/admin/categories",
        icon: FolderKanban,
      },
      {
        title: "Support Groups",
        href: "/admin/groups",
        icon: Users,
      },
      {
        title: "Users",
        href: "/admin/users",
        icon: UserCog,
      },
      {
        title: "SLA Policies",
        href: "/admin/sla",
        icon: ShieldCheck,
      },
      {
        title: "Routing Rules",
        href: "/admin/routing",
        icon: Route,
      },
      {
        title: "Roles & Permissions",
        href: "/admin/roles",
        icon: Shield,
      },
    ],
  },
];

export function AppSidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <Sidebar collapsible="icon" className="border-r-0">
      <SidebarHeader className="border-b border-sidebar-border/50 px-4 py-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild className="hover:bg-sidebar-accent/50">
              <Link href="/dashboard">
                <div className="flex aspect-square size-9 items-center justify-center rounded-xl bg-white/10 text-sidebar-foreground backdrop-blur-sm">
                  <AlertCircle className="size-5" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-bold text-lg tracking-tight">SIMP</span>
                  <span className="text-[11px] text-sidebar-foreground/70">
                    Incident Management
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="px-2 py-4">
        {navigation.map((section) => (
          <SidebarGroup key={section.label} className="mb-2">
            <SidebarGroupLabel className="text-[11px] uppercase tracking-wider text-sidebar-foreground/50 font-medium px-3 mb-1">
              {section.label}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {section.items.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive(item.href)}
                      tooltip={item.title}
                      className="h-10 rounded-lg transition-all duration-200 hover:bg-sidebar-accent/50 data-[active=true]:bg-white/15 data-[active=true]:shadow-sm"
                    >
                      <Link href={item.href} className="flex items-center gap-3">
                        <item.icon className="size-[18px] shrink-0" />
                        <span className="font-medium text-[13px]">{item.title}</span>
                        {item.badge && (
                          <Badge
                            className="ml-auto h-5 min-w-5 bg-white/20 text-sidebar-foreground text-[10px] font-semibold border-0 px-1.5"
                          >
                            {item.badge}
                          </Badge>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border/50 p-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton 
                  size="lg" 
                  className="h-14 rounded-xl hover:bg-sidebar-accent/50 transition-all duration-200"
                >
                  <Avatar className="size-9 ring-2 ring-white/20">
                    <AvatarImage src={mockUser.avatarUrl} alt={mockUser.name} />
                    <AvatarFallback className="bg-white/20 text-sidebar-foreground text-sm font-semibold">
                      {mockUser.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col gap-0.5 leading-none text-left">
                    <span className="font-semibold text-[13px]">{mockUser.name}</span>
                    <span className="text-[11px] text-sidebar-foreground/70">
                      {mockUser.role}
                    </span>
                  </div>
                  <ChevronRight className="ml-auto size-4 text-sidebar-foreground/50" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="right"
                align="end"
                className="w-56 rounded-xl"
              >
                <div className="px-3 py-2 border-b">
                  <p className="font-medium text-sm">{mockUser.name}</p>
                  <p className="text-xs text-muted-foreground">{mockUser.email}</p>
                </div>
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link href="/profile">
                    <Users className="mr-2 size-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link href="/settings">
                    <Settings className="mr-2 size-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link href="/notifications">
                    <Bell className="mr-2 size-4" />
                    Notifications
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive cursor-pointer">
                  <LogOut className="mr-2 size-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
