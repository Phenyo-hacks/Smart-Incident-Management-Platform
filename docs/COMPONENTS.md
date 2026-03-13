# Component Documentation

**Document Version:** 1.0  
**Last Updated:** 2024  
**Status:** Active

## Overview

This document provides detailed documentation for the SIMP frontend components.

## Layout Components

### AppSidebar

Main navigation sidebar with collapsible sections.

**Location:** `components/layout/app-sidebar.tsx`

**Features:**
- Collapsible navigation groups
- Active state indication
- Role-based menu items
- User profile section
- Dark mode toggle

**Usage:**
```tsx
<SidebarProvider>
  <AppSidebar />
  <main>{children}</main>
</SidebarProvider>
```

### AppHeader

Top header with search, notifications, and user menu.

**Location:** `components/layout/app-header.tsx`

**Features:**
- Global search
- Notification bell with count
- User dropdown menu
- Mobile sidebar trigger

---

## Dashboard Components

### DashboardMetrics

Displays key performance indicator cards.

**Location:** `components/dashboard/dashboard-metrics.tsx`

**Props:**
| Prop | Type | Description |
|------|------|-------------|
| `className` | `string?` | Additional CSS classes |

**Metrics Displayed:**
- Total Incidents
- Open Incidents  
- Resolved Today
- Avg Resolution Time
- SLA Compliance

### IncidentTrendChart

Line/area chart showing incident volume over time.

**Location:** `components/dashboard/incident-trend-chart.tsx`

**Features:**
- Daily/weekly/monthly view toggle
- Hover tooltips
- Responsive sizing
- Color-coded by status

### PriorityBreakdown

Pie/donut chart showing incident distribution by priority.

**Location:** `components/dashboard/priority-breakdown.tsx`

**Features:**
- P1-P4 breakdown
- Percentage labels
- Legend
- Click to filter

### RecentIncidents

Table showing latest incident activity.

**Location:** `components/dashboard/recent-incidents.tsx`

**Features:**
- Last 5-10 incidents
- Quick status update
- Click to view details
- Relative timestamps

### SLAStatus

Visual indicator of SLA compliance status.

**Location:** `components/dashboard/sla-status.tsx`

**Features:**
- Overall compliance percentage
- At-risk incidents count
- Breached incidents count
- Progress bars by category

### QuickActions

Action buttons for common operations.

**Location:** `components/dashboard/quick-actions.tsx`

**Actions:**
- Create Incident
- View My Queue
- Export Report
- System Status

---

## Incident Components

### IncidentList

Data table with incident records.

**Location:** `components/incidents/incident-list.tsx`

**Features:**
- Sortable columns
- Row selection
- Bulk actions
- Pagination
- Status badges
- Priority indicators
- Assignee avatars

**Columns:**
- ID
- Title
- Status
- Priority
- Category
- Assignee
- Created
- SLA Status

### IncidentFilters

Advanced filter panel for incident list.

**Location:** `components/incidents/incident-filters.tsx`

**Filters:**
- Status (multi-select)
- Priority (multi-select)
- Category (dropdown)
- Assignee (search)
- Date range
- Search text

**Features:**
- Clear all filters
- Save filter presets
- URL sync for shareable links

### IncidentDetail

Full incident view with all details.

**Location:** `components/incidents/incident-detail.tsx`

**Sections:**
- Header (ID, title, status badge)
- Details panel (priority, category, dates)
- Description
- Activity timeline
- Comments
- Attachments
- Related incidents
- SLA information

**Actions:**
- Edit incident
- Change status
- Assign/reassign
- Add comment
- Upload attachment
- Escalate

### CreateIncidentForm

Form for creating new incidents.

**Location:** `components/incidents/create-incident-form.tsx`

**Fields:**
| Field | Type | Validation |
|-------|------|------------|
| Title | text | Required, 5-200 chars |
| Description | textarea | Required, min 10 chars |
| Category | select | Required |
| Priority | select | Required |
| Impacted Users | number | Optional, min 1 |
| Attachments | file | Optional, max 10MB each |

**Features:**
- Client-side validation
- File drag & drop
- Auto-save draft
- Template selection

---

## Analytics Components

### AnalyticsFilters

Date range and dimension filters for analytics.

**Location:** `components/analytics/analytics-filters.tsx`

**Filters:**
- Date range picker
- Compare to previous period
- Group by (day/week/month)
- Category filter
- Team filter

### AnalyticsOverview

Main analytics dashboard with multiple charts.

**Location:** `components/analytics/analytics-overview.tsx`

**Charts Included:**
- Incident volume trend
- Resolution time trend
- SLA compliance over time
- Category distribution
- Team performance
- Top recurring issues

---

## Admin Components

### UserManagement

User administration interface.

**Location:** `components/admin/user-management.tsx`

**Features:**
- User list with search
- Add/edit user dialog
- Role assignment
- Team assignment
- Activation/deactivation
- Password reset

### CategoryManagement

Category configuration interface.

**Location:** `components/admin/category-management.tsx`

**Features:**
- Category tree view
- Add/edit/delete categories
- SLA assignment
- Default assignee/group
- Category icon selection
- Drag & drop reordering

### GroupManagement

Support group administration.

**Location:** `components/admin/group-management.tsx`

**Features:**
- Group list
- Member management
- Workload balancing settings
- Schedule configuration
- Escalation rules

---

## Shared Components

### StatusBadge

Colored badge indicating incident status.

**Usage:**
```tsx
<StatusBadge status="InProgress" />
```

### PriorityIndicator

Visual priority level indicator.

**Usage:**
```tsx
<PriorityIndicator priority="P1" showLabel />
```

### UserAvatar

User avatar with fallback initials.

**Usage:**
```tsx
<UserAvatar user={user} size="sm" />
```

### RelativeTime

Human-readable relative timestamp.

**Usage:**
```tsx
<RelativeTime date={incident.createdAt} />
// Output: "2 hours ago"
```

### EmptyState

Placeholder for empty data states.

**Usage:**
```tsx
<EmptyState
  icon={InboxIcon}
  title="No incidents found"
  description="Try adjusting your filters"
  action={<Button>Create Incident</Button>}
/>
```

---

## UI Components (shadcn/ui)

The project uses shadcn/ui components. Key components:

- `Button` - Action buttons with variants
- `Card` - Container for content sections
- `Dialog` - Modal dialogs
- `DropdownMenu` - Context menus
- `Form` - Form wrapper with validation
- `Input` - Text inputs
- `Select` - Dropdown selects
- `Table` - Data tables
- `Tabs` - Tab navigation
- `Toast` - Notification toasts
- `Tooltip` - Hover tooltips

### Adding New Components

```bash
pnpm dlx shadcn@latest add [component-name]
```

---

## Component Conventions

### File Structure

```
components/
  feature/
    component-name.tsx      # Main component
    component-name.test.tsx # Tests (optional)
    index.ts               # Barrel export (optional)
```

### Naming

- PascalCase for components: `IncidentList`
- kebab-case for files: `incident-list.tsx`
- Prefix with feature: `incident-`, `dashboard-`, `admin-`

### Props Pattern

```typescript
interface IncidentListProps {
  filters?: IncidentFilters;
  onSelect?: (incident: Incident) => void;
  className?: string;
}

export function IncidentList({ 
  filters, 
  onSelect, 
  className 
}: IncidentListProps) {
  // ...
}
```

### Styling

- Use Tailwind CSS utility classes
- Use `cn()` helper for conditional classes
- Follow design system tokens
- No inline styles

```tsx
import { cn } from "@/lib/utils";

<div className={cn(
  "rounded-lg border bg-card p-4",
  isActive && "border-primary",
  className
)} />
```
