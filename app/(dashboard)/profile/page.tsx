"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Camera, 
  Mail, 
  MapPin, 
  Phone, 
  Building, 
  Calendar,
  Shield,
  Award,
  BarChart3,
  Clock,
  CheckCircle,
} from "lucide-react";

// South African user data
const user = {
  name: "Thabo Mokoena",
  email: "thabo.mokoena@simp.co.za",
  phone: "+27 82 456 7890",
  role: "Senior IT Specialist",
  department: "IT Support",
  location: "Johannesburg, Gauteng",
  joinDate: "15 March 2022",
  avatarUrl: "",
  stats: {
    resolved: 156,
    avgResolutionTime: "2.4h",
    satisfaction: 98,
    slaCompliance: 97,
  },
};

const recentActivity = [
  { action: "Resolved", incident: "INC-2024-0042", time: "2 hours ago" },
  { action: "Updated", incident: "INC-2024-0041", time: "4 hours ago" },
  { action: "Assigned", incident: "INC-2024-0040", time: "Yesterday" },
  { action: "Resolved", incident: "INC-2024-0038", time: "2 days ago" },
  { action: "Escalated", incident: "INC-2024-0035", time: "3 days ago" },
];

export default function ProfilePage() {
  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">My Profile</h1>
        <p className="text-muted-foreground">Manage your personal information and preferences</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile Card */}
        <Card className="shadow-sm lg:col-span-1">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <div className="relative">
                <Avatar className="size-24 ring-4 ring-background shadow-lg">
                  <AvatarImage src={user.avatarUrl} alt={user.name} />
                  <AvatarFallback className="text-2xl bg-primary/10 text-primary font-bold">
                    {user.name.split(" ").map((n) => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <Button 
                  size="icon" 
                  variant="secondary" 
                  className="absolute -bottom-1 -right-1 size-8 rounded-full shadow-md"
                >
                  <Camera className="size-4" />
                </Button>
              </div>
              
              <h2 className="mt-4 text-xl font-bold">{user.name}</h2>
              <Badge className="mt-1 bg-primary/10 text-primary border-0">
                <Shield className="size-3 mr-1" />
                {user.role}
              </Badge>
              
              <Separator className="my-4 w-full" />
              
              <div className="w-full space-y-3 text-left">
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="size-4 text-muted-foreground" />
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="size-4 text-muted-foreground" />
                  <span>{user.phone}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Building className="size-4 text-muted-foreground" />
                  <span>{user.department}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <MapPin className="size-4 text-muted-foreground" />
                  <span>{user.location}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="size-4 text-muted-foreground" />
                  <span>Joined {user.joinDate}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stats Cards */}
          <div className="grid gap-4 sm:grid-cols-4">
            <Card className="shadow-sm">
              <CardContent className="pt-4 text-center">
                <CheckCircle className="size-5 mx-auto text-green-600 mb-1" />
                <p className="text-2xl font-bold">{user.stats.resolved}</p>
                <p className="text-xs text-muted-foreground">Resolved</p>
              </CardContent>
            </Card>
            <Card className="shadow-sm">
              <CardContent className="pt-4 text-center">
                <Clock className="size-5 mx-auto text-purple-600 mb-1" />
                <p className="text-2xl font-bold">{user.stats.avgResolutionTime}</p>
                <p className="text-xs text-muted-foreground">Avg Time</p>
              </CardContent>
            </Card>
            <Card className="shadow-sm">
              <CardContent className="pt-4 text-center">
                <Award className="size-5 mx-auto text-yellow-600 mb-1" />
                <p className="text-2xl font-bold">{user.stats.satisfaction}%</p>
                <p className="text-xs text-muted-foreground">Satisfaction</p>
              </CardContent>
            </Card>
            <Card className="shadow-sm">
              <CardContent className="pt-4 text-center">
                <BarChart3 className="size-5 mx-auto text-primary mb-1" />
                <p className="text-2xl font-bold">{user.stats.slaCompliance}%</p>
                <p className="text-xs text-muted-foreground">SLA</p>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="edit" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="edit">Edit Profile</TabsTrigger>
              <TabsTrigger value="activity">Recent Activity</TabsTrigger>
            </TabsList>
            
            <TabsContent value="edit">
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg">Personal Information</CardTitle>
                  <CardDescription>Update your personal details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" defaultValue="Thabo" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" defaultValue="Mokoena" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" defaultValue={user.email} />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" defaultValue={user.phone} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input id="location" defaultValue={user.location} />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 pt-4">
                    <Button variant="outline">Cancel</Button>
                    <Button>Save Changes</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activity">
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg">Recent Activity</CardTitle>
                  <CardDescription>Your latest incident interactions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivity.map((activity, index) => (
                      <div 
                        key={index}
                        className="flex items-center gap-4 rounded-lg border p-3"
                      >
                        <div className={`size-2 rounded-full ${
                          activity.action === "Resolved" ? "bg-green-500" :
                          activity.action === "Escalated" ? "bg-red-500" :
                          "bg-primary"
                        }`} />
                        <div className="flex-1">
                          <p className="text-sm">
                            <span className="font-medium">{activity.action}</span>{" "}
                            <span className="text-primary font-medium">{activity.incident}</span>
                          </p>
                          <p className="text-xs text-muted-foreground">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
