import { Suspense } from "react";
import { IncidentDetail } from "@/components/incidents/incident-detail";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata = {
  title: "Incident Details | SIMP",
  description: "View incident details",
};

function DetailSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-10 w-1/3" />
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Skeleton className="h-64" />
          <Skeleton className="h-48" />
        </div>
        <div className="space-y-6">
          <Skeleton className="h-48" />
          <Skeleton className="h-32" />
        </div>
      </div>
    </div>
  );
}

export default async function IncidentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  
  return (
    <Suspense fallback={<DetailSkeleton />}>
      <IncidentDetail incidentId={id} />
    </Suspense>
  );
}
