"use client";

import { Cell, Pie, PieChart, Legend, ResponsiveContainer } from "recharts";
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

// Mock data with vibrant colors
const priorityData = [
  { name: "P1 - Critical", value: 5, fill: "#C75F5F" },
  { name: "P2 - High", value: 12, fill: "#D98F4E" },
  { name: "P3 - Medium", value: 18, fill: "#9E6899" },
  { name: "P4 - Low", value: 7, fill: "#5A8A6E" },
];

const chartConfig = {
  value: {
    label: "Incidents",
  },
  "P1 - Critical": {
    label: "P1 - Critical",
    color: "#C75F5F",
  },
  "P2 - High": {
    label: "P2 - High",
    color: "#D98F4E",
  },
  "P3 - Medium": {
    label: "P3 - Medium",
    color: "#9E6899",
  },
  "P4 - Low": {
    label: "P4 - Low",
    color: "#5A8A6E",
  },
} satisfies ChartConfig;

export function PriorityBreakdown() {
  const total = priorityData.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">Priority Breakdown</CardTitle>
        <CardDescription>
          Open incidents by priority level
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <PieChart>
            <defs>
              <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.15"/>
              </filter>
            </defs>
            <ChartTooltip 
              content={<ChartTooltipContent />}
            />
            <Pie
              data={priorityData}
              cx="50%"
              cy="45%"
              innerRadius={55}
              outerRadius={90}
              paddingAngle={3}
              dataKey="value"
              nameKey="name"
              strokeWidth={0}
              label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
              labelLine={false}
              filter="url(#shadow)"
            >
              {priorityData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.fill}
                  style={{ outline: 'none' }}
                />
              ))}
            </Pie>
            <Legend 
              verticalAlign="bottom" 
              height={36}
              iconType="circle"
              iconSize={10}
              formatter={(value) => (
                <span className="text-sm text-foreground">{value}</span>
              )}
            />
          </PieChart>
        </ChartContainer>
        <div className="mt-2 flex items-center justify-center gap-6 border-t pt-4">
          <div className="text-center">
            <p className="text-3xl font-bold text-primary">{total}</p>
            <p className="text-xs text-muted-foreground">Total Open</p>
          </div>
          <div className="h-10 w-px bg-border" />
          <div className="text-center">
            <p className="text-3xl font-bold text-red-500">{priorityData[0].value}</p>
            <p className="text-xs text-muted-foreground">Critical</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
