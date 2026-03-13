import { Suspense } from "react";
import { IncidentList } from "@/components/incidents/incident-list";
import { IncidentFilters } from "@/components/incidents/incident-filters";
import { IncidentListHeader } from "@/components/incidents/incident-list-header";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata = {
  title: "All Incidents | SIMP",
  description: "View and manage all incidents",
};

function TableSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-10 w-full" />
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton key={i} className="h-16 w-full" />
      ))}
    </div>
  );
}

export default function IncidentsPage() {
  return (
    <div className="space-y-6">
      <IncidentListHeader title="All Incidents" />
      <IncidentFilters />
      <Suspense fallback={<TableSkeleton />}>
        <IncidentList />
      </Suspense>
    </div>
  );
}
