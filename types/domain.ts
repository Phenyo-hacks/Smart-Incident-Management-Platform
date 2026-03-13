/**
 * ============================================================================
 * SMART INCIDENT MANAGEMENT PLATFORM - DOMAIN TYPES
 * ============================================================================
 * 
 * This file contains ALL TypeScript types for the frontend.
 * These types MIRROR the C# classes in your .NET backend.
 * 
 * WHY TYPES MATTER:
 * - TypeScript catches errors at compile time, not runtime
 * - Your IDE provides autocomplete and documentation
 * - Refactoring is safer - change a type and see all affected code
 * 
 * NAMING CONVENTION:
 * - Interfaces: PascalCase (e.g., Incident, User)
 * - Enums: PascalCase with PascalCase values
 * - Types: PascalCase
 * 
 * HOW THIS MAPS TO .NET:
 * TypeScript Interface -> C# Class
 * TypeScript Enum     -> C# Enum
 * string              -> string or Guid (as string)
 * number              -> int, decimal, double
 * boolean             -> bool
 * string (ISO date)   -> DateTime
 * ============================================================================
 */

// ============================================================================
// ENUMS - Fixed sets of values
// ============================================================================

/**
 * Incident Status Enum
 * 
 * Represents the lifecycle state of an incident.
 * These values MUST match your C# IncidentStatus enum exactly.
 * 
 * STATE MACHINE FLOW:
 * ┌─────┐    ┌──────┐    ┌────────────┐    ┌─────────┐    ┌──────────┐    ┌────────┐
 * │ New │ -> │ Open │ -> │ InProgress │ -> │ Pending │ -> │ Resolved │ -> │ Closed │
 * └─────┘    └──────┘    └────────────┘    └─────────┘    └──────────┘    └────────┘
 *                              │                               │
 *                              v                               v
 *                        ┌──────────┐                    ┌──────────┐
 *                        │ Reopened │ <------------------ │ (if issue│
 *                        └──────────┘                    │ persists)│
 *                                                        └──────────┘
 */
export enum IncidentStatus {
  /** Just created, not yet triaged or assigned */
  New = "New",
  
  /** Triaged by dispatcher, waiting for agent assignment */
  Open = "Open",
  
  /** Agent is actively working on this incident */
  InProgress = "InProgress",
  
  /** Waiting for customer response or external dependency */
  Pending = "Pending",
  
  /** Solution provided, waiting for customer confirmation */
  Resolved = "Resolved",
  
  /** Confirmed resolved, incident is archived */
  Closed = "Closed",
  
  /** Customer reported issue persists after resolution */
  Reopened = "Reopened",
  
  /** Invalid, duplicate, or withdrawn request */
  Cancelled = "Cancelled",
}

/**
 * Incident Priority Enum
 * 
 * Determines SLA targets and urgency of response.
 * Priority is typically calculated from Impact x Urgency matrix.
 * 
 * SLA TARGETS (example - configure in SLAPolicy):
 * P1: 1hr response,  4hr resolution  - "The building is on fire"
 * P2: 4hr response,  24hr resolution - "Major feature is broken"
 * P3: 8hr response,  48hr resolution - "Something is wrong but we can work"
 * P4: 24hr response, 120hr resolution - "Nice to have fix"
 */
export enum IncidentPriority {
  /** Critical: Business-stopping issue affecting many users */
  P1 = "P1",
  
  /** High: Major functionality broken, no workaround */
  P2 = "P2",
  
  /** Medium: Feature broken but workaround exists */
  P3 = "P3",
  
  /** Low: Minor inconvenience or enhancement request */
  P4 = "P4",
}

/**
 * Impact Level Enum
 * 
 * Measures HOW MANY users/systems are affected.
 * Combined with Urgency to calculate Priority.
 */
export enum ImpactLevel {
  /** Entire organization or critical system affected */
  High = "High",
  
  /** Department or significant user group affected */
  Medium = "Medium",
  
  /** Single user or non-critical system affected */
  Low = "Low",
}

/**
 * Urgency Level Enum
 * 
 * Measures HOW QUICKLY the issue needs resolution.
 * Combined with Impact to calculate Priority.
 */
export enum UrgencyLevel {
  /** Business deadline or critical operation at risk */
  High = "High",
  
  /** Important but not immediately critical */
  Medium = "Medium",
  
  /** Can wait, no immediate business impact */
  Low = "Low",
}

/**
 * SLA Breach Status Enum
 * 
 * Tracks whether SLA targets are being met.
 * This affects escalation and reporting.
 */
export enum SLABreachStatus {
  /** All SLA targets on track */
  OnTrack = "OnTrack",
  
  /** Less than 25% time remaining - warning state */
  AtRisk = "AtRisk",
  
  /** Response time target was missed */
  ResponseBreached = "ResponseBreached",
  
  /** Resolution time target was missed */
  ResolutionBreached = "ResolutionBreached",
}

/**
 * Resolution Code Enum
 * 
 * Categorizes HOW an incident was resolved.
 * Used for reporting and knowledge base.
 */
export enum ResolutionCode {
  /** Root cause identified and fixed */
  Fixed = "Fixed",
  
  /** Temporary solution applied, permanent fix pending */
  Workaround = "Workaround",
  
  /** Unable to replicate the issue */
  CannotReproduce = "CannotReproduce",
  
  /** Issue caused by user error, not a system fault */
  UserError = "UserError",
  
  /** Existing known issue, documented in knowledge base */
  KnownError = "KnownError",
  
  /** Duplicate of another incident */
  Duplicate = "Duplicate",
  
  /** Not actually an issue, working as designed */
  NotAnIssue = "NotAnIssue",
}

/**
 * User Type Enum
 * 
 * Determines what a user can do in the system.
 */
export enum UserType {
  /** Can only create and view their own incidents */
  Requester = "Requester",
  
  /** Can work on and resolve incidents */
  Agent = "Agent",
  
  /** Full system access including configuration */
  Admin = "Admin",
}

/**
 * Support Group Type Enum
 * 
 * Categorizes support groups by skill level.
 * Used for escalation paths.
 */
export enum GroupType {
  /** First line - handles initial triage and common issues */
  L1 = "L1",
  
  /** Second line - handles escalated technical issues */
  L2 = "L2",
  
  /** Third line - handles complex issues requiring specialists */
  L3 = "L3",
  
  /** Specialized teams (e.g., Security, Network) */
  Specialized = "Specialized",
}

/**
 * Routing Strategy Enum
 * 
 * Determines how incidents are assigned to agents.
 */
export enum RoutingStrategy {
  /** Assign to agents in rotation */
  RoundRobin = "RoundRobin",
  
  /** Assign to agent with fewest open incidents */
  LeastBusy = "LeastBusy",
  
  /** Assign based on agent skills matching incident category */
  SkillBased = "SkillBased",
}


// ============================================================================
// CORE ENTITIES - The main objects in our system
// ============================================================================

/**
 * Incident Interface
 * 
 * The CENTRAL entity of the system. Everything revolves around incidents.
 * This is what your API returns from GET /api/incidents/{id}
 * 
 * MAPS TO: SIMP.Core.Entities.Incident in your .NET backend
 */
export interface Incident {
  // ===== Identifiers =====
  /** Unique identifier (GUID from .NET) */
  id: string;
  
  /** Human-readable number like "INC-2024-0001" */
  incidentNumber: string;
  
  // ===== Core Information =====
  /** Brief description of the issue */
  title: string;
  
  /** Detailed description with steps to reproduce */
  description: string;
  
  /** Current lifecycle state */
  status: IncidentStatus;
  
  /** Urgency/importance level */
  priority: IncidentPriority;
  
  /** Category for routing and reporting */
  category: IncidentCategory;
  
  /** Optional subcategory for more specific classification */
  subcategory?: IncidentSubcategory;
  
  // ===== Impact Assessment =====
  /** How many users/systems affected */
  impact: ImpactLevel;
  
  /** How quickly it needs resolution */
  urgency: UrgencyLevel;
  
  // ===== Ownership (WHO is involved) =====
  /** ID of the person who reported the incident */
  requesterId: string;
  
  /** Full requester object (when loaded) */
  requester?: User;
  
  /** ID of the agent working on it (null if unassigned) */
  assignedToId?: string;
  
  /** Full assignee object (when loaded) */
  assignedTo?: User;
  
  /** ID of the responsible support group */
  assignedGroupId?: string;
  
  /** Full group object (when loaded) */
  assignedGroup?: SupportGroup;
  
  // ===== Timestamps (WHEN things happened) =====
  /** When the incident was created (ISO 8601 format) */
  createdAt: string;
  
  /** When the incident was last modified */
  updatedAt?: string;
  
  /** When it was marked as Resolved */
  resolvedAt?: string;
  
  /** When it was marked as Closed */
  closedAt?: string;
  
  // ===== SLA Tracking =====
  /** SLA target times and breach status */
  slaTarget: SLATarget;
  
  /** When an agent first responded */
  firstResponseAt?: string;
  
  /** Current SLA breach status */
  slaBreachStatus: SLABreachStatus;
  
  // ===== Resolution Details =====
  /** Notes explaining how it was resolved */
  resolutionNotes?: string;
  
  /** Category of resolution */
  resolutionCode?: ResolutionCode;
  
  /** Has this incident been reopened before? */
  isReopened: boolean;
  
  /** How many times it's been reopened */
  reopenCount: number;
  
  // ===== Related Data (loaded on demand) =====
  /** Comments/notes on this incident */
  comments?: IncidentComment[];
  
  /** Files attached to this incident */
  attachments?: IncidentAttachment[];
  
  /** Audit trail of all changes */
  history?: IncidentHistory[];
  
  /** Related incidents (duplicates, parent/child) */
  relatedIncidents?: IncidentRelation[];
}

/**
 * SLA Target Interface
 * 
 * Contains SLA deadlines and breach status.
 * Embedded within Incident.
 */
export interface SLATarget {
  /** Deadline for first response (ISO 8601) */
  targetResponseTime: string;
  
  /** Deadline for resolution (ISO 8601) */
  targetResolutionTime: string;
  
  /** Has response deadline passed without response? */
  isResponseBreached: boolean;
  
  /** Has resolution deadline passed without resolution? */
  isResolutionBreached: boolean;
  
  /** Overall breach status */
  breachStatus: SLABreachStatus;
}

/**
 * Incident Category Interface
 * 
 * Categories help route incidents to the right team
 * and enable meaningful reporting.
 */
export interface IncidentCategory {
  id: string;
  name: string;
  description?: string;
  
  /** Parent category ID for hierarchy */
  parentId?: string;
  
  /** Whether this category is available for new incidents */
  isActive: boolean;
  
  /** Display order in dropdowns */
  sortOrder: number;
  
  /** Child categories */
  subcategories?: IncidentSubcategory[];
}

/**
 * Incident Subcategory Interface
 * 
 * Second level of categorization.
 */
export interface IncidentSubcategory {
  id: string;
  categoryId: string;
  name: string;
  description?: string;
  isActive: boolean;
  sortOrder: number;
}

/**
 * Incident Comment Interface
 * 
 * Notes and updates on an incident.
 * Can be internal (agent-only) or external (visible to requester).
 */
export interface IncidentComment {
  id: string;
  incidentId: string;
  
  /** The comment text (supports markdown) */
  content: string;
  
  /** Who wrote this comment */
  authorId: string;
  author?: User;
  
  /** If true, only agents can see this comment */
  isInternal: boolean;
  
  createdAt: string;
  editedAt?: string;
}

/**
 * Incident Attachment Interface
 * 
 * Files attached to an incident (screenshots, logs, etc.)
 */
export interface IncidentAttachment {
  id: string;
  incidentId: string;
  
  /** Original file name */
  fileName: string;
  
  /** URL to download the file (from Azure Blob Storage) */
  fileUrl: string;
  
  /** File size for display */
  fileSizeBytes: number;
  
  /** MIME type (e.g., "image/png", "application/pdf") */
  contentType: string;
  
  uploadedById: string;
  uploadedBy?: User;
  uploadedAt: string;
}

/**
 * Incident History Interface
 * 
 * Audit trail of all changes to an incident.
 * Every status change, assignment, edit is recorded here.
 */
export interface IncidentHistory {
  id: string;
  incidentId: string;
  
  /** What happened (e.g., "Status Changed", "Assigned") */
  action: string;
  
  /** Which field changed (if applicable) */
  field?: string;
  
  /** Previous value */
  oldValue?: string;
  
  /** New value */
  newValue?: string;
  
  /** Who made the change */
  performedById: string;
  performedBy?: User;
  
  performedAt: string;
  notes?: string;
}

/**
 * Incident Relation Interface
 * 
 * Links between related incidents.
 */
export interface IncidentRelation {
  id: string;
  sourceIncidentId: string;
  targetIncidentId: string;
  targetIncident?: Incident;
  
  /** Type of relationship */
  relationType: "Related" | "Duplicate" | "ParentChild";
  
  createdAt: string;
}


// ============================================================================
// USER & PERMISSIONS
// ============================================================================

/**
 * User Interface
 * 
 * Represents anyone who uses the system.
 * 
 * MAPS TO: SIMP.Core.Entities.User in your .NET backend
 */
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  
  /** Full name for display (e.g., "Thabo Mokoena") */
  displayName: string;
  
  /** Profile picture URL */
  avatarUrl?: string;
  
  /** What they can do in the system */
  userType: UserType;
  
  /** Can they log in? */
  isActive: boolean;
  
  department?: string;
  jobTitle?: string;
  
  /** South African phone format: +27 XX XXX XXXX */
  phone?: string;
  
  /** For scheduling and SLA calculations */
  timezone?: string;
  
  /** Email/SMS preferences */
  notificationPreferences?: NotificationPreferences;
  
  /** Assigned roles (for RBAC) */
  roles?: Role[];
  
  createdAt: string;
  lastLoginAt?: string;
}

/**
 * Role Interface
 * 
 * Groups permissions together for easier management.
 * Example roles: "Senior Agent", "System Administrator"
 */
export interface Role {
  id: string;
  name: string;
  description?: string;
  
  /** List of permission strings (e.g., "incidents.create", "admin.users.view") */
  permissions: string[];
  
  /** System roles can't be deleted */
  isSystemRole: boolean;
}

/**
 * Notification Preferences Interface
 * 
 * User's choices for how they want to be notified.
 */
export interface NotificationPreferences {
  emailEnabled: boolean;
  smsEnabled: boolean;
  inAppEnabled: boolean;
  
  // Specific event preferences
  emailOnAssignment: boolean;
  emailOnStatusChange: boolean;
  emailOnComment: boolean;
  emailOnSLABreach: boolean;
  dailyDigest: boolean;
}

/**
 * Support Group Interface
 * 
 * A team of agents who handle incidents.
 */
export interface SupportGroup {
  id: string;
  name: string;
  description?: string;
  
  /** L1, L2, L3, or Specialized */
  type: GroupType;
  
  /** Agents in this group */
  members?: User[];
  memberCount?: number;
  
  /** Categories this group can handle */
  supportedCategories?: IncidentCategory[];
  
  /** When they work (for SLA calculations) */
  workingHours?: Schedule;
  
  /** How incidents are assigned within the group */
  routingStrategy: RoutingStrategy;
  
  isActive: boolean;
}

/**
 * Schedule Interface
 * 
 * Defines working hours for SLA calculations.
 */
export interface Schedule {
  /** IANA timezone (e.g., "Africa/Johannesburg") */
  timezone: string;
  
  /** 0 = Sunday, 6 = Saturday */
  workingDays: number[];
  
  /** Start time in HH:mm format */
  startTime: string;
  
  /** End time in HH:mm format */
  endTime: string;
  
  /** Public holidays when SLA clock pauses */
  holidays?: string[];
}


// ============================================================================
// SLA & WORKFLOW CONFIGURATION
// ============================================================================

/**
 * SLA Policy Interface
 * 
 * Defines response and resolution targets for each priority level.
 */
export interface SLAPolicy {
  id: string;
  name: string;
  description?: string;
  
  /** Which priority this policy applies to */
  priority: IncidentPriority;
  
  /** Response time in minutes (e.g., 60 = 1 hour) */
  responseTimeMinutes: number;
  
  /** Resolution time in hours (e.g., 4 = 4 hours) */
  resolutionTimeHours: number;
  
  /** What happens when SLA is breached */
  escalationRules?: EscalationRule[];
  
  isActive: boolean;
}

/**
 * Escalation Rule Interface
 * 
 * Defines automatic actions when SLA is at risk or breached.
 */
export interface EscalationRule {
  id: string;
  slaPolicyId: string;
  name: string;
  
  /** What triggers this rule */
  triggerType: "ResponseBreach" | "ResolutionBreach" | "PercentageRemaining";
  
  /** Percentage or minutes depending on trigger type */
  triggerValue: number;
  
  /** Users to notify */
  notifyUserIds?: string[];
  
  /** Groups to notify */
  notifyGroupIds?: string[];
  
  /** Optionally reassign to a different group */
  reassignToGroupId?: string;
  
  sendEmail: boolean;
  sendSms: boolean;
}

/**
 * Routing Rule Interface
 * 
 * Automatically routes incidents to support groups based on criteria.
 */
export interface RoutingRule {
  id: string;
  name: string;
  description?: string;
  
  /** Lower number = checked first */
  priority: number;
  
  /** Conditions that must all match */
  conditions: RoutingCondition[];
  
  /** Where to route matching incidents */
  targetGroupId: string;
  targetGroup?: SupportGroup;
  
  isActive: boolean;
}

/**
 * Routing Condition Interface
 * 
 * A single condition in a routing rule.
 */
export interface RoutingCondition {
  /** Which field to check */
  field: "category" | "subcategory" | "priority" | "impact" | "urgency";
  
  /** How to compare */
  operator: "equals" | "notEquals" | "in" | "notIn";
  
  /** Value(s) to compare against */
  value: string | string[];
}


// ============================================================================
// ANALYTICS & REPORTING
// ============================================================================

/**
 * Dashboard Metrics Interface
 * 
 * Data for the main dashboard.
 * This is returned by GET /api/analytics/dashboard
 */
export interface DashboardMetrics {
  /** Total incidents in the system */
  totalIncidents: number;
  
  /** Currently open (not Resolved/Closed/Cancelled) */
  openIncidents: number;
  
  /** Resolved in the last 24 hours */
  resolvedToday: number;
  
  /** Average time to resolve (in hours) */
  averageResolutionTime: number;
  
  /** Percentage of incidents resolved within SLA */
  slaComplianceRate: number;
  
  /** Count by priority level */
  incidentsByPriority: Record<IncidentPriority, number>;
  
  /** Count by status */
  incidentsByStatus: Record<IncidentStatus, number>;
  
  /** Trend data for charts */
  incidentTrend: TrendDataPoint[];
  
  /** Top categories by volume */
  topCategories: CategoryMetric[];
  
  /** Agent performance stats */
  agentPerformance: AgentMetric[];
  
  /** Number of SLA breaches */
  slaBreaches: number;
  
  /** Incidents awaiting escalation */
  pendingEscalations: number;
}

/**
 * Trend Data Point Interface
 * 
 * Single point in a time series chart.
 */
export interface TrendDataPoint {
  /** Date in YYYY-MM-DD format */
  date: string;
  
  /** Incidents created on this date */
  created: number;
  
  /** Incidents resolved on this date */
  resolved: number;
  
  /** Open incidents at end of this date */
  backlog: number;
}

/**
 * Category Metric Interface
 * 
 * Stats for a single category.
 */
export interface CategoryMetric {
  category: string;
  count: number;
  percentage: number;
  avgResolutionTime: number;
}

/**
 * Agent Metric Interface
 * 
 * Performance stats for a single agent.
 */
export interface AgentMetric {
  agentId: string;
  agentName: string;
  assignedCount: number;
  resolvedCount: number;
  averageResolutionTime: number;
  slaComplianceRate: number;
}


// ============================================================================
// NOTIFICATIONS
// ============================================================================

/**
 * Notification Interface
 * 
 * In-app notification for a user.
 */
export interface Notification {
  id: string;
  userId: string;
  
  /** Type determines the icon and styling */
  type: NotificationType;
  
  title: string;
  message: string;
  
  /** Link to related incident (if applicable) */
  incidentId?: string;
  incidentNumber?: string;
  
  isRead: boolean;
  createdAt: string;
  readAt?: string;
}

/**
 * Notification Type
 * 
 * All possible notification types.
 */
export type NotificationType =
  | "IncidentAssigned"      // Incident was assigned to you
  | "IncidentUpdated"       // Incident you're watching was updated
  | "IncidentResolved"      // Incident was resolved
  | "CommentAdded"          // Someone commented on your incident
  | "SLAWarning"            // SLA is at risk
  | "SLABreach"             // SLA was breached
  | "MentionedInComment"    // You were @mentioned
  | "EscalationTriggered";  // Incident was escalated to you


// ============================================================================
// API TYPES - Request and Response shapes
// ============================================================================

/**
 * Paginated Response Interface
 * 
 * Standard wrapper for list endpoints.
 * Your .NET API should return this shape.
 * 
 * EXAMPLE:
 * GET /api/incidents?page=2&pageSize=10
 * Returns: { items: [...], totalCount: 42, pageNumber: 2, ... }
 */
export interface PaginatedResponse<T> {
  /** The actual data items */
  items: T[];
  
  /** Total items in database matching filters */
  totalCount: number;
  
  /** Current page (1-based) */
  pageNumber: number;
  
  /** Items per page */
  pageSize: number;
  
  /** Total pages available */
  totalPages: number;
  
  /** Is there a next page? */
  hasNextPage: boolean;
  
  /** Is there a previous page? */
  hasPreviousPage: boolean;
}

/**
 * API Error Interface
 * 
 * Standard error response from your API.
 */
export interface ApiError {
  /** Machine-readable error code */
  code: string;
  
  /** Human-readable message */
  message: string;
  
  /** Validation errors by field */
  details?: Record<string, string[]>;
  
  /** For debugging/support */
  traceId?: string;
}

/**
 * Create Incident Request Interface
 * 
 * What the frontend sends to POST /api/incidents
 */
export interface CreateIncidentRequest {
  title: string;
  description: string;
  categoryId: string;
  subcategoryId?: string;
  impact: ImpactLevel;
  urgency: UrgencyLevel;
  
  /** IDs of files already uploaded */
  attachmentIds?: string[];
}

/**
 * Update Incident Request Interface
 * 
 * What the frontend sends to PUT /api/incidents/{id}
 * All fields are optional - only send what you're changing.
 */
export interface UpdateIncidentRequest {
  title?: string;
  description?: string;
  categoryId?: string;
  subcategoryId?: string;
  impact?: ImpactLevel;
  urgency?: UrgencyLevel;
  status?: IncidentStatus;
  assignedToId?: string;
  assignedGroupId?: string;
}

/**
 * Resolve Incident Request Interface
 * 
 * What the frontend sends to resolve an incident.
 */
export interface ResolveIncidentRequest {
  resolutionNotes: string;
  resolutionCode: ResolutionCode;
}

/**
 * Add Comment Request Interface
 * 
 * What the frontend sends to POST /api/incidents/{id}/comments
 */
export interface AddCommentRequest {
  content: string;
  
  /** If true, only agents can see this comment */
  isInternal: boolean;
}

/**
 * Incident Filter Parameters Interface
 * 
 * Query parameters for GET /api/incidents
 * 
 * EXAMPLE:
 * GET /api/incidents?status=Open,InProgress&priority=P1,P2&pageSize=20
 */
export interface IncidentFilterParams {
  /** Search in title and description */
  search?: string;
  
  /** Filter by status (multiple allowed) */
  status?: IncidentStatus[];
  
  /** Filter by priority (multiple allowed) */
  priority?: IncidentPriority[];
  
  /** Filter by category */
  categoryId?: string;
  
  /** Filter by assigned agent */
  assignedToId?: string;
  
  /** Filter by assigned group */
  assignedGroupId?: string;
  
  /** Filter by requester */
  requesterId?: string;
  
  /** Filter by SLA breach status */
  slaBreachStatus?: SLABreachStatus[];
  
  /** Filter by creation date (ISO format) */
  createdFrom?: string;
  createdTo?: string;
  
  /** Sort field */
  sortBy?: string;
  
  /** Sort direction */
  sortOrder?: "asc" | "desc";
  
  /** Page number (1-based) */
  pageNumber?: number;
  
  /** Items per page */
  pageSize?: number;
}
