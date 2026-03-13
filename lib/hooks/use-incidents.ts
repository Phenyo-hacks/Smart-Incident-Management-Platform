"use client";

import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import { incidentService } from "@/lib/api/services";
import type {
  Incident,
  IncidentFilterParams,
  CreateIncidentRequest,
  UpdateIncidentRequest,
  ResolveIncidentRequest,
  AddCommentRequest,
  PaginatedResponse,
} from "@/types/domain";

// ============================================================================
// Keys
// ============================================================================

export const incidentKeys = {
  all: ["incidents"] as const,
  lists: () => [...incidentKeys.all, "list"] as const,
  list: (params?: IncidentFilterParams) =>
    [...incidentKeys.lists(), params] as const,
  details: () => [...incidentKeys.all, "detail"] as const,
  detail: (id: string) => [...incidentKeys.details(), id] as const,
  myIncidents: (params?: IncidentFilterParams) =>
    [...incidentKeys.all, "my-incidents", params] as const,
  assignedToMe: (params?: IncidentFilterParams) =>
    [...incidentKeys.all, "assigned-to-me", params] as const,
  comments: (id: string) => [...incidentKeys.detail(id), "comments"] as const,
  attachments: (id: string) =>
    [...incidentKeys.detail(id), "attachments"] as const,
};

// ============================================================================
// List Hooks
// ============================================================================

export function useIncidents(params?: IncidentFilterParams) {
  return useSWR<PaginatedResponse<Incident>>(
    incidentKeys.list(params),
    () => incidentService.list(params),
    {
      revalidateOnFocus: false,
      keepPreviousData: true,
    }
  );
}

export function useMyIncidents(params?: Omit<IncidentFilterParams, "requesterId">) {
  return useSWR<PaginatedResponse<Incident>>(
    incidentKeys.myIncidents(params),
    () => incidentService.getMyIncidents(params),
    {
      revalidateOnFocus: false,
      keepPreviousData: true,
    }
  );
}

export function useAssignedIncidents(
  params?: Omit<IncidentFilterParams, "assignedToId">
) {
  return useSWR<PaginatedResponse<Incident>>(
    incidentKeys.assignedToMe(params),
    () => incidentService.getAssignedToMe(params),
    {
      revalidateOnFocus: false,
      keepPreviousData: true,
    }
  );
}

// ============================================================================
// Detail Hooks
// ============================================================================

export function useIncident(id: string | undefined) {
  return useSWR<Incident>(
    id ? incidentKeys.detail(id) : null,
    () => incidentService.getById(id!),
    {
      revalidateOnFocus: false,
    }
  );
}

export function useIncidentComments(id: string | undefined) {
  return useSWR(
    id ? incidentKeys.comments(id) : null,
    () => incidentService.getComments(id!),
    {
      revalidateOnFocus: false,
    }
  );
}

export function useIncidentAttachments(id: string | undefined) {
  return useSWR(
    id ? incidentKeys.attachments(id) : null,
    () => incidentService.getAttachments(id!),
    {
      revalidateOnFocus: false,
    }
  );
}

// ============================================================================
// Mutation Hooks
// ============================================================================

export function useCreateIncident() {
  return useSWRMutation(
    incidentKeys.lists(),
    async (_key: unknown, { arg }: { arg: CreateIncidentRequest }) => {
      return incidentService.create(arg);
    }
  );
}

export function useUpdateIncident(id: string) {
  return useSWRMutation(
    incidentKeys.detail(id),
    async (_key: unknown, { arg }: { arg: UpdateIncidentRequest }) => {
      return incidentService.update(id, arg);
    }
  );
}

export function useAssignIncident(id: string) {
  return useSWRMutation(
    incidentKeys.detail(id),
    async (
      _key: unknown,
      { arg }: { arg: { assignedToId: string; assignedGroupId?: string } }
    ) => {
      return incidentService.assign(id, arg.assignedToId, arg.assignedGroupId);
    }
  );
}

export function useEscalateIncident(id: string) {
  return useSWRMutation(
    incidentKeys.detail(id),
    async (
      _key: unknown,
      { arg }: { arg: { targetGroupId: string; reason: string } }
    ) => {
      return incidentService.escalate(id, arg.targetGroupId, arg.reason);
    }
  );
}

export function useResolveIncident(id: string) {
  return useSWRMutation(
    incidentKeys.detail(id),
    async (_key: unknown, { arg }: { arg: ResolveIncidentRequest }) => {
      return incidentService.resolve(id, arg);
    }
  );
}

export function useCloseIncident(id: string) {
  return useSWRMutation(incidentKeys.detail(id), async () => {
    return incidentService.close(id);
  });
}

export function useReopenIncident(id: string) {
  return useSWRMutation(
    incidentKeys.detail(id),
    async (_key: unknown, { arg }: { arg: { reason: string } }) => {
      return incidentService.reopen(id, arg.reason);
    }
  );
}

export function useAddComment(incidentId: string) {
  return useSWRMutation(
    incidentKeys.comments(incidentId),
    async (_key: unknown, { arg }: { arg: AddCommentRequest }) => {
      return incidentService.addComment(incidentId, arg);
    }
  );
}

export function useDeleteIncident(id: string) {
  return useSWRMutation(incidentKeys.detail(id), async () => {
    return incidentService.delete(id);
  });
}
