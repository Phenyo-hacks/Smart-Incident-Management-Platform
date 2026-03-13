"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
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
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Edit, Key, Plus, Shield, ShieldCheck, Trash2, Users } from "lucide-react";

// Mock data
const roles = [
  {
    id: "1",
    name: "Administrator",
    description: "Full system access with all permissions",
    userCount: 3,
    permissions: ["all"],
    color: "bg-red-500/10 text-red-600 border-red-200",
  },
  {
    id: "2",
    name: "IT Manager",
    description: "Manage teams, view analytics, configure settings",
    userCount: 5,
    permissions: ["incidents:*", "analytics:read", "users:read", "settings:read"],
    color: "bg-purple-500/10 text-purple-600 border-purple-200",
  },
  {
    id: "3",
    name: "IT Specialist",
    description: "Handle incidents, view analytics",
    userCount: 12,
    permissions: ["incidents:*", "analytics:read"],
    color: "bg-blue-500/10 text-blue-600 border-blue-200",
  },
  {
    id: "4",
    name: "Support Agent",
    description: "Create and manage assigned incidents",
    userCount: 25,
    permissions: ["incidents:create", "incidents:update:own", "incidents:read"],
    color: "bg-green-500/10 text-green-600 border-green-200",
  },
  {
    id: "5",
    name: "End User",
    description: "Create incidents and view own submissions",
    userCount: 150,
    permissions: ["incidents:create", "incidents:read:own"],
    color: "bg-muted text-muted-foreground border-border",
  },
];

const permissionGroups = [
  {
    name: "Incidents",
    permissions: [
      { id: "incidents:create", label: "Create incidents" },
      { id: "incidents:read", label: "View all incidents" },
      { id: "incidents:read:own", label: "View own incidents" },
      { id: "incidents:update", label: "Update all incidents" },
      { id: "incidents:update:own", label: "Update own incidents" },
      { id: "incidents:delete", label: "Delete incidents" },
      { id: "incidents:assign", label: "Assign incidents" },
      { id: "incidents:escalate", label: "Escalate incidents" },
    ],
  },
  {
    name: "Analytics",
    permissions: [
      { id: "analytics:read", label: "View analytics" },
      { id: "analytics:export", label: "Export reports" },
    ],
  },
  {
    name: "Users",
    permissions: [
      { id: "users:create", label: "Create users" },
      { id: "users:read", label: "View users" },
      { id: "users:update", label: "Update users" },
      { id: "users:delete", label: "Delete users" },
    ],
  },
  {
    name: "Administration",
    permissions: [
      { id: "settings:read", label: "View settings" },
      { id: "settings:update", label: "Modify settings" },
      { id: "roles:manage", label: "Manage roles" },
      { id: "sla:manage", label: "Manage SLA policies" },
      { id: "routing:manage", label: "Manage routing rules" },
    ],
  },
];

export default function RolesPermissionsPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Roles & Permissions</h1>
          <p className="text-muted-foreground">Manage user roles and access control</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="size-4" />
              Add Role
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create Role</DialogTitle>
              <DialogDescription>
                Define a new role with specific permissions
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Role Name</Label>
                  <Input id="name" placeholder="e.g., Support Lead" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input id="description" placeholder="Brief description..." />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Permissions</Label>
                <Accordion type="multiple" className="border rounded-lg">
                  {permissionGroups.map((group) => (
                    <AccordionItem key={group.name} value={group.name}>
                      <AccordionTrigger className="px-4 hover:no-underline">
                        <div className="flex items-center gap-2">
                          <Key className="size-4 text-muted-foreground" />
                          {group.name}
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-4 pb-4">
                        <div className="grid grid-cols-2 gap-3">
                          {group.permissions.map((perm) => (
                            <div key={perm.id} className="flex items-center gap-2">
                              <Checkbox id={perm.id} />
                              <Label htmlFor={perm.id} className="text-sm font-normal cursor-pointer">
                                {perm.label}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setIsDialogOpen(false)}>
                Create Role
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
                <p className="text-sm text-muted-foreground">Total Roles</p>
                <p className="text-2xl font-bold">{roles.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-green-500/10 p-3">
                <Users className="size-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Users</p>
                <p className="text-2xl font-bold">{roles.reduce((sum, r) => sum + r.userCount, 0)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-purple-500/10 p-3">
                <Key className="size-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Permissions</p>
                <p className="text-2xl font-bold">{permissionGroups.reduce((sum, g) => sum + g.permissions.length, 0)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-red-500/10 p-3">
                <ShieldCheck className="size-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Admins</p>
                <p className="text-2xl font-bold">3</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Roles Table */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">All Roles</CardTitle>
          <CardDescription>Click on a role to view and edit permissions</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/30">
                <TableHead className="font-semibold">Role</TableHead>
                <TableHead className="font-semibold">Description</TableHead>
                <TableHead className="font-semibold">Users</TableHead>
                <TableHead className="font-semibold">Permissions</TableHead>
                <TableHead className="w-24"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {roles.map((role) => (
                <TableRow key={role.id} className="group cursor-pointer hover:bg-muted/50">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className={role.color}>
                        <Shield className="size-3 mr-1" />
                        {role.name}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{role.description}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Users className="size-4 text-muted-foreground" />
                      <span className="font-medium">{role.userCount}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {role.permissions.slice(0, 3).map((perm) => (
                        <Badge key={perm} variant="secondary" className="text-[10px] px-1.5">
                          {perm}
                        </Badge>
                      ))}
                      {role.permissions.length > 3 && (
                        <Badge variant="secondary" className="text-[10px] px-1.5">
                          +{role.permissions.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" className="size-8">
                        <Edit className="size-4" />
                      </Button>
                      {role.name !== "Administrator" && (
                        <Button variant="ghost" size="icon" className="size-8 text-destructive">
                          <Trash2 className="size-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Permission Matrix Quick View */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Permission Matrix</CardTitle>
          <CardDescription>Quick overview of role capabilities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-semibold">Permission</TableHead>
                  {roles.map((role) => (
                    <TableHead key={role.id} className="text-center font-semibold">
                      {role.name}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {["Create Incidents", "View All Incidents", "Assign Incidents", "View Analytics", "Manage Users", "System Settings"].map((perm) => (
                  <TableRow key={perm}>
                    <TableCell className="font-medium">{perm}</TableCell>
                    {roles.map((role, i) => (
                      <TableCell key={role.id} className="text-center">
                        {i <= (perm === "Create Incidents" ? 4 : perm === "View All Incidents" ? 2 : perm === "Assign Incidents" ? 2 : perm === "View Analytics" ? 2 : perm === "Manage Users" ? 1 : 0) ? (
                          <div className="size-5 rounded-full bg-green-500 mx-auto flex items-center justify-center">
                            <svg className="size-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        ) : (
                          <div className="size-5 rounded-full bg-muted mx-auto" />
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
