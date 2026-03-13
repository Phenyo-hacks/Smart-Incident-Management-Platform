import { Suspense } from "react";
import { AnalyticsOverview } from "@/components/analytics/analytics-overview";
import { AnalyticsFilters } from "@/components/analytics/analytics-filters";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata = {
  title: "Analytics | SIMP",
  description: "Incident analytics and reporting",
};

function AnalyticsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-32" />
        ))}
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <Skeleton className="h-[400px]" />
        <Skeleton className="h-[400px]" />
      </div>
    </div>
  );
}

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground">
            Insights and metrics for incident management
          </p>
        </div>
        <AnalyticsFilters />
      </div>

      <Suspense fallback={<AnalyticsSkeleton />}>
        <AnalyticsOverview />
      </Suspense>
    </div>
  );
}
