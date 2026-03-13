import { Suspense } from "react";
import { CategoryManagement } from "@/components/admin/category-management";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata = {
  title: "Category Management | SIMP Admin",
  description: "Manage incident categories and subcategories",
};

function TableSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton key={i} className="h-16 w-full" />
      ))}
    </div>
  );
}

export default function AdminCategoriesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
        <p className="text-muted-foreground">
          Manage incident categories and subcategories
        </p>
      </div>
      <Suspense fallback={<TableSkeleton />}>
        <CategoryManagement />
      </Suspense>
    </div>
  );
}
