"use client";

import {
  AlertCircle,
  CheckCircle,
  Clock,
  TrendingDown,
  TrendingUp,
  Shield,
  Users,
  AlertTriangle,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";

// Mock analytics data
const kpiData = {
  totalIncidents: 342,
  totalIncidentsChange: -5,
  resolvedIncidents: 298,
  resolvedIncidentsChange: 12,
  avgResolutionTime: 4.2,
  avgResolutionTimeChange: -15,
  slaCompliance: 94.5,
  slaComplianceChange: 2.3,
};

const trendData = [
  { date: "Week 1", created: 45, resolved: 42 },
  { date: "Week 2", created: 52, resolved: 48 },
  { date: "Week 3", created: 48, resolved: 51 },
  { date: "Week 4", created: 61, resolved: 58 },
];

const categoryData = [
  { name: "Infrastructure", value: 85, fill: "#5B3765" },
  { name: "Network", value: 62, fill: "#9E6899" },
  { name: "Hardware", value: 48, fill: "#BA88AE" },
  { name: "Software", value: 75, fill: "#D6A8C4" },
  { name: "Access", value: 72, fill: "#F3CCDE" },
];

// South African agent names
const agentPerformance = [
  { name: "Thabo Mokoena", assigned: 45, resolved: 42, avgTime: 3.2, sla: 98 },
  { name: "Naledi Dlamini", assigned: 38, resolved: 35, avgTime: 4.1, sla: 95 },
  { name: "Sipho Ndlovu", assigned: 52, resolved: 48, avgTime: 3.8, sla: 96 },
  { name: "Lerato Molefe", assigned: 41, resolved: 40, avgTime: 2.9, sla: 99 },
  { name: "Kagiso Mabaso", assigned: 35, resolved: 32, avgTime: 4.5, sla: 91 },
];

const backlogAging = [
  { range: "< 1 day", count: 15 },
  { range: "1-3 days", count: 12 },
  { range: "3-7 days", count: 8 },
  { range: "1-2 weeks", count: 5 },
  { range: "> 2 weeks", count: 2 },
];

const trendChartConfig = {
  created: { label: "Created", color: "#5B3765" },
  resolved: { label: "Resolved", color: "#9E6899" },
} satisfies ChartConfig;

const categoryChartConfig = {
  value: { label: "Incidents" },
  Infrastructure: { label: "Infrastructure", color: "#5B3765" },
  Network: { label: "Network", color: "#9E6899" },
  Hardware: { label: "Hardware", color: "#BA88AE" },
  Software: { label: "Software", color: "#D6A8C4" },
  Access: { label: "Access", color: "#F3CCDE" },
} satisfies ChartConfig;

const backlogChartConfig = {
  count: { label: "Incidents", color: "#5B3765" },
} satisfies ChartConfig;

export function AnalyticsOverview() {
  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Incidents</CardTitle>
            <AlertCircle className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpiData.totalIncidents}</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              {kpiData.totalIncidentsChange < 0 ? (
                <>
                  <TrendingDown className="size-3 text-green-500" />
                  <span className="text-green-500">{kpiData.totalIncidentsChange}%</span>
                </>
              ) : (
                <>
                  <TrendingUp className="size-3 text-destructive" />
                  <span className="text-destructive">+{kpiData.totalIncidentsChange}%</span>
                </>
              )}
              <span>from last period</span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Resolved</CardTitle>
            <CheckCircle className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpiData.resolvedIncidents}</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <TrendingUp className="size-3 text-green-500" />
              <span className="text-green-500">+{kpiData.resolvedIncidentsChange}%</span>
              <span>from last period</span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Avg. Resolution</CardTitle>
            <Clock className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpiData.avgResolutionTime}h</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <TrendingDown className="size-3 text-green-500" />
              <span className="text-green-500">{kpiData.avgResolutionTimeChange}%</span>
              <span>from last period</span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">SLA Compliance</CardTitle>
            <Shield className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpiData.slaCompliance}%</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <TrendingUp className="size-3 text-green-500" />
              <span className="text-green-500">+{kpiData.slaComplianceChange}%</span>
              <span>from last period</span>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Incident Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Incident Trends</CardTitle>
            <CardDescription>Created vs resolved over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={trendChartConfig} className="h-[300px] w-full">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} />
                <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  type="monotone"
                  dataKey="created"
                  stroke="var(--color-created)"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="resolved"
                  stroke="var(--color-resolved)"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
                <Legend />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Category Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>By Category</CardTitle>
            <CardDescription>Incident distribution by category</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={categoryChartConfig} className="h-[300px] w-full">
              <BarChart data={categoryData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" tickLine={false} axisLine={false} />
                <YAxis
                  dataKey="name"
                  type="category"
                  tickLine={false}
                  axisLine={false}
                  width={100}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Agent Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Agent Performance</CardTitle>
            <CardDescription>Top performing agents this period</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Agent</TableHead>
                  <TableHead className="text-right">Assigned</TableHead>
                  <TableHead className="text-right">Resolved</TableHead>
                  <TableHead className="text-right">Avg Time</TableHead>
                  <TableHead className="text-right">SLA %</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {agentPerformance.map((agent) => (
                  <TableRow key={agent.name}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="size-6">
                          <AvatarFallback className="text-xs">
                            {agent.name.split(" ").map((n) => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{agent.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">{agent.assigned}</TableCell>
                    <TableCell className="text-right">{agent.resolved}</TableCell>
                    <TableCell className="text-right">{agent.avgTime}h</TableCell>
                    <TableCell className="text-right">
                      <span
                        className={
                          agent.sla >= 95
                            ? "text-green-500"
                            : agent.sla >= 90
                            ? "text-amber-500"
                            : "text-destructive"
                        }
                      >
                        {agent.sla}%
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Backlog Aging */}
        <Card>
          <CardHeader>
            <CardTitle>Backlog Aging</CardTitle>
            <CardDescription>Open incidents by age</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={backlogChartConfig} className="h-[300px] w-full">
              <BarChart data={backlogAging}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="range" tickLine={false} axisLine={false} tickMargin={8} />
                <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="count" fill="var(--color-count)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
            <div className="mt-4 space-y-2">
              {backlogAging.map((item) => (
                <div key={item.range} className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{item.range}</span>
                  <div className="flex items-center gap-2">
                    <Progress
                      value={(item.count / 15) * 100}
                      className="h-2 w-24"
                    />
                    <span className="w-8 text-right font-medium">{item.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
