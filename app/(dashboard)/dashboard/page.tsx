import { Suspense } from "react";
import { DashboardMetrics } from "@/components/dashboard/dashboard-metrics";
import { IncidentTrendChart } from "@/components/dashboard/incident-trend-chart";
import { PriorityBreakdown } from "@/components/dashboard/priority-breakdown";
import { RecentIncidents } from "@/components/dashboard/recent-incidents";
import { SLAStatus } from "@/components/dashboard/sla-status";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata = {
  title: "Dashboard | SIMP",
  description: "Smart Incident Management Platform Dashboard",
};

function MetricsSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={i} className="h-32" />
      ))}
    </div>
  );
}

function ChartSkeleton() {
  return <Skeleton className="h-[350px]" />;
}

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of your incident management system
          </p>
        </div>
        <QuickActions />
      </div>

      {/* Metrics Cards */}
      <Suspense fallback={<MetricsSkeleton />}>
        <DashboardMetrics />
      </Suspense>

      {/* Charts Row */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <div className="lg:col-span-4">
          <Suspense fallback={<ChartSkeleton />}>
            <IncidentTrendChart />
          </Suspense>
        </div>
        <div className="lg:col-span-3">
          <Suspense fallback={<ChartSkeleton />}>
            <PriorityBreakdown />
          </Suspense>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid gap-6 md:grid-cols-2">
        <Suspense fallback={<ChartSkeleton />}>
          <RecentIncidents />
        </Suspense>
        <Suspense fallback={<ChartSkeleton />}>
          <SLAStatus />
        </Suspense>
      </div>
    </div>
  );
}
