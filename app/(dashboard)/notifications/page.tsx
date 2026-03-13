"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  AlertCircle, 
  Bell, 
  BellOff, 
  Check,
  CheckCheck,
  Clock,
  Mail,
  MessageSquare,
  Settings,
  Trash2,
  UserPlus,
  XCircle,
} from "lucide-react";

// Mock notifications
const notifications = [
  {
    id: "1",
    type: "assignment",
    title: "New Incident Assigned",
    message: "INC-2024-0045 has been assigned to you by Naledi Dlamini",
    time: "5 minutes ago",
    read: false,
    icon: UserPlus,
    iconColor: "text-blue-600 bg-blue-500/10",
  },
  {
    id: "2",
    type: "sla",
    title: "SLA Warning",
    message: "INC-2024-0043 is approaching SLA breach in 30 minutes",
    time: "15 minutes ago",
    read: false,
    icon: Clock,
    iconColor: "text-amber-600 bg-amber-500/10",
  },
  {
    id: "3",
    type: "update",
    title: "Incident Updated",
    message: "Sipho Ndlovu added a comment to INC-2024-0041",
    time: "1 hour ago",
    read: false,
    icon: MessageSquare,
    iconColor: "text-purple-600 bg-purple-500/10",
  },
  {
    id: "4",
    type: "resolved",
    title: "Incident Resolved",
    message: "INC-2024-0038 has been marked as resolved",
    time: "2 hours ago",
    read: true,
    icon: Check,
    iconColor: "text-green-600 bg-green-500/10",
  },
  {
    id: "5",
    type: "escalation",
    title: "Incident Escalated",
    message: "INC-2024-0035 has been escalated to Senior IT Specialists",
    time: "3 hours ago",
    read: true,
    icon: AlertCircle,
    iconColor: "text-red-600 bg-red-500/10",
  },
  {
    id: "6",
    type: "mention",
    title: "You were mentioned",
    message: "Lerato Molefe mentioned you in INC-2024-0032",
    time: "Yesterday",
    read: true,
    icon: MessageSquare,
    iconColor: "text-primary bg-primary/10",
  },
];

const notificationSettings = [
  {
    category: "Incidents",
    settings: [
      { id: "new_assignment", label: "New incident assignments", email: true, push: true },
      { id: "incident_updates", label: "Updates on assigned incidents", email: true, push: true },
      { id: "mentions", label: "When I'm mentioned", email: true, push: true },
      { id: "resolved", label: "Incident resolutions", email: false, push: true },
    ],
  },
  {
    category: "SLA",
    settings: [
      { id: "sla_warning", label: "SLA breach warnings", email: true, push: true },
      { id: "sla_breach", label: "SLA breaches", email: true, push: true },
    ],
  },
  {
    category: "Team",
    settings: [
      { id: "escalations", label: "Incident escalations", email: true, push: true },
      { id: "team_updates", label: "Team announcements", email: true, push: false },
    ],
  },
];

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState("all");
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Notifications</h1>
          <p className="text-muted-foreground">
            {unreadCount > 0 ? `You have ${unreadCount} unread notifications` : "All caught up!"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <CheckCheck className="size-4" />
            Mark all read
          </Button>
          <Button variant="ghost" size="icon">
            <Settings className="size-4" />
          </Button>
        </div>
      </div>

      <Tabs defaultValue="notifications" className="space-y-6">
        <TabsList>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="size-4" />
            Notifications
            {unreadCount > 0 && (
              <Badge className="ml-1 h-5 px-1.5 bg-primary text-primary-foreground">
                {unreadCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="settings" className="gap-2">
            <Settings className="size-4" />
            Preferences
          </TabsTrigger>
        </TabsList>

        <TabsContent value="notifications" className="space-y-4">
          {/* Filter Pills */}
          <div className="flex gap-2">
            {["all", "unread", "assignments", "sla", "updates"].map((filter) => (
              <Button
                key={filter}
                variant={activeTab === filter ? "default" : "outline"}
                size="sm"
                className="capitalize"
                onClick={() => setActiveTab(filter)}
              >
                {filter}
              </Button>
            ))}
          </div>

          {/* Notifications List */}
          <Card className="shadow-sm">
            <CardContent className="p-0">
              <div className="divide-y">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`flex items-start gap-4 p-4 transition-colors hover:bg-muted/50 ${
                      !notification.read ? "bg-primary/5" : ""
                    }`}
                  >
                    <div className={`rounded-xl p-2.5 ${notification.iconColor}`}>
                      <notification.icon className="size-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className={`text-sm ${!notification.read ? "font-semibold" : "font-medium"}`}>
                            {notification.title}
                          </p>
                          <p className="text-sm text-muted-foreground mt-0.5">
                            {notification.message}
                          </p>
                        </div>
                        {!notification.read && (
                          <div className="size-2 rounded-full bg-primary shrink-0 mt-1.5" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        {notification.time}
                      </p>
                    </div>
                    <Button variant="ghost" size="icon" className="shrink-0 size-8">
                      <Trash2 className="size-4 text-muted-foreground" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Load More */}
          <div className="text-center">
            <Button variant="outline">Load older notifications</Button>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          {notificationSettings.map((group) => (
            <Card key={group.category} className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">{group.category}</CardTitle>
                <CardDescription>Configure how you receive {group.category.toLowerCase()} notifications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Header */}
                  <div className="grid grid-cols-[1fr,80px,80px] gap-4 pb-2 border-b text-xs font-medium text-muted-foreground">
                    <span>Notification</span>
                    <span className="text-center">
                      <Mail className="size-4 inline-block mr-1" />
                      Email
                    </span>
                    <span className="text-center">
                      <Bell className="size-4 inline-block mr-1" />
                      Push
                    </span>
                  </div>
                  
                  {group.settings.map((setting) => (
                    <div
                      key={setting.id}
                      className="grid grid-cols-[1fr,80px,80px] gap-4 items-center"
                    >
                      <Label htmlFor={setting.id} className="font-normal">
                        {setting.label}
                      </Label>
                      <div className="flex justify-center">
                        <Switch defaultChecked={setting.email} />
                      </div>
                      <div className="flex justify-center">
                        <Switch defaultChecked={setting.push} />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Quick Actions */}
          <Card className="shadow-sm bg-muted/30">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-red-500/10 p-2.5">
                    <BellOff className="size-5 text-red-600" />
                  </div>
                  <div>
                    <p className="font-medium">Mute all notifications</p>
                    <p className="text-sm text-muted-foreground">Temporarily disable all notifications</p>
                  </div>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
