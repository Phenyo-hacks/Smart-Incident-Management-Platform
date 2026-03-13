"use client";

import Link from "next/link";
import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import {
  MoreHorizontal,
  Eye,
  UserPlus,
  ArrowUpRight,
  CheckCircle,
  XCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IncidentStatus, IncidentPriority } from "@/types/domain";

// Mock data - South African names and details
const mockIncidents = [
  {
    id: "1",
    incidentNumber: "INC-2024-0042",
    title: "Email server not responding",
    status: IncidentStatus.InProgress,
    priority: IncidentPriority.P1,
    category: "Infrastructure",
    assignedTo: { id: "1", name: "Thabo Mokoena", avatarUrl: "" },
    requester: { id: "2", name: "Naledi Dlamini", avatarUrl: "" },
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
  },
  {
    id: "2",
    incidentNumber: "INC-2024-0041",
    title: "VPN connection drops intermittently",
    status: IncidentStatus.Open,
    priority: IncidentPriority.P2,
    category: "Network",
    assignedTo: { id: "3", name: "Sipho Ndlovu", avatarUrl: "" },
    requester: { id: "4", name: "Lerato Molefe", avatarUrl: "" },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
  },
  {
    id: "3",
    incidentNumber: "INC-2024-0040",
    title: "Printer offline on 3rd floor",
    status: IncidentStatus.Pending,
    priority: IncidentPriority.P3,
    category: "Hardware",
    assignedTo: { id: "5", name: "Kagiso Mabaso", avatarUrl: "" },
    requester: { id: "6", name: "Zanele Khumalo", avatarUrl: "" },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
  },
  {
    id: "4",
    incidentNumber: "INC-2024-0039",
    title: "Cannot access shared drive",
    status: IncidentStatus.InProgress,
    priority: IncidentPriority.P2,
    category: "Access",
    assignedTo: { id: "7", name: "Nomvula Sithole", avatarUrl: "" },
    requester: { id: "8", name: "Bongani Zulu", avatarUrl: "" },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
  },
  {
    id: "5",
    incidentNumber: "INC-2024-0038",
    title: "Software installation request",
    status: IncidentStatus.New,
    priority: IncidentPriority.P4,
    category: "Software",
    assignedTo: null,
    requester: { id: "9", name: "Palesa Mahlangu", avatarUrl: "" },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
  },
  {
    id: "6",
    incidentNumber: "INC-2024-0037",
    title: "Application crashes on startup",
    status: IncidentStatus.Resolved,
    priority: IncidentPriority.P2,
    category: "Software",
    assignedTo: { id: "1", name: "Thabo Mokoena", avatarUrl: "" },
    requester: { id: "10", name: "Mandla Nkosi", avatarUrl: "" },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
  },
];

function getPriorityStyles(priority: IncidentPriority) {
  switch (priority) {
    case IncidentPriority.P1:
      return "bg-red-500/10 text-red-600 border-red-200 dark:border-red-800";
    case IncidentPriority.P2:
      return "bg-orange-500/10 text-orange-600 border-orange-200 dark:border-orange-800";
    case IncidentPriority.P3:
      return "bg-amber-500/10 text-amber-600 border-amber-200 dark:border-amber-800";
    case IncidentPriority.P4:
      return "bg-green-500/10 text-green-600 border-green-200 dark:border-green-800";
    default:
      return "bg-muted text-muted-foreground";
  }
}

function getStatusStyles(status: IncidentStatus) {
  switch (status) {
    case IncidentStatus.New:
      return "bg-blue-500/10 text-blue-600 border-blue-200 dark:border-blue-800";
    case IncidentStatus.Open:
      return "bg-amber-500/10 text-amber-600 border-amber-200 dark:border-amber-800";
    case IncidentStatus.InProgress:
      return "bg-purple-500/10 text-purple-600 border-purple-200 dark:border-purple-800";
    case IncidentStatus.Pending:
      return "bg-orange-500/10 text-orange-600 border-orange-200 dark:border-orange-800";
    case IncidentStatus.Resolved:
      return "bg-green-500/10 text-green-600 border-green-200 dark:border-green-800";
    case IncidentStatus.Closed:
      return "bg-muted text-muted-foreground border-border";
    default:
      return "bg-muted text-muted-foreground border-border";
  }
}

export function IncidentList() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState("10");
  const totalItems = 42;
  const totalPages = Math.ceil(totalItems / parseInt(itemsPerPage));

  return (
    <div className="space-y-4">
      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30 hover:bg-muted/30">
              <TableHead className="w-12">
                <Checkbox />
              </TableHead>
              <TableHead className="font-semibold">Incident</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold">Priority</TableHead>
              <TableHead className="font-semibold">Category</TableHead>
              <TableHead className="font-semibold">Assigned To</TableHead>
              <TableHead className="font-semibold">Requester</TableHead>
              <TableHead className="font-semibold">Created</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockIncidents.map((incident) => (
              <TableRow key={incident.id} className="group">
                <TableCell>
                  <Checkbox />
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <Link
                      href={`/incidents/${incident.id}`}
                      className="font-semibold text-primary hover:underline"
                    >
                      {incident.incidentNumber}
                    </Link>
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {incident.title}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={`${getStatusStyles(incident.status)} font-medium`}
                  >
                    {incident.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={`${getPriorityStyles(incident.priority)} font-medium`}
                  >
                    {incident.priority}
                  </Badge>
                </TableCell>
                <TableCell>
                  <span className="text-sm">{incident.category}</span>
                </TableCell>
                <TableCell>
                  {incident.assignedTo ? (
                    <div className="flex items-center gap-2">
                      <Avatar className="size-7 ring-2 ring-background">
                        <AvatarImage
                          src={incident.assignedTo.avatarUrl}
                          alt={incident.assignedTo.name}
                        />
                        <AvatarFallback className="text-xs bg-primary/10 text-primary">
                          {incident.assignedTo.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium">{incident.assignedTo.name}</span>
                    </div>
                  ) : (
                    <span className="text-sm text-muted-foreground italic">
                      Unassigned
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="size-7 ring-2 ring-background">
                      <AvatarImage
                        src={incident.requester.avatarUrl}
                        alt={incident.requester.name}
                      />
                      <AvatarFallback className="text-xs bg-accent/20 text-accent-foreground">
                        {incident.requester.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{incident.requester.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {formatDistanceToNow(new Date(incident.createdAt), {
                    addSuffix: true,
                  })}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="size-8 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <MoreHorizontal className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48 rounded-xl">
                      <DropdownMenuItem asChild className="cursor-pointer">
                        <Link href={`/incidents/${incident.id}`}>
                          <Eye className="mr-2 size-4" />
                          View Details
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer">
                        <UserPlus className="mr-2 size-4" />
                        Assign
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer">
                        <ArrowUpRight className="mr-2 size-4" />
                        Escalate
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="cursor-pointer">
                        <CheckCircle className="mr-2 size-4" />
                        Resolve
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive cursor-pointer">
                        <XCircle className="mr-2 size-4" />
                        Cancel
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Modern Pagination */}
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Items per page</span>
          <Select value={itemsPerPage} onValueChange={setItemsPerPage}>
            <SelectTrigger className="w-[70px] h-8 rounded-lg">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </span>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="size-8 rounded-lg"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="size-4" />
            </Button>
            {[1, 2, 3].map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="icon"
                className="size-8 rounded-lg"
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </Button>
            ))}
            {totalPages > 4 && (
              <>
                <span className="px-1 text-muted-foreground">...</span>
                <Button
                  variant="outline"
                  size="icon"
                  className="size-8 rounded-lg"
                  onClick={() => setCurrentPage(totalPages)}
                >
                  {totalPages}
                </Button>
              </>
            )}
            <Button
              variant="outline"
              size="icon"
              className="size-8 rounded-lg"
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
