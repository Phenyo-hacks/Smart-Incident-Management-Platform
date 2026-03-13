import { Suspense } from "react";
import { GroupManagement } from "@/components/admin/group-management";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata = {
  title: "Support Groups | SIMP Admin",
  description: "Manage support groups and team assignments",
};

function GridSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <Skeleton key={i} className="h-48" />
      ))}
    </div>
  );
}

export default function AdminGroupsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Support Groups</h1>
        <p className="text-muted-foreground">
          Manage support teams and their assignments
        </p>
      </div>
      <Suspense fallback={<GridSkeleton />}>
        <GroupManagement />
      </Suspense>
    </div>
  );
}
