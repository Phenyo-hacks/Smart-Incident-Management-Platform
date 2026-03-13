"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid,
  LineChart,
  Line,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { 
  Award, 
  Clock, 
  MessageSquare, 
  Star, 
  TrendingUp, 
  Users,
  ChevronRight,
} from "lucide-react";

// South African agents data
const agents = [
  {
    id: "1",
    name: "Thabo Mokoena",
    email: "thabo.mokoena@simp.co.za",
    phone: "+27 82 456 7890",
    role: "Senior IT Specialist",
    resolved: 156,
    avgResolutionTime: "2.4h",
    satisfaction: 98,
    slaCompliance: 97,
    activeIncidents: 4,
  },
  {
    id: "2",
    name: "Naledi Dlamini",
    email: "naledi.dlamini@simp.co.za",
    phone: "+27 83 567 8901",
    role: "IT Support Engineer",
    resolved: 142,
    avgResolutionTime: "2.8h",
    satisfaction: 96,
    slaCompliance: 94,
    activeIncidents: 6,
  },
  {
    id: "3",
    name: "Sipho Ndlovu",
    email: "sipho.ndlovu@simp.co.za",
    phone: "+27 84 678 9012",
    role: "Network Specialist",
    resolved: 128,
    avgResolutionTime: "3.1h",
    satisfaction: 94,
    slaCompliance: 92,
    activeIncidents: 5,
  },
  {
    id: "4",
    name: "Lerato Molefe",
    email: "lerato.molefe@simp.co.za",
    phone: "+27 72 789 0123",
    role: "IT Support Technician",
    resolved: 118,
    avgResolutionTime: "3.5h",
    satisfaction: 92,
    slaCompliance: 89,
    activeIncidents: 7,
  },
  {
    id: "5",
    name: "Kagiso Mabaso",
    email: "kagiso.mabaso@simp.co.za",
    phone: "+27 73 890 1234",
    role: "Junior IT Support",
    resolved: 95,
    avgResolutionTime: "4.2h",
    satisfaction: 90,
    slaCompliance: 86,
    activeIncidents: 8,
  },
];

const teamPerformanceData = [
  { name: "Thabo", resolved: 156, target: 140 },
  { name: "Naledi", resolved: 142, target: 140 },
  { name: "Sipho", resolved: 128, target: 140 },
  { name: "Lerato", resolved: 118, target: 140 },
  { name: "Kagiso", resolved: 95, target: 140 },
];

const weeklyTrend = [
  { day: "Mon", incidents: 24 },
  { day: "Tue", incidents: 32 },
  { day: "Wed", incidents: 28 },
  { day: "Thu", incidents: 35 },
  { day: "Fri", incidents: 30 },
  { day: "Sat", incidents: 12 },
  { day: "Sun", incidents: 8 },
];

const skillsData = [
  { skill: "Response Time", value: 92 },
  { skill: "Resolution Quality", value: 88 },
  { skill: "Communication", value: 95 },
  { skill: "Technical Skills", value: 90 },
  { skill: "SLA Compliance", value: 94 },
  { skill: "Customer Satisfaction", value: 96 },
];

const chartConfig = {
  resolved: {
    label: "Resolved",
    color: "#5B3765",
  },
  target: {
    label: "Target",
    color: "#D6A8C4",
  },
  incidents: {
    label: "Incidents",
    color: "#9E6899",
  },
} satisfies ChartConfig;

export default function AgentPerformancePage() {
  const totalResolved = agents.reduce((sum, agent) => sum + agent.resolved, 0);
  const avgSatisfaction = Math.round(agents.reduce((sum, agent) => sum + agent.satisfaction, 0) / agents.length);
  const avgSLA = Math.round(agents.reduce((sum, agent) => sum + agent.slaCompliance, 0) / agents.length);

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Agent Performance</h1>
          <p className="text-muted-foreground">Track team productivity and metrics</p>
        </div>
        <Button variant="outline" className="gap-2">
          <Users className="size-4" />
          Export Report
        </Button>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-primary/10 p-3">
                <Award className="size-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Resolved</p>
                <p className="text-2xl font-bold">{totalResolved}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-green-500/10 p-3">
                <Star className="size-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg. Satisfaction</p>
                <p className="text-2xl font-bold">{avgSatisfaction}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-purple-500/10 p-3">
                <Clock className="size-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg. Resolution</p>
                <p className="text-2xl font-bold">3.2h</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-blue-500/10 p-3">
                <TrendingUp className="size-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">SLA Compliance</p>
                <p className="text-2xl font-bold">{avgSLA}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Team Performance */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Team Performance</CardTitle>
            <CardDescription>Incidents resolved vs target</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[280px] w-full">
              <BarChart data={teamPerformanceData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E8D4DE" />
                <XAxis dataKey="name" tick={{ fill: '#7A5A6E', fontSize: 12 }} />
                <YAxis tick={{ fill: '#7A5A6E', fontSize: 12 }} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="resolved" fill="#5B3765" radius={[4, 4, 0, 0]} barSize={30} />
                <Bar dataKey="target" fill="#D6A8C4" radius={[4, 4, 0, 0]} barSize={30} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Weekly Activity */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Weekly Activity</CardTitle>
            <CardDescription>Incidents handled per day</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[280px] w-full">
              <LineChart data={weeklyTrend}>
                <defs>
                  <linearGradient id="activityGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#9E6899" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#9E6899" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E8D4DE" />
                <XAxis dataKey="day" tick={{ fill: '#7A5A6E', fontSize: 12 }} />
                <YAxis tick={{ fill: '#7A5A6E', fontSize: 12 }} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line 
                  type="monotone" 
                  dataKey="incidents" 
                  stroke="#9E6899" 
                  strokeWidth={3}
                  dot={{ fill: '#9E6899', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, fill: '#5B3765' }}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Agent Leaderboard */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Agent Leaderboard</CardTitle>
          <CardDescription>Top performers this month</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {agents.map((agent, index) => (
              <div 
                key={agent.id} 
                className="flex items-center gap-4 rounded-xl border p-4 transition-all hover:bg-muted/50"
              >
                {/* Rank */}
                <div className={`flex size-8 items-center justify-center rounded-full font-bold text-sm ${
                  index === 0 ? 'bg-yellow-500/20 text-yellow-600' :
                  index === 1 ? 'bg-gray-300/30 text-gray-600' :
                  index === 2 ? 'bg-orange-400/20 text-orange-600' :
                  'bg-muted text-muted-foreground'
                }`}>
                  {index + 1}
                </div>

                {/* Avatar & Info */}
                <Avatar className="size-10 ring-2 ring-background">
                  <AvatarFallback className="bg-primary/10 text-primary font-medium">
                    {agent.name.split(" ").map((n) => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{agent.name}</span>
                    {index === 0 && (
                      <Badge className="bg-yellow-500/20 text-yellow-600 border-0">
                        <Star className="size-3 mr-1" /> Top Performer
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{agent.role}</p>
                </div>

                {/* Metrics */}
                <div className="hidden md:flex items-center gap-6">
                  <div className="text-center">
                    <p className="text-lg font-bold">{agent.resolved}</p>
                    <p className="text-xs text-muted-foreground">Resolved</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold">{agent.avgResolutionTime}</p>
                    <p className="text-xs text-muted-foreground">Avg Time</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-green-600">{agent.satisfaction}%</p>
                    <p className="text-xs text-muted-foreground">Satisfaction</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-primary">{agent.slaCompliance}%</p>
                    <p className="text-xs text-muted-foreground">SLA</p>
                  </div>
                </div>

                <Button variant="ghost" size="icon" className="shrink-0">
                  <ChevronRight className="size-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
