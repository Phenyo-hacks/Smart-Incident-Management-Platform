"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
  Legend,
  LineChart,
  Line,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { AlertTriangle, CheckCircle, Clock, TrendingUp, TrendingDown } from "lucide-react";

// Mock data
const slaMetrics = [
  { name: "P1 - Critical", target: 95, actual: 92, breached: 3, total: 38 },
  { name: "P2 - High", target: 90, actual: 94, breached: 5, total: 85 },
  { name: "P3 - Medium", target: 85, actual: 88, breached: 12, total: 102 },
  { name: "P4 - Low", target: 80, actual: 96, breached: 2, total: 54 },
];

const trendData = [
  { month: "Jan", compliance: 89 },
  { month: "Feb", compliance: 91 },
  { month: "Mar", compliance: 88 },
  { month: "Apr", compliance: 93 },
  { month: "May", compliance: 92 },
  { month: "Jun", compliance: 94 },
];

const breachReasons = [
  { name: "Response Time", value: 35, fill: "#C75F5F" },
  { name: "Resolution Time", value: 28, fill: "#D98F4E" },
  { name: "Escalation Delay", value: 22, fill: "#9E6899" },
  { name: "Other", value: 15, fill: "#5A8A6E" },
];

const chartConfig = {
  compliance: {
    label: "Compliance",
    color: "#5B3765",
  },
  target: {
    label: "Target",
    color: "#9E6899",
  },
} satisfies ChartConfig;

export default function SLACompliancePage() {
  const overallCompliance = 93;
  const previousCompliance = 91;
  const trend = overallCompliance - previousCompliance;

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">SLA Compliance</h1>
        <p className="text-muted-foreground">Monitor service level agreement performance</p>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Overall Compliance</p>
                <p className="text-3xl font-bold text-primary">{overallCompliance}%</p>
              </div>
              <div className={`flex items-center gap-1 ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {trend >= 0 ? <TrendingUp className="size-4" /> : <TrendingDown className="size-4" />}
                <span className="text-sm font-medium">{trend > 0 ? '+' : ''}{trend}%</span>
              </div>
            </div>
            <Progress value={overallCompliance} className="mt-3 h-2" />
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-green-500/10 p-3">
                <CheckCircle className="size-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Met SLA</p>
                <p className="text-2xl font-bold">257</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-red-500/10 p-3">
                <AlertTriangle className="size-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Breached</p>
                <p className="text-2xl font-bold">22</p>
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
                <p className="text-sm text-muted-foreground">At Risk</p>
                <p className="text-2xl font-bold">8</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Compliance by Priority */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Compliance by Priority</CardTitle>
            <CardDescription>Actual vs target compliance rates</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <BarChart data={slaMetrics} layout="vertical" margin={{ left: 80 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#E8D4DE" />
                <XAxis type="number" domain={[0, 100]} tick={{ fill: '#7A5A6E', fontSize: 12 }} />
                <YAxis dataKey="name" type="category" tick={{ fill: '#7A5A6E', fontSize: 12 }} width={75} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="actual" radius={[0, 4, 4, 0]} barSize={20}>
                  {slaMetrics.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.actual >= entry.target ? "#5A8A6E" : "#C75F5F"} 
                    />
                  ))}
                </Bar>
                <Bar dataKey="target" fill="#D6A8C4" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Breach Reasons */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Breach Reasons</CardTitle>
            <CardDescription>Why SLAs were breached</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent />} />
                <Pie
                  data={breachReasons}
                  cx="50%"
                  cy="45%"
                  innerRadius={50}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                  nameKey="name"
                  strokeWidth={0}
                />
                <Legend 
                  verticalAlign="bottom" 
                  iconType="circle"
                  iconSize={10}
                />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Trend Chart */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Compliance Trend</CardTitle>
          <CardDescription>6-month SLA compliance history</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[250px] w-full">
            <LineChart data={trendData}>
              <defs>
                <linearGradient id="complianceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#5B3765" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#5B3765" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E8D4DE" />
              <XAxis dataKey="month" tick={{ fill: '#7A5A6E', fontSize: 12 }} />
              <YAxis domain={[80, 100]} tick={{ fill: '#7A5A6E', fontSize: 12 }} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line 
                type="monotone" 
                dataKey="compliance" 
                stroke="#5B3765" 
                strokeWidth={3}
                dot={{ fill: '#5B3765', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: '#9E6899' }}
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Priority Details Table */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Priority Breakdown</CardTitle>
          <CardDescription>Detailed SLA performance by priority level</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {slaMetrics.map((metric) => (
              <div key={metric.name} className="flex items-center gap-4 rounded-lg border p-4">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{metric.name}</span>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant="outline" 
                        className={metric.actual >= metric.target ? "bg-green-500/10 text-green-600 border-green-200" : "bg-red-500/10 text-red-600 border-red-200"}
                      >
                        {metric.actual}% actual
                      </Badge>
                      <Badge variant="outline" className="bg-muted">
                        {metric.target}% target
                      </Badge>
                    </div>
                  </div>
                  <Progress value={metric.actual} className="h-2" />
                  <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                    <span>{metric.total - metric.breached} met / {metric.breached} breached</span>
                    <span>{metric.total} total incidents</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
