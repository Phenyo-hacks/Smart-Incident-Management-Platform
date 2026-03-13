// ============================================================================
// API Services - Maps to .NET Backend Endpoints
// ============================================================================

import { get, post, put, patch, del, uploadFile } from "./client";
import type {
  Incident,
  IncidentCategory,
  IncidentComment,
  IncidentAttachment,
  User,
  SupportGroup,
  SLAPolicy,
  RoutingRule,
  DashboardMetrics,
  Notification,
  PaginatedResponse,
  CreateIncidentRequest,
  UpdateIncidentRequest,
  ResolveIncidentRequest,
  AddCommentRequest,
  IncidentFilterParams,
  Role,
} from "@/types/domain";

// ============================================================================
// AUTH SERVICE
// ============================================================================

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: User;
}

export interface AzureAdLoginRequest {
  idToken: string;
}

export const authService = {
  login: (data: LoginRequest) =>
    post<LoginResponse>("/auth/login", data, { skipAuth: true }),

  azureAdLogin: (data: AzureAdLoginRequest) =>
    post<LoginResponse>("/auth/azure-ad", data, { skipAuth: true }),

  logout: () => post<void>("/auth/logout"),

  refreshToken: (refreshToken: string) =>
    post<LoginResponse>("/auth/refresh", { refreshToken }, { skipAuth: true }),

  getCurrentUser: () => get<User>("/auth/me"),

  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    post<void>("/auth/change-password", data),

  requestPasswordReset: (email: string) =>
    post<void>("/auth/forgot-password", { email }, { skipAuth: true }),

  resetPassword: (data: { token: string; newPassword: string }) =>
    post<void>("/auth/reset-password", data, { skipAuth: true }),
};

// ============================================================================
// INCIDENT SERVICE
// ============================================================================

export const incidentService = {
  // List & Search
  list: (params?: IncidentFilterParams) =>
    get<PaginatedResponse<Incident>>("/incidents", params as Record<string, string | number | boolean | string[] | undefined>),

  getById: (id: string) => get<Incident>(`/incidents/${id}`),

  getByNumber: (incidentNumber: string) =>
    get<Incident>(`/incidents/by-number/${incidentNumber}`),

  // CRUD
  create: (data: CreateIncidentRequest) => post<Incident>("/incidents", data),

  update: (id: string, data: UpdateIncidentRequest) =>
    patch<Incident>(`/incidents/${id}`, data),

  delete: (id: string) => del<void>(`/incidents/${id}`),

  // Workflow Actions
  assign: (id: string, assignedToId: string, assignedGroupId?: string) =>
    post<Incident>(`/incidents/${id}/assign`, { assignedToId, assignedGroupId }),

  escalate: (id: string, targetGroupId: string, reason: string) =>
    post<Incident>(`/incidents/${id}/escalate`, { targetGroupId, reason }),

  resolve: (id: string, data: ResolveIncidentRequest) =>
    post<Incident>(`/incidents/${id}/resolve`, data),

  close: (id: string) => post<Incident>(`/incidents/${id}/close`),

  reopen: (id: string, reason: string) =>
    post<Incident>(`/incidents/${id}/reopen`, { reason }),

  cancel: (id: string, reason: string) =>
    post<Incident>(`/incidents/${id}/cancel`, { reason }),

  // Comments
  getComments: (id: string) => get<IncidentComment[]>(`/incidents/${id}/comments`),

  addComment: (id: string, data: AddCommentRequest) =>
    post<IncidentComment>(`/incidents/${id}/comments`, data),

  updateComment: (incidentId: string, commentId: string, content: string) =>
    put<IncidentComment>(`/incidents/${incidentId}/comments/${commentId}`, {
      content,
    }),

  deleteComment: (incidentId: string, commentId: string) =>
    del<void>(`/incidents/${incidentId}/comments/${commentId}`),

  // Attachments
  getAttachments: (id: string) =>
    get<IncidentAttachment[]>(`/incidents/${id}/attachments`),

  uploadAttachment: (id: string, file: File, onProgress?: (p: number) => void) =>
    uploadFile(`/incidents/${id}/attachments`, file, onProgress),

  deleteAttachment: (incidentId: string, attachmentId: string) =>
    del<void>(`/incidents/${incidentId}/attachments/${attachmentId}`),

  // Relations
  linkIncidents: (
    sourceId: string,
    targetId: string,
    relationType: "Related" | "Duplicate" | "ParentChild"
  ) =>
    post<void>(`/incidents/${sourceId}/relations`, { targetId, relationType }),

  unlinkIncidents: (sourceId: string, relationId: string) =>
    del<void>(`/incidents/${sourceId}/relations/${relationId}`),

  // My Incidents
  getMyIncidents: (params?: Omit<IncidentFilterParams, "requesterId">) =>
    get<PaginatedResponse<Incident>>("/incidents/my-incidents", params as Record<string, string | number | boolean | string[] | undefined>),

  getAssignedToMe: (params?: Omit<IncidentFilterParams, "assignedToId">) =>
    get<PaginatedResponse<Incident>>("/incidents/assigned-to-me", params as Record<string, string | number | boolean | string[] | undefined>),
};

// ============================================================================
// CATEGORY SERVICE
// ============================================================================

export const categoryService = {
  list: () => get<IncidentCategory[]>("/categories"),

  getById: (id: string) => get<IncidentCategory>(`/categories/${id}`),

  create: (data: Partial<IncidentCategory>) =>
    post<IncidentCategory>("/categories", data),

  update: (id: string, data: Partial<IncidentCategory>) =>
    put<IncidentCategory>(`/categories/${id}`, data),

  delete: (id: string) => del<void>(`/categories/${id}`),

  reorder: (ids: string[]) => post<void>("/categories/reorder", { ids }),
};

// ============================================================================
// USER SERVICE
// ============================================================================

export const userService = {
  list: (params?: { search?: string; userType?: string; isActive?: boolean; pageNumber?: number; pageSize?: number }) =>
    get<PaginatedResponse<User>>("/users", params as Record<string, string | number | boolean | string[] | undefined>),

  getById: (id: string) => get<User>(`/users/${id}`),

  create: (data: Partial<User>) => post<User>("/users", data),

  update: (id: string, data: Partial<User>) => put<User>(`/users/${id}`, data),

  delete: (id: string) => del<void>(`/users/${id}`),

  activate: (id: string) => post<void>(`/users/${id}/activate`),

  deactivate: (id: string) => post<void>(`/users/${id}/deactivate`),

  getAgents: () => get<User[]>("/users/agents"),

  updateNotificationPreferences: (
    id: string,
    preferences: Partial<User["notificationPreferences"]>
  ) => patch<void>(`/users/${id}/notification-preferences`, preferences),
};

// ============================================================================
// SUPPORT GROUP SERVICE
// ============================================================================

export const supportGroupService = {
  list: () => get<SupportGroup[]>("/support-groups"),

  getById: (id: string) => get<SupportGroup>(`/support-groups/${id}`),

  create: (data: Partial<SupportGroup>) =>
    post<SupportGroup>("/support-groups", data),

  update: (id: string, data: Partial<SupportGroup>) =>
    put<SupportGroup>(`/support-groups/${id}`, data),

  delete: (id: string) => del<void>(`/support-groups/${id}`),

  addMember: (groupId: string, userId: string) =>
    post<void>(`/support-groups/${groupId}/members`, { userId }),

  removeMember: (groupId: string, userId: string) =>
    del<void>(`/support-groups/${groupId}/members/${userId}`),

  getMembers: (groupId: string) =>
    get<User[]>(`/support-groups/${groupId}/members`),
};

// ============================================================================
// SLA SERVICE
// ============================================================================

export const slaService = {
  list: () => get<SLAPolicy[]>("/sla-policies"),

  getById: (id: string) => get<SLAPolicy>(`/sla-policies/${id}`),

  create: (data: Partial<SLAPolicy>) => post<SLAPolicy>("/sla-policies", data),

  update: (id: string, data: Partial<SLAPolicy>) =>
    put<SLAPolicy>(`/sla-policies/${id}`, data),

  delete: (id: string) => del<void>(`/sla-policies/${id}`),
};

// ============================================================================
// ROUTING SERVICE
// ============================================================================

export const routingService = {
  list: () => get<RoutingRule[]>("/routing-rules"),

  getById: (id: string) => get<RoutingRule>(`/routing-rules/${id}`),

  create: (data: Partial<RoutingRule>) =>
    post<RoutingRule>("/routing-rules", data),

  update: (id: string, data: Partial<RoutingRule>) =>
    put<RoutingRule>(`/routing-rules/${id}`, data),

  delete: (id: string) => del<void>(`/routing-rules/${id}`),

  reorder: (ids: string[]) => post<void>("/routing-rules/reorder", { ids }),

  test: (incidentData: Partial<CreateIncidentRequest>) =>
    post<{ matchedRule: RoutingRule | null; targetGroup: SupportGroup | null }>(
      "/routing-rules/test",
      incidentData
    ),
};

// ============================================================================
// ANALYTICS SERVICE
// ============================================================================

export const analyticsService = {
  getDashboardMetrics: (params?: { from?: string; to?: string }) =>
    get<DashboardMetrics>("/analytics/dashboard", params),

  getIncidentTrends: (params: { from: string; to: string; interval: "day" | "week" | "month" }) =>
    get<{ date: string; created: number; resolved: number }[]>(
      "/analytics/incident-trends",
      params
    ),

  getCategoryBreakdown: (params?: { from?: string; to?: string }) =>
    get<{ category: string; count: number; percentage: number }[]>(
      "/analytics/category-breakdown",
      params
    ),

  getSLACompliance: (params?: { from?: string; to?: string }) =>
    get<{
      overall: number;
      byPriority: Record<string, number>;
      byGroup: { groupName: string; compliance: number }[];
    }>("/analytics/sla-compliance", params),

  getAgentPerformance: (params?: { from?: string; to?: string; groupId?: string }) =>
    get<
      {
        agentId: string;
        agentName: string;
        assigned: number;
        resolved: number;
        avgResolutionTime: number;
        slaCompliance: number;
      }[]
    >("/analytics/agent-performance", params),

  getBacklogAging: () =>
    get<{ range: string; count: number }[]>("/analytics/backlog-aging"),

  exportReport: (params: {
    type: "incidents" | "sla" | "performance";
    format: "csv" | "xlsx" | "pdf";
    from?: string;
    to?: string;
  }) => get<Blob>("/analytics/export", params),
};

// ============================================================================
// NOTIFICATION SERVICE
// ============================================================================

export const notificationService = {
  list: (params?: { isRead?: boolean; pageNumber?: number; pageSize?: number }) =>
    get<PaginatedResponse<Notification>>("/notifications", params),

  getUnreadCount: () => get<{ count: number }>("/notifications/unread-count"),

  markAsRead: (id: string) => patch<void>(`/notifications/${id}/read`),

  markAllAsRead: () => post<void>("/notifications/mark-all-read"),

  delete: (id: string) => del<void>(`/notifications/${id}`),
};

// ============================================================================
// ROLE SERVICE
// ============================================================================

export const roleService = {
  list: () => get<Role[]>("/roles"),

  getById: (id: string) => get<Role>(`/roles/${id}`),

  create: (data: Partial<Role>) => post<Role>("/roles", data),

  update: (id: string, data: Partial<Role>) => put<Role>(`/roles/${id}`, data),

  delete: (id: string) => del<void>(`/roles/${id}`),

  getPermissions: () => get<{ name: string; description: string }[]>("/roles/permissions"),
};
