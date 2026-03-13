"use client";

import { useState } from "react";
import { Plus, MoreHorizontal, Edit, Trash, Users, Clock, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { GroupType, RoutingStrategy } from "@/types/domain";

// Mock groups data
const mockGroups = [
  {
    id: "1",
    name: "IT Infrastructure",
    description: "Server, network, and infrastructure support",
    type: GroupType.L2,
    routingStrategy: RoutingStrategy.LeastBusy,
    memberCount: 8,
    members: [
      { id: "1", name: "John Doe" },
      { id: "2", name: "Jane Smith" },
      { id: "3", name: "Mike Johnson" },
    ],
    openIncidents: 12,
    avgResolutionTime: 4.2,
    isActive: true,
    categories: ["Infrastructure", "Network"],
  },
  {
    id: "2",
    name: "Desktop Support",
    description: "Hardware and software support for end users",
    type: GroupType.L1,
    routingStrategy: RoutingStrategy.RoundRobin,
    memberCount: 12,
    members: [
      { id: "4", name: "Sarah Wilson" },
      { id: "5", name: "David Brown" },
      { id: "6", name: "Emma Taylor" },
    ],
    openIncidents: 25,
    avgResolutionTime: 2.8,
    isActive: true,
    categories: ["Hardware", "Software"],
  },
  {
    id: "3",
    name: "Security Team",
    description: "Security incidents and access management",
    type: GroupType.Specialized,
    routingStrategy: RoutingStrategy.SkillBased,
    memberCount: 5,
    members: [
      { id: "7", name: "Alex Martinez" },
      { id: "8", name: "Chris Lee" },
    ],
    openIncidents: 8,
    avgResolutionTime: 6.5,
    isActive: true,
    categories: ["Access", "Security"],
  },
  {
    id: "4",
    name: "Application Support",
    description: "Business application and software issues",
    type: GroupType.L2,
    routingStrategy: RoutingStrategy.LeastBusy,
    memberCount: 6,
    members: [
      { id: "9", name: "Lisa Chen" },
      { id: "10", name: "Tom Wilson" },
    ],
    openIncidents: 15,
    avgResolutionTime: 5.1,
    isActive: true,
    categories: ["Software", "Application"],
  },
  {
    id: "5",
    name: "Database Team",
    description: "Database administration and support",
    type: GroupType.L3,
    routingStrategy: RoutingStrategy.SkillBased,
    memberCount: 4,
    members: [
      { id: "11", name: "Kevin Park" },
      { id: "12", name: "Nancy White" },
    ],
    openIncidents: 5,
    avgResolutionTime: 8.2,
    isActive: true,
    categories: ["Database", "Infrastructure"],
  },
  {
    id: "6",
    name: "Cloud Operations",
    description: "Cloud infrastructure and DevOps support",
    type: GroupType.Specialized,
    routingStrategy: RoutingStrategy.LeastBusy,
    memberCount: 7,
    members: [
      { id: "13", name: "Ryan Kim" },
      { id: "14", name: "Olivia Davis" },
    ],
    openIncidents: 10,
    avgResolutionTime: 3.5,
    isActive: true,
    categories: ["Cloud", "Infrastructure"],
  },
];

function getGroupTypeColor(type: GroupType) {
  switch (type) {
    case GroupType.L1:
      return "bg-blue-500/10 text-blue-500 border-blue-500/20";
    case GroupType.L2:
      return "bg-purple-500/10 text-purple-500 border-purple-500/20";
    case GroupType.L3:
      return "bg-amber-500/10 text-amber-500 border-amber-500/20";
    case GroupType.Specialized:
      return "bg-green-500/10 text-green-500 border-green-500/20";
    default:
      return "";
  }
}

export function GroupManagement() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {mockGroups.length} support groups,{" "}
          {mockGroups.reduce((acc, g) => acc + g.memberCount, 0)} total members
        </p>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 size-4" />
              Add Group
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add Support Group</DialogTitle>
              <DialogDescription>
                Create a new support group for incident routing
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" placeholder="Group name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Brief description of this group's responsibilities"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Group Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={GroupType.L1}>L1 - First Line</SelectItem>
                      <SelectItem value={GroupType.L2}>L2 - Second Line</SelectItem>
                      <SelectItem value={GroupType.L3}>L3 - Third Line</SelectItem>
                      <SelectItem value={GroupType.Specialized}>Specialized</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Routing Strategy</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select strategy" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={RoutingStrategy.RoundRobin}>Round Robin</SelectItem>
                      <SelectItem value={RoutingStrategy.LeastBusy}>Least Busy</SelectItem>
                      <SelectItem value={RoutingStrategy.SkillBased}>Skill Based</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setIsCreateDialogOpen(false)}>
                Create Group
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Groups Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {mockGroups.map((group) => (
          <Card key={group.id}>
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg">{group.name}</CardTitle>
                  <CardDescription>{group.description}</CardDescription>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="size-8">
                      <MoreHorizontal className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Edit className="mr-2 size-4" />
                      Edit Group
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Users className="mr-2 size-4" />
                      Manage Members
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Settings className="mr-2 size-4" />
                      Configure Routing
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive">
                      <Trash className="mr-2 size-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className={getGroupTypeColor(group.type)}>
                  {group.type}
                </Badge>
                <Badge variant="secondary">{group.routingStrategy}</Badge>
              </div>

              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold">{group.memberCount}</p>
                  <p className="text-xs text-muted-foreground">Members</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">{group.openIncidents}</p>
                  <p className="text-xs text-muted-foreground">Open</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">{group.avgResolutionTime}h</p>
                  <p className="text-xs text-muted-foreground">Avg Time</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t">
                <div className="flex -space-x-2">
                  {group.members.slice(0, 4).map((member) => (
                    <Avatar key={member.id} className="size-7 border-2 border-background">
                      <AvatarFallback className="text-xs">
                        {member.name.split(" ").map((n) => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                  {group.memberCount > 4 && (
                    <div className="flex size-7 items-center justify-center rounded-full border-2 border-background bg-muted text-xs">
                      +{group.memberCount - 4}
                    </div>
                  )}
                </div>
                <div className="flex flex-wrap gap-1">
                  {group.categories.slice(0, 2).map((cat) => (
                    <Badge key={cat} variant="outline" className="text-xs">
                      {cat}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
