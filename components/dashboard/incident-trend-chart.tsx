"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Legend,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

// Mock data
const trendData = [
  { date: "Mon", created: 12, resolved: 8, pending: 4 },
  { date: "Tue", created: 18, resolved: 15, pending: 6 },
  { date: "Wed", created: 15, resolved: 12, pending: 5 },
  { date: "Thu", created: 22, resolved: 20, pending: 8 },
  { date: "Fri", created: 19, resolved: 18, pending: 4 },
  { date: "Sat", created: 8, resolved: 10, pending: 2 },
  { date: "Sun", created: 5, resolved: 7, pending: 1 },
];

const chartConfig = {
  created: {
    label: "Created",
    color: "#5B3765",
  },
  resolved: {
    label: "Resolved",
    color: "#9E6899",
  },
  pending: {
    label: "Pending",
    color: "#D6A8C4",
  },
} satisfies ChartConfig;

export function IncidentTrendChart() {
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">Incident Trends</CardTitle>
        <CardDescription>
          Weekly overview of incident activity
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <AreaChart data={trendData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="gradientCreated" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#5B3765" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#5B3765" stopOpacity={0.05} />
              </linearGradient>
              <linearGradient id="gradientResolved" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#9E6899" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#9E6899" stopOpacity={0.05} />
              </linearGradient>
              <linearGradient id="gradientPending" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#D6A8C4" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#D6A8C4" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E8D4DE" />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tick={{ fill: '#7A5A6E', fontSize: 12 }}
            />
            <YAxis 
              tickLine={false} 
              axisLine={false} 
              tickMargin={8}
              tick={{ fill: '#7A5A6E', fontSize: 12 }}
            />
            <ChartTooltip 
              content={<ChartTooltipContent />}
              cursor={{ stroke: '#BA88AE', strokeWidth: 1, strokeDasharray: '4 4' }}
            />
            <Legend 
              verticalAlign="top" 
              height={36}
              iconType="circle"
              iconSize={8}
            />
            <Area
              type="monotone"
              dataKey="created"
              stackId="1"
              stroke="#5B3765"
              strokeWidth={2}
              fill="url(#gradientCreated)"
            />
            <Area
              type="monotone"
              dataKey="resolved"
              stackId="2"
              stroke="#9E6899"
              strokeWidth={2}
              fill="url(#gradientResolved)"
            />
            <Area
              type="monotone"
              dataKey="pending"
              stackId="3"
              stroke="#D6A8C4"
              strokeWidth={2}
              fill="url(#gradientPending)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
