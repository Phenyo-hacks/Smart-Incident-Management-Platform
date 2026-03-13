"use client";

import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import {
  categoryService,
  userService,
  supportGroupService,
  slaService,
  routingService,
  notificationService,
} from "@/lib/api/services";
import type {
  IncidentCategory,
  User,
  SupportGroup,
  SLAPolicy,
  RoutingRule,
  Notification,
  PaginatedResponse,
} from "@/types/domain";

// ============================================================================
// Keys
// ============================================================================

export const dataKeys = {
  categories: ["categories"] as const,
  users: (params?: Record<string, unknown>) => ["users", params] as const,
  user: (id: string) => ["users", id] as const,
  agents: ["agents"] as const,
  supportGroups: ["support-groups"] as const,
  supportGroup: (id: string) => ["support-groups", id] as const,
  slaPolicies: ["sla-policies"] as const,
  routingRules: ["routing-rules"] as const,
  notifications: (params?: Record<string, unknown>) => ["notifications", params] as const,
  unreadCount: ["notifications", "unread-count"] as const,
};

// ============================================================================
// Category Hooks
// ============================================================================

export function useCategories() {
  return useSWR<IncidentCategory[]>(
    dataKeys.categories,
    () => categoryService.list(),
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000, // Cache for 1 minute
    }
  );
}

// ============================================================================
// User Hooks
// ============================================================================

export function useUsers(params?: {
  search?: string;
  userType?: string;
  isActive?: boolean;
  pageNumber?: number;
  pageSize?: number;
}) {
  return useSWR<PaginatedResponse<User>>(
    dataKeys.users(params),
    () => userService.list(params),
    {
      revalidateOnFocus: false,
      keepPreviousData: true,
    }
  );
}

export function useUser(id: string | undefined) {
  return useSWR<User>(
    id ? dataKeys.user(id) : null,
    () => userService.getById(id!),
    {
      revalidateOnFocus: false,
    }
  );
}

export function useAgents() {
  return useSWR<User[]>(
    dataKeys.agents,
    () => userService.getAgents(),
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
    }
  );
}

// ============================================================================
// Support Group Hooks
// ============================================================================

export function useSupportGroups() {
  return useSWR<SupportGroup[]>(
    dataKeys.supportGroups,
    () => supportGroupService.list(),
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
    }
  );
}

export function useSupportGroup(id: string | undefined) {
  return useSWR<SupportGroup>(
    id ? dataKeys.supportGroup(id) : null,
    () => supportGroupService.getById(id!),
    {
      revalidateOnFocus: false,
    }
  );
}

// ============================================================================
// SLA Hooks
// ============================================================================

export function useSLAPolicies() {
  return useSWR<SLAPolicy[]>(
    dataKeys.slaPolicies,
    () => slaService.list(),
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
    }
  );
}

// ============================================================================
// Routing Hooks
// ============================================================================

export function useRoutingRules() {
  return useSWR<RoutingRule[]>(
    dataKeys.routingRules,
    () => routingService.list(),
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
    }
  );
}

// ============================================================================
// Notification Hooks
// ============================================================================

export function useNotifications(params?: {
  isRead?: boolean;
  pageNumber?: number;
  pageSize?: number;
}) {
  return useSWR<PaginatedResponse<Notification>>(
    dataKeys.notifications(params),
    () => notificationService.list(params),
    {
      revalidateOnFocus: false,
      refreshInterval: 30000, // Check every 30 seconds
    }
  );
}

export function useUnreadNotificationCount() {
  return useSWR<{ count: number }>(
    dataKeys.unreadCount,
    () => notificationService.getUnreadCount(),
    {
      revalidateOnFocus: true,
      refreshInterval: 30000,
    }
  );
}

export function useMarkNotificationRead() {
  return useSWRMutation(
    dataKeys.notifications(),
    async (_key: unknown, { arg }: { arg: string }) => {
      return notificationService.markAsRead(arg);
    }
  );
}

export function useMarkAllNotificationsRead() {
  return useSWRMutation(
    dataKeys.notifications(),
    async () => {
      return notificationService.markAllAsRead();
    }
  );
}
