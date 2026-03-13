"use client";

import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { ArrowRight, AlertCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { IncidentStatus, IncidentPriority } from "@/types/domain";

// Mock data - South African names
const recentIncidents = [
  {
    id: "1",
    incidentNumber: "INC-2024-0042",
    title: "Email server not responding",
    status: IncidentStatus.InProgress,
    priority: IncidentPriority.P1,
    assignedTo: { name: "Thabo Mokoena", avatarUrl: "" },
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
  {
    id: "2",
    incidentNumber: "INC-2024-0041",
    title: "VPN connection drops intermittently",
    status: IncidentStatus.Open,
    priority: IncidentPriority.P2,
    assignedTo: { name: "Naledi Dlamini", avatarUrl: "" },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
  {
    id: "3",
    incidentNumber: "INC-2024-0040",
    title: "Printer offline on 3rd floor",
    status: IncidentStatus.Pending,
    priority: IncidentPriority.P3,
    assignedTo: { name: "Kagiso Mabaso", avatarUrl: "" },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
  },
  {
    id: "4",
    incidentNumber: "INC-2024-0039",
    title: "Cannot access shared drive",
    status: IncidentStatus.InProgress,
    priority: IncidentPriority.P2,
    assignedTo: { name: "Nomvula Sithole", avatarUrl: "" },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
  },
  {
    id: "5",
    incidentNumber: "INC-2024-0038",
    title: "Software installation request",
    status: IncidentStatus.New,
    priority: IncidentPriority.P4,
    assignedTo: null,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
  },
];

function getPriorityStyles(priority: IncidentPriority) {
  switch (priority) {
    case IncidentPriority.P1:
      return "bg-red-500/10 text-red-600 border-red-200";
    case IncidentPriority.P2:
      return "bg-orange-500/10 text-orange-600 border-orange-200";
    case IncidentPriority.P3:
      return "bg-purple-500/10 text-purple-600 border-purple-200";
    case IncidentPriority.P4:
      return "bg-green-500/10 text-green-600 border-green-200";
    default:
      return "bg-muted text-muted-foreground";
  }
}

function getStatusStyles(status: IncidentStatus) {
  switch (status) {
    case IncidentStatus.New:
      return "bg-blue-500/10 text-blue-600 border-blue-200";
    case IncidentStatus.Open:
      return "bg-amber-500/10 text-amber-600 border-amber-200";
    case IncidentStatus.InProgress:
      return "bg-purple-500/10 text-purple-600 border-purple-200";
    case IncidentStatus.Pending:
      return "bg-orange-500/10 text-orange-600 border-orange-200";
    case IncidentStatus.Resolved:
      return "bg-green-500/10 text-green-600 border-green-200";
    case IncidentStatus.Closed:
      return "bg-muted text-muted-foreground";
    default:
      return "bg-muted text-muted-foreground";
  }
}

function getPriorityIcon(priority: IncidentPriority) {
  switch (priority) {
    case IncidentPriority.P1:
      return "bg-red-500";
    case IncidentPriority.P2:
      return "bg-orange-500";
    case IncidentPriority.P3:
      return "bg-purple-500";
    case IncidentPriority.P4:
      return "bg-green-500";
    default:
      return "bg-muted";
  }
}

export function RecentIncidents() {
  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-lg font-semibold">Recent Incidents</CardTitle>
          <CardDescription>Latest activity in the system</CardDescription>
        </div>
        <Button variant="ghost" size="sm" asChild className="text-primary hover:text-primary">
          <Link href="/incidents">
            View all
            <ArrowRight className="ml-1 size-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {recentIncidents.map((incident) => (
            <Link
              key={incident.id}
              href={`/incidents/${incident.id}`}
              className="flex items-center gap-4 rounded-xl border p-3 transition-all hover:bg-muted/50 hover:shadow-sm group"
            >
              <div className={`size-2.5 rounded-full ${getPriorityIcon(incident.priority)} ring-4 ring-background`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-primary group-hover:underline">
                    {incident.incidentNumber}
                  </span>
                  <Badge
                    variant="outline"
                    className={`${getPriorityStyles(incident.priority)} text-[10px] px-1.5 py-0 h-5`}
                  >
                    {incident.priority}
                  </Badge>
                  <Badge
                    variant="outline"
                    className={`${getStatusStyles(incident.status)} text-[10px] px-1.5 py-0 h-5`}
                  >
                    {incident.status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground truncate mt-0.5">
                  {incident.title}
                </p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                {incident.assignedTo ? (
                  <Avatar className="size-7 ring-2 ring-background">
                    <AvatarImage
                      src={incident.assignedTo.avatarUrl}
                      alt={incident.assignedTo.name}
                    />
                    <AvatarFallback className="text-[10px] bg-primary/10 text-primary font-medium">
                      {incident.assignedTo.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                ) : (
                  <span className="text-xs text-muted-foreground italic">
                    Unassigned
                  </span>
                )}
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {formatDistanceToNow(new Date(incident.createdAt), {
                    addSuffix: true,
                  })}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
