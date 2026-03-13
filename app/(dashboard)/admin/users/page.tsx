import { Suspense } from "react";
import { UserManagement } from "@/components/admin/user-management";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata = {
  title: "User Management | SIMP Admin",
  description: "Manage users and their roles",
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

export default function AdminUsersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
        <p className="text-muted-foreground">
          Manage users, roles, and permissions
        </p>
      </div>
      <Suspense fallback={<TableSkeleton />}>
        <UserManagement />
      </Suspense>
    </div>
  );
}
