"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Clock, Edit, Plus, Shield, Trash2 } from "lucide-react";

// Mock data
const slaPolicies = [
  {
    id: "1",
    name: "Critical Issues - P1",
    priority: "P1",
    responseTime: "15 minutes",
    resolutionTime: "4 hours",
    escalationTime: "30 minutes",
    isActive: true,
    description: "For system outages and critical business impact",
  },
  {
    id: "2",
    name: "High Priority - P2",
    priority: "P2",
    responseTime: "30 minutes",
    resolutionTime: "8 hours",
    escalationTime: "2 hours",
    isActive: true,
    description: "For major functionality issues affecting multiple users",
  },
  {
    id: "3",
    name: "Medium Priority - P3",
    priority: "P3",
    responseTime: "2 hours",
    resolutionTime: "24 hours",
    escalationTime: "8 hours",
    isActive: true,
    description: "For moderate impact issues with workarounds available",
  },
  {
    id: "4",
    name: "Low Priority - P4",
    priority: "P4",
    responseTime: "8 hours",
    resolutionTime: "72 hours",
    escalationTime: "24 hours",
    isActive: true,
    description: "For minor issues and feature requests",
  },
];

function getPriorityStyles(priority: string) {
  switch (priority) {
    case "P1":
      return "bg-red-500/10 text-red-600 border-red-200";
    case "P2":
      return "bg-orange-500/10 text-orange-600 border-orange-200";
    case "P3":
      return "bg-purple-500/10 text-purple-600 border-purple-200";
    case "P4":
      return "bg-green-500/10 text-green-600 border-green-200";
    default:
      return "bg-muted text-muted-foreground";
  }
}

export default function SLAPoliciesPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">SLA Policies</h1>
          <p className="text-muted-foreground">Configure service level agreement policies</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="size-4" />
              Add Policy
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create SLA Policy</DialogTitle>
              <DialogDescription>
                Define a new service level agreement policy
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Policy Name</Label>
                <Input id="name" placeholder="e.g., Critical Issues - P1" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="priority">Priority Level</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="P1">P1 - Critical</SelectItem>
                    <SelectItem value="P2">P2 - High</SelectItem>
                    <SelectItem value="P3">P3 - Medium</SelectItem>
                    <SelectItem value="P4">P4 - Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="response">Response Time</Label>
                  <Input id="response" placeholder="e.g., 15 minutes" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="resolution">Resolution Time</Label>
                  <Input id="resolution" placeholder="e.g., 4 hours" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="escalation">Escalation Time</Label>
                <Input id="escalation" placeholder="e.g., 30 minutes" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input id="description" placeholder="Policy description..." />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setIsDialogOpen(false)}>
                Create Policy
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-primary/10 p-3">
                <Shield className="size-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Policies</p>
                <p className="text-2xl font-bold">{slaPolicies.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-green-500/10 p-3">
                <Clock className="size-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-2xl font-bold">{slaPolicies.filter(p => p.isActive).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-red-500/10 p-3">
                <Clock className="size-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Fastest Response</p>
                <p className="text-2xl font-bold">15min</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-amber-500/10 p-3">
                <Clock className="size-5 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg Resolution</p>
                <p className="text-2xl font-bold">27h</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Policies Table */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">All SLA Policies</CardTitle>
          <CardDescription>Manage your service level agreement configurations</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/30">
                <TableHead className="font-semibold">Policy Name</TableHead>
                <TableHead className="font-semibold">Priority</TableHead>
                <TableHead className="font-semibold">Response Time</TableHead>
                <TableHead className="font-semibold">Resolution Time</TableHead>
                <TableHead className="font-semibold">Escalation</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="w-24"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {slaPolicies.map((policy) => (
                <TableRow key={policy.id} className="group">
                  <TableCell>
                    <div>
                      <p className="font-medium">{policy.name}</p>
                      <p className="text-xs text-muted-foreground">{policy.description}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getPriorityStyles(policy.priority)}>
                      {policy.priority}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">{policy.responseTime}</TableCell>
                  <TableCell className="font-medium">{policy.resolutionTime}</TableCell>
                  <TableCell className="text-muted-foreground">{policy.escalationTime}</TableCell>
                  <TableCell>
                    <Switch checked={policy.isActive} />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" className="size-8">
                        <Edit className="size-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="size-8 text-destructive">
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
