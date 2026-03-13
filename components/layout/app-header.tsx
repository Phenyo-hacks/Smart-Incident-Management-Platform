"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  Moon,
  Search,
  Sun,
  X,
  AlertCircle,
  CheckCircle,
  Clock,
  MessageSquare,
} from "lucide-react";
import { useTheme } from "next-themes";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";

// Mock notifications
const mockNotifications = [
  {
    id: "1",
    type: "assigned",
    title: "New incident assigned",
    message: "INC-2024-0042 has been assigned to you",
    time: "5 min ago",
    read: false,
  },
  {
    id: "2",
    type: "sla",
    title: "SLA Warning",
    message: "INC-2024-0039 is approaching SLA breach",
    time: "15 min ago",
    read: false,
  },
  {
    id: "3",
    type: "resolved",
    title: "Incident resolved",
    message: "INC-2024-0038 has been resolved",
    time: "1 hour ago",
    read: true,
  },
  {
    id: "4",
    type: "comment",
    title: "New comment",
    message: "Jane added a comment to INC-2024-0037",
    time: "2 hours ago",
    read: true,
  },
];

// Route to breadcrumb mapping
const routeToBreadcrumb: Record<string, { label: string; href?: string }[]> = {
  "/dashboard": [{ label: "Dashboard" }],
  "/incidents": [{ label: "Incidents" }],
  "/incidents/new": [
    { label: "Incidents", href: "/incidents" },
    { label: "Create New" },
  ],
  "/incidents/my-incidents": [
    { label: "Incidents", href: "/incidents" },
    { label: "My Incidents" },
  ],
  "/incidents/assigned": [
    { label: "Incidents", href: "/incidents" },
    { label: "Assigned to Me" },
  ],
  "/analytics": [{ label: "Analytics" }],
  "/analytics/sla": [
    { label: "Analytics", href: "/analytics" },
    { label: "SLA Compliance" },
  ],
  "/analytics/performance": [
    { label: "Analytics", href: "/analytics" },
    { label: "Agent Performance" },
  ],
  "/admin/categories": [
    { label: "Administration" },
    { label: "Categories" },
  ],
  "/admin/groups": [
    { label: "Administration" },
    { label: "Support Groups" },
  ],
  "/admin/users": [{ label: "Administration" }, { label: "Users" }],
  "/admin/sla": [{ label: "Administration" }, { label: "SLA Policies" }],
  "/admin/routing": [
    { label: "Administration" },
    { label: "Routing Rules" },
  ],
  "/admin/roles": [
    { label: "Administration" },
    { label: "Roles & Permissions" },
  ],
};

function NotificationIcon({ type }: { type: string }) {
  switch (type) {
    case "assigned":
      return <AlertCircle className="size-4 text-blue-500" />;
    case "sla":
      return <Clock className="size-4 text-amber-500" />;
    case "resolved":
      return <CheckCircle className="size-4 text-green-500" />;
    case "comment":
      return <MessageSquare className="size-4 text-muted-foreground" />;
    default:
      return <Bell className="size-4" />;
  }
}

export function AppHeader() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [searchOpen, setSearchOpen] = useState(false);

  const breadcrumbs = routeToBreadcrumb[pathname] || [{ label: "Dashboard" }];
  const unreadCount = mockNotifications.filter((n) => !n.read).length;

  return (
    <>
      <header className="sticky top-0 z-50 flex h-14 items-center gap-4 border-b bg-background px-4">
        <SidebarTrigger />
        <Separator orientation="vertical" className="h-6" />

        {/* Breadcrumbs */}
        <Breadcrumb className="hidden md:flex">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/dashboard">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            {breadcrumbs.map((crumb, index) => (
              <span key={index} className="contents">
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  {crumb.href ? (
                    <BreadcrumbLink asChild>
                      <Link href={crumb.href}>{crumb.label}</Link>
                    </BreadcrumbLink>
                  ) : (
                    <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                  )}
                </BreadcrumbItem>
              </span>
            ))}
          </BreadcrumbList>
        </Breadcrumb>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Search */}
        <Button
          variant="outline"
          className="relative h-9 w-9 p-0 md:h-9 md:w-64 md:justify-start md:px-3 md:py-2"
          onClick={() => setSearchOpen(true)}
        >
          <Search className="size-4 md:mr-2" />
          <span className="hidden md:inline-flex text-muted-foreground">
            Search incidents...
          </span>
          <kbd className="pointer-events-none absolute right-2 top-1/2 hidden h-5 -translate-y-1/2 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 md:flex">
            <span className="text-xs">Ctrl</span>K
          </kbd>
        </Button>

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="size-4" />
              {unreadCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -right-1 -top-1 size-5 rounded-full p-0 text-xs flex items-center justify-center"
                >
                  {unreadCount}
                </Badge>
              )}
              <span className="sr-only">Notifications</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel className="flex items-center justify-between">
              <span>Notifications</span>
              <Button variant="ghost" size="sm" className="h-auto p-0 text-xs">
                Mark all as read
              </Button>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <ScrollArea className="h-72">
              {mockNotifications.map((notification) => (
                <DropdownMenuItem
                  key={notification.id}
                  className="flex items-start gap-3 p-3 cursor-pointer"
                >
                  <NotificationIcon type={notification.type} />
                  <div className="flex-1 space-y-1">
                    <p
                      className={`text-sm leading-none ${
                        !notification.read ? "font-medium" : ""
                      }`}
                    >
                      {notification.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {notification.message}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {notification.time}
                    </p>
                  </div>
                  {!notification.read && (
                    <div className="size-2 rounded-full bg-blue-500" />
                  )}
                </DropdownMenuItem>
              ))}
            </ScrollArea>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild className="justify-center">
              <Link href="/notifications">View all notifications</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          <Sun className="size-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute size-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </header>

      {/* Command Dialog for Search */}
      <CommandDialog open={searchOpen} onOpenChange={setSearchOpen}>
        <CommandInput placeholder="Search incidents, users, or categories..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Recent Incidents">
            <CommandItem>
              <AlertCircle className="mr-2 size-4" />
              <span>INC-2024-0042 - Email server not responding</span>
            </CommandItem>
            <CommandItem>
              <AlertCircle className="mr-2 size-4" />
              <span>INC-2024-0041 - VPN connection issues</span>
            </CommandItem>
            <CommandItem>
              <AlertCircle className="mr-2 size-4" />
              <span>INC-2024-0040 - Printer offline on 3rd floor</span>
            </CommandItem>
          </CommandGroup>
          <CommandGroup heading="Quick Actions">
            <CommandItem onSelect={() => setSearchOpen(false)}>
              <Link href="/incidents/new" className="flex items-center">
                Create new incident
              </Link>
            </CommandItem>
            <CommandItem>View my assigned incidents</CommandItem>
            <CommandItem>View SLA breaches</CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
