"use client";

import useSWR from "swr";
import { analyticsService } from "@/lib/api/services";
import type { DashboardMetrics } from "@/types/domain";

// ============================================================================
// Keys
// ============================================================================

export const analyticsKeys = {
  all: ["analytics"] as const,
  dashboard: (params?: { from?: string; to?: string }) =>
    [...analyticsKeys.all, "dashboard", params] as const,
  trends: (params: { from: string; to: string; interval: string }) =>
    [...analyticsKeys.all, "trends", params] as const,
  categoryBreakdown: (params?: { from?: string; to?: string }) =>
    [...analyticsKeys.all, "category-breakdown", params] as const,
  slaCompliance: (params?: { from?: string; to?: string }) =>
    [...analyticsKeys.all, "sla-compliance", params] as const,
  agentPerformance: (params?: { from?: string; to?: string; groupId?: string }) =>
    [...analyticsKeys.all, "agent-performance", params] as const,
  backlogAging: () => [...analyticsKeys.all, "backlog-aging"] as const,
};

// ============================================================================
// Hooks
// ============================================================================

export function useDashboardMetrics(params?: { from?: string; to?: string }) {
  return useSWR<DashboardMetrics>(
    analyticsKeys.dashboard(params),
    () => analyticsService.getDashboardMetrics(params),
    {
      revalidateOnFocus: false,
      refreshInterval: 60000, // Refresh every minute
    }
  );
}

export function useIncidentTrends(params: {
  from: string;
  to: string;
  interval: "day" | "week" | "month";
}) {
  return useSWR(
    analyticsKeys.trends(params),
    () => analyticsService.getIncidentTrends(params),
    {
      revalidateOnFocus: false,
    }
  );
}

export function useCategoryBreakdown(params?: { from?: string; to?: string }) {
  return useSWR(
    analyticsKeys.categoryBreakdown(params),
    () => analyticsService.getCategoryBreakdown(params),
    {
      revalidateOnFocus: false,
    }
  );
}

export function useSLACompliance(params?: { from?: string; to?: string }) {
  return useSWR(
    analyticsKeys.slaCompliance(params),
    () => analyticsService.getSLACompliance(params),
    {
      revalidateOnFocus: false,
    }
  );
}

export function useAgentPerformance(params?: {
  from?: string;
  to?: string;
  groupId?: string;
}) {
  return useSWR(
    analyticsKeys.agentPerformance(params),
    () => analyticsService.getAgentPerformance(params),
    {
      revalidateOnFocus: false,
    }
  );
}

export function useBacklogAging() {
  return useSWR(
    analyticsKeys.backlogAging(),
    () => analyticsService.getBacklogAging(),
    {
      revalidateOnFocus: false,
    }
  );
}
