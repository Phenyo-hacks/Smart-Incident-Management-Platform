"use client";

import { useState } from "react";
import Link from "next/link";
import { formatDistanceToNow, format } from "date-fns";
import {
  ArrowLeft,
  Clock,
  User,
  Calendar,
  Paperclip,
  MessageSquare,
  History,
  AlertTriangle,
  CheckCircle,
  XCircle,
  ArrowUpRight,
  UserPlus,
  Edit,
  MoreHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IncidentStatus, IncidentPriority, SLABreachStatus } from "@/types/domain";

// Mock incident data
const mockIncident = {
  id: "1",
  incidentNumber: "INC-2024-0042",
  title: "Email server not responding",
  description:
    "Users are unable to send or receive emails. The email server appears to be down. Multiple users have reported this issue starting around 9:00 AM. The issue affects all departments.\n\nSteps to reproduce:\n1. Open email client\n2. Try to send or receive emails\n3. Connection timeout occurs",
  status: IncidentStatus.InProgress,
  priority: IncidentPriority.P1,
  category: { id: "1", name: "Infrastructure" },
  subcategory: { id: "1", name: "Email" },
  impact: "High",
  urgency: "High",
  requester: {
    id: "1",
    name: "Alice Johnson",
    email: "alice.johnson@company.com",
    avatarUrl: "",
    department: "Sales",
  },
  assignedTo: {
    id: "2",
    name: "John Doe",
    email: "john.doe@company.com",
    avatarUrl: "",
  },
  assignedGroup: { id: "1", name: "IT Infrastructure" },
  createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  updatedAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
  slaTarget: {
    targetResponseTime: new Date(
      Date.now() - 1000 * 60 * 60 + 1000 * 60 * 30
    ).toISOString(),
    targetResolutionTime: new Date(
      Date.now() + 1000 * 60 * 60 * 2
    ).toISOString(),
    breachStatus: SLABreachStatus.AtRisk,
  },
  firstResponseAt: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
  comments: [
    {
      id: "1",
      content:
        "I've started investigating the issue. Initial checks show the email server service is running but not responding to connections.",
      author: { id: "2", name: "John Doe", avatarUrl: "" },
      isInternal: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    },
    {
      id: "2",
      content:
        "Found the root cause - disk space is full on the email server. Clearing old logs now.",
      author: { id: "2", name: "John Doe", avatarUrl: "" },
      isInternal: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    },
  ],
  attachments: [
    {
      id: "1",
      fileName: "error_screenshot.png",
      fileUrl: "#",
      fileSizeBytes: 245000,
      contentType: "image/png",
      uploadedAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    },
  ],
  history: [
    {
      id: "1",
      action: "Created",
      performedBy: { id: "1", name: "Alice Johnson" },
      performedAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    },
    {
      id: "2",
      action: "Assigned",
      field: "assignedTo",
      newValue: "John Doe",
      performedBy: { id: "3", name: "System" },
      performedAt: new Date(Date.now() - 1000 * 60 * 115).toISOString(),
    },
    {
      id: "3",
      action: "Status Changed",
      field: "status",
      oldValue: "New",
      newValue: "In Progress",
      performedBy: { id: "2", name: "John Doe" },
      performedAt: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    },
  ],
};

function getPriorityColor(priority: IncidentPriority) {
  switch (priority) {
    case IncidentPriority.P1:
      return "destructive";
    case IncidentPriority.P2:
      return "default";
    case IncidentPriority.P3:
      return "secondary";
    case IncidentPriority.P4:
      return "outline";
    default:
      return "secondary";
  }
}

function getStatusColor(status: IncidentStatus) {
  switch (status) {
    case IncidentStatus.New:
      return "bg-blue-500/10 text-blue-500 border-blue-500/20";
    case IncidentStatus.Open:
      return "bg-amber-500/10 text-amber-500 border-amber-500/20";
    case IncidentStatus.InProgress:
      return "bg-purple-500/10 text-purple-500 border-purple-500/20";
    case IncidentStatus.Pending:
      return "bg-orange-500/10 text-orange-500 border-orange-500/20";
    case IncidentStatus.Resolved:
      return "bg-green-500/10 text-green-500 border-green-500/20";
    case IncidentStatus.Closed:
      return "bg-muted text-muted-foreground border-muted";
    default:
      return "bg-muted text-muted-foreground border-muted";
  }
}

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function IncidentDetail({ incidentId }: { incidentId: string }) {
  const [comment, setComment] = useState("");
  const [isInternal, setIsInternal] = useState(false);

  const incident = mockIncident;

  // Calculate SLA progress
  const now = new Date();
  const targetResolution = new Date(incident.slaTarget.targetResolutionTime);
  const created = new Date(incident.createdAt);
  const totalTime = targetResolution.getTime() - created.getTime();
  const elapsed = now.getTime() - created.getTime();
  const slaProgress = Math.min(100, (elapsed / totalTime) * 100);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/incidents">
                <ArrowLeft className="size-4" />
              </Link>
            </Button>
            <h1 className="text-2xl font-bold">{incident.incidentNumber}</h1>
            <Badge variant={getPriorityColor(incident.priority)}>
              {incident.priority}
            </Badge>
            <Badge
              variant="outline"
              className={getStatusColor(incident.status)}
            >
              {incident.status}
            </Badge>
          </div>
          <h2 className="text-lg text-muted-foreground">{incident.title}</h2>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Edit className="mr-2 size-4" />
            Edit
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                Actions
                <MoreHorizontal className="ml-2 size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <UserPlus className="mr-2 size-4" />
                Reassign
              </DropdownMenuItem>
              <DropdownMenuItem>
                <ArrowUpRight className="mr-2 size-4" />
                Escalate
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <CheckCircle className="mr-2 size-4" />
                Resolve
              </DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">
                <XCircle className="mr-2 size-4" />
                Cancel
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap text-sm">
                {incident.description}
              </p>
            </CardContent>
          </Card>

          {/* Tabs */}
          <Tabs defaultValue="comments">
            <TabsList>
              <TabsTrigger value="comments" className="gap-2">
                <MessageSquare className="size-4" />
                Comments ({incident.comments.length})
              </TabsTrigger>
              <TabsTrigger value="attachments" className="gap-2">
                <Paperclip className="size-4" />
                Attachments ({incident.attachments.length})
              </TabsTrigger>
              <TabsTrigger value="history" className="gap-2">
                <History className="size-4" />
                History ({incident.history.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="comments" className="space-y-4">
              {/* Add Comment */}
              <Card>
                <CardContent className="pt-6 space-y-4">
                  <Textarea
                    placeholder="Add a comment..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={3}
                  />
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={isInternal}
                        onChange={(e) => setIsInternal(e.target.checked)}
                        className="rounded"
                      />
                      Internal note (not visible to requester)
                    </label>
                    <Button>Add Comment</Button>
                  </div>
                </CardContent>
              </Card>

              {/* Comments List */}
              <div className="space-y-4">
                {incident.comments.map((c) => (
                  <Card key={c.id}>
                    <CardContent className="pt-6">
                      <div className="flex gap-4">
                        <Avatar>
                          <AvatarImage
                            src={c.author.avatarUrl}
                            alt={c.author.name}
                          />
                          <AvatarFallback>
                            {c.author.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{c.author.name}</span>
                            {c.isInternal && (
                              <Badge variant="outline" className="text-xs">
                                Internal
                              </Badge>
                            )}
                            <span className="text-sm text-muted-foreground">
                              {formatDistanceToNow(new Date(c.createdAt), {
                                addSuffix: true,
                              })}
                            </span>
                          </div>
                          <p className="text-sm">{c.content}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="attachments">
              <Card>
                <CardContent className="pt-6">
                  {incident.attachments.length > 0 ? (
                    <div className="space-y-2">
                      {incident.attachments.map((att) => (
                        <div
                          key={att.id}
                          className="flex items-center justify-between rounded-lg border p-3"
                        >
                          <div className="flex items-center gap-3">
                            <Paperclip className="size-4 text-muted-foreground" />
                            <div>
                              <p className="text-sm font-medium">
                                {att.fileName}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {formatFileSize(att.fileSizeBytes)}
                              </p>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm">
                            Download
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-8">
                      No attachments
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="history">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    {incident.history.map((h, index) => (
                      <div
                        key={h.id}
                        className="flex gap-4 relative"
                      >
                        {index < incident.history.length - 1 && (
                          <div className="absolute left-[15px] top-8 bottom-0 w-px bg-border" />
                        )}
                        <div className="flex size-8 shrink-0 items-center justify-center rounded-full border bg-background">
                          <History className="size-4 text-muted-foreground" />
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">
                              {h.action}
                            </span>
                            {h.field && (
                              <span className="text-sm text-muted-foreground">
                                {h.oldValue && `${h.oldValue} → `}
                                {h.newValue}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {h.performedBy.name} •{" "}
                            {format(new Date(h.performedAt), "MMM d, yyyy h:mm a")}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* SLA Status */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <Clock className="size-4" />
                SLA Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Resolution Target</span>
                  <span
                    className={
                      incident.slaTarget.breachStatus === SLABreachStatus.AtRisk
                        ? "text-amber-500 font-medium"
                        : ""
                    }
                  >
                    {format(
                      new Date(incident.slaTarget.targetResolutionTime),
                      "MMM d, h:mm a"
                    )}
                  </span>
                </div>
                <Progress value={slaProgress} className="h-2" />
                {incident.slaTarget.breachStatus === SLABreachStatus.AtRisk && (
                  <div className="flex items-center gap-2 text-amber-500 text-sm">
                    <AlertTriangle className="size-4" />
                    <span>At risk of SLA breach</span>
                  </div>
                )}
              </div>
              <Separator />
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">First Response</span>
                  <span className="text-green-500">
                    {incident.firstResponseAt
                      ? format(new Date(incident.firstResponseAt), "h:mm a")
                      : "Pending"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Details */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Category</span>
                  <span>{incident.category.name}</span>
                </div>
                {incident.subcategory && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subcategory</span>
                    <span>{incident.subcategory.name}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Impact</span>
                  <span>{incident.impact}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Urgency</span>
                  <span>{incident.urgency}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Created</span>
                  <span>
                    {format(new Date(incident.createdAt), "MMM d, h:mm a")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Updated</span>
                  <span>
                    {formatDistanceToNow(new Date(incident.updatedAt), {
                      addSuffix: true,
                    })}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* People */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">People</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Requester
                  </span>
                  <div className="flex items-center gap-2">
                    <Avatar className="size-6">
                      <AvatarImage
                        src={incident.requester.avatarUrl}
                        alt={incident.requester.name}
                      />
                      <AvatarFallback className="text-xs">
                        {incident.requester.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{incident.requester.name}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Assigned To
                  </span>
                  {incident.assignedTo ? (
                    <div className="flex items-center gap-2">
                      <Avatar className="size-6">
                        <AvatarImage
                          src={incident.assignedTo.avatarUrl}
                          alt={incident.assignedTo.name}
                        />
                        <AvatarFallback className="text-xs">
                          {incident.assignedTo.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{incident.assignedTo.name}</span>
                    </div>
                  ) : (
                    <span className="text-sm text-muted-foreground">
                      Unassigned
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Group</span>
                  <span className="text-sm">{incident.assignedGroup.name}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
