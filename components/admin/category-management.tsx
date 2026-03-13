"use client";

import { useState } from "react";
import {
  Plus,
  MoreHorizontal,
  Edit,
  Trash,
  ChevronRight,
  GripVertical,
  FolderOpen,
  Folder,
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
import { Switch } from "@/components/ui/switch";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

// Mock categories data
const mockCategories = [
  {
    id: "1",
    name: "Infrastructure",
    description: "Server, storage, and data center issues",
    isActive: true,
    incidentCount: 85,
    subcategories: [
      { id: "1-1", name: "Email", isActive: true, incidentCount: 32 },
      { id: "1-2", name: "Servers", isActive: true, incidentCount: 28 },
      { id: "1-3", name: "Storage", isActive: true, incidentCount: 25 },
    ],
  },
  {
    id: "2",
    name: "Network",
    description: "Network connectivity and security issues",
    isActive: true,
    incidentCount: 62,
    subcategories: [
      { id: "2-1", name: "VPN", isActive: true, incidentCount: 24 },
      { id: "2-2", name: "WiFi", isActive: true, incidentCount: 22 },
      { id: "2-3", name: "Firewall", isActive: true, incidentCount: 16 },
    ],
  },
  {
    id: "3",
    name: "Hardware",
    description: "Physical equipment issues",
    isActive: true,
    incidentCount: 48,
    subcategories: [
      { id: "3-1", name: "Laptop", isActive: true, incidentCount: 18 },
      { id: "3-2", name: "Desktop", isActive: true, incidentCount: 12 },
      { id: "3-3", name: "Printer", isActive: true, incidentCount: 10 },
      { id: "3-4", name: "Monitor", isActive: true, incidentCount: 8 },
    ],
  },
  {
    id: "4",
    name: "Software",
    description: "Application and software issues",
    isActive: true,
    incidentCount: 75,
    subcategories: [
      { id: "4-1", name: "Installation", isActive: true, incidentCount: 30 },
      { id: "4-2", name: "Updates", isActive: true, incidentCount: 25 },
      { id: "4-3", name: "Licensing", isActive: true, incidentCount: 20 },
    ],
  },
  {
    id: "5",
    name: "Access",
    description: "Account and permission issues",
    isActive: true,
    incidentCount: 72,
    subcategories: [
      { id: "5-1", name: "Permissions", isActive: true, incidentCount: 28 },
      { id: "5-2", name: "Account", isActive: true, incidentCount: 24 },
      { id: "5-3", name: "Password Reset", isActive: true, incidentCount: 20 },
    ],
  },
];

export function CategoryManagement() {
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {mockCategories.length} categories,{" "}
          {mockCategories.reduce((acc, cat) => acc + cat.subcategories.length, 0)}{" "}
          subcategories
        </p>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 size-4" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Category</DialogTitle>
              <DialogDescription>
                Create a new incident category
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" placeholder="Category name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Brief description of this category"
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Active</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow incidents to be assigned to this category
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setIsCreateDialogOpen(false)}>
                Create Category
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Categories List */}
      <div className="space-y-2">
        {mockCategories.map((category) => (
          <Card key={category.id}>
            <Collapsible
              open={expandedCategories.includes(category.id)}
              onOpenChange={() => toggleCategory(category.id)}
            >
              <div className="flex items-center p-4">
                <button className="mr-2 cursor-grab text-muted-foreground hover:text-foreground">
                  <GripVertical className="size-4" />
                </button>
                <CollapsibleTrigger asChild>
                  <button className="mr-2 text-muted-foreground hover:text-foreground">
                    <ChevronRight
                      className={`size-4 transition-transform ${
                        expandedCategories.includes(category.id)
                          ? "rotate-90"
                          : ""
                      }`}
                    />
                  </button>
                </CollapsibleTrigger>
                <div className="mr-3">
                  {expandedCategories.includes(category.id) ? (
                    <FolderOpen className="size-5 text-muted-foreground" />
                  ) : (
                    <Folder className="size-5 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{category.name}</span>
                    {!category.isActive && (
                      <Badge variant="outline" className="text-xs">
                        Inactive
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {category.description}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm font-medium">{category.incidentCount}</p>
                    <p className="text-xs text-muted-foreground">incidents</p>
                  </div>
                  <Badge variant="secondary">
                    {category.subcategories.length} subcategories
                  </Badge>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="size-8">
                        <MoreHorizontal className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Edit className="mr-2 size-4" />
                        Edit Category
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Plus className="mr-2 size-4" />
                        Add Subcategory
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive">
                        <Trash className="mr-2 size-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              <CollapsibleContent>
                <div className="border-t bg-muted/30 px-4 py-2">
                  {category.subcategories.map((sub) => (
                    <div
                      key={sub.id}
                      className="flex items-center py-2 pl-12"
                    >
                      <button className="mr-2 cursor-grab text-muted-foreground hover:text-foreground">
                        <GripVertical className="size-4" />
                      </button>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{sub.name}</span>
                          {!sub.isActive && (
                            <Badge variant="outline" className="text-xs">
                              Inactive
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-muted-foreground">
                          {sub.incidentCount} incidents
                        </span>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="size-7">
                              <MoreHorizontal className="size-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Edit className="mr-2 size-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">
                              <Trash className="mr-2 size-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ))}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="ml-12 mt-2 text-muted-foreground"
                  >
                    <Plus className="mr-2 size-4" />
                    Add Subcategory
                  </Button>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </Card>
        ))}
      </div>
    </div>
  );
}
