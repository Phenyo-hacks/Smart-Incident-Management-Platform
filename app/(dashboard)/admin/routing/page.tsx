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
import { ArrowRight, Edit, GitBranch, Plus, Route, Trash2, Zap } from "lucide-react";

// Mock data
const routingRules = [
  {
    id: "1",
    name: "Network Issues to Network Team",
    condition: "Category = Network",
    targetGroup: "Network Operations",
    priority: 1,
    isActive: true,
    matchCount: 156,
  },
  {
    id: "2",
    name: "Critical Incidents Auto-Escalate",
    condition: "Priority = P1",
    targetGroup: "Senior IT Specialists",
    priority: 2,
    isActive: true,
    matchCount: 42,
  },
  {
    id: "3",
    name: "Hardware Requests to Field Team",
    condition: "Category = Hardware",
    targetGroup: "Field Support",
    priority: 3,
    isActive: true,
    matchCount: 98,
  },
  {
    id: "4",
    name: "Access Requests to Security",
    condition: "Category = Access",
    targetGroup: "Security Team",
    priority: 4,
    isActive: true,
    matchCount: 234,
  },
  {
    id: "5",
    name: "Software Installation",
    condition: "Category = Software AND Priority != P1",
    targetGroup: "General IT Support",
    priority: 5,
    isActive: false,
    matchCount: 187,
  },
];

export default function RoutingRulesPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Routing Rules</h1>
          <p className="text-muted-foreground">Configure automatic incident assignment rules</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="size-4" />
              Add Rule
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Create Routing Rule</DialogTitle>
              <DialogDescription>
                Define conditions for automatic incident assignment
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Rule Name</Label>
                <Input id="name" placeholder="e.g., Network Issues to Network Team" />
              </div>
              <div className="space-y-2">
                <Label>Conditions</Label>
                <div className="rounded-lg border p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <Select>
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Field" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="category">Category</SelectItem>
                        <SelectItem value="priority">Priority</SelectItem>
                        <SelectItem value="status">Status</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select>
                      <SelectTrigger className="w-24">
                        <SelectValue placeholder="Is" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="equals">=</SelectItem>
                        <SelectItem value="not_equals">!=</SelectItem>
                        <SelectItem value="contains">contains</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input placeholder="Value" className="flex-1" />
                  </div>
                  <Button variant="outline" size="sm" className="gap-1">
                    <Plus className="size-3" /> Add Condition
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="group">Assign to Group</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select support group" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="network">Network Operations</SelectItem>
                    <SelectItem value="senior">Senior IT Specialists</SelectItem>
                    <SelectItem value="field">Field Support</SelectItem>
                    <SelectItem value="security">Security Team</SelectItem>
                    <SelectItem value="general">General IT Support</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="priority">Rule Priority</Label>
                <Input id="priority" type="number" placeholder="1" min="1" />
                <p className="text-xs text-muted-foreground">Lower number = higher priority</p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setIsDialogOpen(false)}>
                Create Rule
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
                <Route className="size-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Rules</p>
                <p className="text-2xl font-bold">{routingRules.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-green-500/10 p-3">
                <Zap className="size-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Rules</p>
                <p className="text-2xl font-bold">{routingRules.filter(r => r.isActive).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-purple-500/10 p-3">
                <GitBranch className="size-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Incidents Routed</p>
                <p className="text-2xl font-bold">717</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-amber-500/10 p-3">
                <ArrowRight className="size-5 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Success Rate</p>
                <p className="text-2xl font-bold">94%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Rules Table */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">All Routing Rules</CardTitle>
          <CardDescription>Rules are evaluated in priority order (lowest number first)</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/30">
                <TableHead className="w-16 font-semibold">Priority</TableHead>
                <TableHead className="font-semibold">Rule Name</TableHead>
                <TableHead className="font-semibold">Condition</TableHead>
                <TableHead className="font-semibold">Target Group</TableHead>
                <TableHead className="font-semibold">Matches</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="w-24"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {routingRules.map((rule) => (
                <TableRow key={rule.id} className="group">
                  <TableCell>
                    <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
                      #{rule.priority}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">{rule.name}</TableCell>
                  <TableCell>
                    <code className="text-xs bg-muted px-2 py-1 rounded">
                      {rule.condition}
                    </code>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <ArrowRight className="size-3 text-muted-foreground" />
                      <span>{rule.targetGroup}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{rule.matchCount}</TableCell>
                  <TableCell>
                    <Switch checked={rule.isActive} />
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

      {/* How it Works */}
      <Card className="shadow-sm bg-muted/30">
        <CardHeader>
          <CardTitle className="text-lg">How Routing Works</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">1</div>
              <span>Incident Created</span>
            </div>
            <ArrowRight className="size-4 text-muted-foreground" />
            <div className="flex items-center gap-2">
              <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">2</div>
              <span>Rules Evaluated</span>
            </div>
            <ArrowRight className="size-4 text-muted-foreground" />
            <div className="flex items-center gap-2">
              <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">3</div>
              <span>First Match Wins</span>
            </div>
            <ArrowRight className="size-4 text-muted-foreground" />
            <div className="flex items-center gap-2">
              <div className="size-8 rounded-full bg-green-500/10 flex items-center justify-center text-green-600 font-bold">4</div>
              <span>Auto-Assigned</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
