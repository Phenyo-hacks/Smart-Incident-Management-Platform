# Frontend Architecture Guide

> This document explains HOW the frontend is built and WHY we made certain decisions.
> Perfect for learning modern React/Next.js patterns.

---

## Table of Contents

1. [High-Level Overview](#high-level-overview)
2. [Next.js App Router](#nextjs-app-router)
3. [Component Architecture](#component-architecture)
4. [State Management](#state-management)
5. [Data Fetching](#data-fetching)
6. [TypeScript Patterns](#typescript-patterns)
7. [Styling with Tailwind](#styling-with-tailwind)
8. [Common Patterns](#common-patterns)

---

## High-Level Overview

### The Stack

```
┌─────────────────────────────────────────────────────────────┐
│                        USER INTERFACE                        │
│  React Components (TSX) + Tailwind CSS + shadcn/ui          │
├─────────────────────────────────────────────────────────────┤
│                      STATE MANAGEMENT                        │
│  SWR (data) + React Context (auth, theme)                   │
├─────────────────────────────────────────────────────────────┤
│                        API LAYER                             │
│  HTTP Client (fetch) + Service Functions + Type Safety      │
├─────────────────────────────────────────────────────────────┤
│                       NEXT.JS 16                             │
│  App Router + Server Components + API Routes                │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    .NET Backend API
```

### Why This Stack?

| Technology | Why We Chose It |
|------------|-----------------|
| **Next.js 16** | Production-ready React framework with great DX |
| **TypeScript** | Catch errors at compile time, better IDE support |
| **Tailwind CSS** | Rapid styling, consistent design system |
| **shadcn/ui** | Beautiful, accessible, customizable components |
| **SWR** | Smart data fetching with caching and revalidation |

---

## Next.js App Router

### Understanding Route Groups

```
app/
├── (auth)/              # Route Group - no impact on URL
│   ├── login/           # -> /login
│   └── layout.tsx       # Minimal layout (no sidebar)
│
├── (dashboard)/         # Route Group - no impact on URL
│   ├── dashboard/       # -> /dashboard
│   ├── incidents/       # -> /incidents
│   └── layout.tsx       # Dashboard layout (with sidebar)
│
└── layout.tsx           # Root layout (wraps everything)
```

**KEY CONCEPT**: Parentheses `()` create route groups. They:
- Share a layout without affecting the URL
- Let you organize related routes together
- Allow different layouts for different sections

### Layout Hierarchy

```tsx
// Root Layout (app/layout.tsx)
// - Wraps EVERYTHING
// - Sets up fonts, metadata, providers
export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <Providers>        {/* Auth, Theme providers */}
          {children}       {/* Page content */}
        </Providers>
      </body>
    </html>
  );
}

// Dashboard Layout (app/(dashboard)/layout.tsx)
// - Only wraps dashboard pages
// - Adds sidebar and header
export default function DashboardLayout({ children }) {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1">
        <Header />
        {children}         {/* Dashboard page content */}
      </main>
    </div>
  );
}
```

### Page vs Layout vs Component

| Type | File | What It Does |
|------|------|--------------|
| **Page** | `page.tsx` | THE component for a route |
| **Layout** | `layout.tsx` | Wraps pages, persists across navigation |
| **Component** | `components/*.tsx` | Reusable UI pieces |

---

## Component Architecture

### Component Organization

```
components/
├── ui/                  # Base UI components (from shadcn/ui)
│   ├── button.tsx       # Don't modify directly
│   ├── card.tsx         # Customized via globals.css
│   └── ...
│
├── layout/              # App structure components
│   ├── app-sidebar.tsx  # Navigation sidebar
│   └── app-header.tsx   # Top header
│
├── dashboard/           # Dashboard-specific components
│   ├── dashboard-metrics.tsx
│   └── incident-trend-chart.tsx
│
├── incidents/           # Incident-specific components
│   ├── incident-list.tsx
│   └── incident-detail.tsx
│
└── providers.tsx        # Context providers wrapper
```

### Component Anatomy

```tsx
// components/incidents/incident-card.tsx

/**
 * IncidentCard - Displays a single incident in a card format.
 * 
 * PROPS:
 * @param incident - The incident data to display
 * @param onSelect - Called when user clicks the card
 * 
 * USAGE:
 * <IncidentCard 
 *   incident={incident} 
 *   onSelect={(inc) => router.push(`/incidents/${inc.id}`)} 
 * />
 */

// 1. IMPORTS - External libraries, then internal modules
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Incident } from "@/types/domain";
import { formatDate } from "@/lib/utils";

// 2. TYPES - Props interface defined here or imported
interface IncidentCardProps {
  incident: Incident;
  onSelect?: (incident: Incident) => void;
}

// 3. COMPONENT - The actual React component
export function IncidentCard({ incident, onSelect }: IncidentCardProps) {
  // 3a. Hooks (useState, useEffect, custom hooks)
  // 3b. Derived state / computed values
  // 3c. Event handlers
  const handleClick = () => {
    onSelect?.(incident);
  };
  
  // 3d. Render
  return (
    <Card onClick={handleClick} className="cursor-pointer hover:shadow-md">
      <CardHeader>
        <div className="flex items-center justify-between">
          <span className="font-mono text-sm">{incident.incidentNumber}</span>
          <Badge>{incident.priority}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <h3 className="font-semibold">{incident.title}</h3>
        <p className="text-sm text-muted-foreground">
          Created {formatDate(incident.createdAt)}
        </p>
      </CardContent>
    </Card>
  );
}
```

---

## State Management

### The State Management Strategy

```
┌──────────────────────────────────────────────────────────────┐
│                     STATE CATEGORIES                          │
├────────────────┬────────────────┬────────────────────────────┤
│ SERVER STATE   │ CLIENT STATE   │ URL STATE                  │
│ (from API)     │ (UI only)      │ (in URL)                   │
├────────────────┼────────────────┼────────────────────────────┤
│ Incidents      │ Modal open?    │ Current page               │
│ Users          │ Selected tab   │ Filter values              │
│ Categories     │ Form values    │ Sort order                 │
├────────────────┼────────────────┼────────────────────────────┤
│ SWR            │ useState       │ useSearchParams            │
│ React Query    │ useReducer     │ router.push()              │
└────────────────┴────────────────┴────────────────────────────┘
```

### Server State with SWR

```tsx
// lib/hooks/use-incidents.ts

import useSWR from "swr";
import { incidentService } from "@/lib/api/services";

/**
 * Custom hook for fetching incidents.
 * 
 * WHY SWR:
 * - Automatic caching (no duplicate requests)
 * - Automatic revalidation (data stays fresh)
 * - Focus revalidation (refetch when tab regains focus)
 * - Error retry with exponential backoff
 * - Optimistic UI updates
 */
export function useIncidents(filters?: IncidentFilterParams) {
  // SWR automatically:
  // 1. Returns cached data immediately
  // 2. Fetches fresh data in background
  // 3. Updates UI when fresh data arrives
  
  const { data, error, isLoading, mutate } = useSWR(
    // Key: Uniquely identifies this request (includes filters)
    ["incidents", filters],
    
    // Fetcher: Function that returns the data
    () => incidentService.getAll(filters),
    
    // Options
    {
      revalidateOnFocus: true,      // Refetch when tab regains focus
      revalidateOnReconnect: true,  // Refetch when network reconnects
      dedupingInterval: 2000,       // Dedupe requests within 2 seconds
    }
  );
  
  return {
    incidents: data?.items ?? [],
    totalCount: data?.totalCount ?? 0,
    isLoading,
    error,
    mutate,  // Function to manually update cache
  };
}
```

### Auth State with Context

```tsx
// lib/auth/auth-context.tsx

import { createContext, useContext, useState, useEffect } from "react";

/**
 * Auth Context - Manages authentication state globally.
 * 
 * WHY CONTEXT:
 * - Auth state needed throughout the app
 * - Avoids prop drilling
 * - Single source of truth for auth
 */

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Check for existing session on mount
  useEffect(() => {
    checkAuth();
  }, []);
  
  async function checkAuth() {
    const token = getAccessToken();
    if (token) {
      // Validate token and get user
      const user = await authService.getCurrentUser();
      setUser(user);
    }
    setIsLoading(false);
  }
  
  async function login(email: string, password: string) {
    const response = await authService.login(email, password);
    setAccessToken(response.accessToken);
    setRefreshToken(response.refreshToken);
    setUser(response.user);
  }
  
  function logout() {
    clearTokens();
    setUser(null);
  }
  
  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook for easy access
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
```

---

## Data Fetching

### The Data Flow

```
Component                Hook                   Service               API Client
    │                      │                       │                      │
    │  useIncidents()      │                       │                      │
    │─────────────────────>│                       │                      │
    │                      │ incidentService.getAll()                     │
    │                      │──────────────────────>│                      │
    │                      │                       │ get("/incidents")    │
    │                      │                       │─────────────────────>│
    │                      │                       │                      │ fetch()
    │                      │                       │                      │─────>
    │                      │                       │<─────────────────────│
    │                      │<──────────────────────│                      │
    │<─────────────────────│                       │                      │
    │  { data, isLoading } │                       │                      │
```

### Service Layer Pattern

```typescript
// lib/api/services.ts

/**
 * Incident Service - All incident-related API calls.
 * 
 * WHY A SERVICE LAYER:
 * - Centralizes API calls in one place
 * - Easy to mock for testing
 * - Type-safe request/response
 * - Consistent error handling
 */
export const incidentService = {
  /**
   * Get all incidents with optional filtering.
   */
  async getAll(params?: IncidentFilterParams) {
    return get<PaginatedResponse<Incident>>("/incidents", params);
  },
  
  /**
   * Get a single incident by ID.
   */
  async getById(id: string) {
    return get<Incident>(`/incidents/${id}`);
  },
  
  /**
   * Create a new incident.
   */
  async create(data: CreateIncidentRequest) {
    return post<Incident>("/incidents", data);
  },
  
  /**
   * Update an existing incident.
   */
  async update(id: string, data: UpdateIncidentRequest) {
    return put<Incident>(`/incidents/${id}`, data);
  },
};
```

---

## TypeScript Patterns

### Type-First Development

```typescript
// 1. Define types FIRST (in types/domain.ts)
interface Incident {
  id: string;
  title: string;
  status: IncidentStatus;
  // ...
}

// 2. API returns typed data
async function getIncident(id: string): Promise<Incident> {
  return get<Incident>(`/incidents/${id}`);
}

// 3. Components receive typed props
function IncidentCard({ incident }: { incident: Incident }) {
  // TypeScript knows incident.title exists
  return <h1>{incident.title}</h1>;
}
```

### Common Type Patterns

```typescript
// Partial<T> - All properties optional
type UpdateIncident = Partial<Incident>;
// { id?: string; title?: string; ... }

// Pick<T, K> - Only specific properties
type IncidentSummary = Pick<Incident, "id" | "title" | "status">;
// { id: string; title: string; status: IncidentStatus }

// Omit<T, K> - Everything except specific properties
type CreateIncident = Omit<Incident, "id" | "createdAt">;
// Incident without id and createdAt

// Record<K, V> - Object with typed keys and values
type StatusCounts = Record<IncidentStatus, number>;
// { New: 5, Open: 10, InProgress: 3, ... }
```

---

## Styling with Tailwind

### Design Token System

```css
/* app/globals.css */

:root {
  /* Colors are defined as CSS variables */
  --primary: #5B3765;           /* Deep purple */
  --primary-foreground: #FFFFFF;
  --secondary: #F3CCDE;         /* Light pink */
  --accent: #9E6899;            /* Purple mauve */
  
  /* These are used by shadcn/ui components */
  --background: #FAF5F8;
  --foreground: #2D2433;
  --card: #FFFFFF;
  --border: #E8D4DE;
}

/* Dark mode overrides */
.dark {
  --background: #1A141D;
  --foreground: #F3CCDE;
  /* ... */
}
```

### Using Tailwind Classes

```tsx
// Common patterns

// Flexbox layout
<div className="flex items-center justify-between gap-4">

// Grid layout
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

// Responsive design
<h1 className="text-xl md:text-2xl lg:text-3xl">

// State variants
<button className="bg-primary hover:bg-primary/90 focus:ring-2">

// Using design tokens
<div className="bg-background text-foreground border-border">
```

---

## Common Patterns

### Loading States

```tsx
function IncidentList() {
  const { incidents, isLoading, error } = useIncidents();
  
  if (isLoading) {
    return <Skeleton />;  // Show placeholder
  }
  
  if (error) {
    return <ErrorMessage error={error} />;
  }
  
  if (incidents.length === 0) {
    return <EmptyState message="No incidents found" />;
  }
  
  return <IncidentTable incidents={incidents} />;
}
```

### Form Handling

```tsx
function CreateIncidentForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    categoryId: "",
  });
  
  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await incidentService.create(formData);
      toast.success("Incident created!");
      router.push("/incidents");
    } catch (error) {
      if (error instanceof ApiException) {
        toast.error(error.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  }
  
  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? <Spinner /> : "Create Incident"}
      </Button>
    </form>
  );
}
```

---

## Next Steps

1. **Explore the code** - Start with `app/(dashboard)/dashboard/page.tsx`
2. **Follow the data** - Trace from component -> hook -> service -> API
3. **Modify something** - Best way to learn is to change things
4. **Read the types** - `types/domain.ts` explains the domain model

---

**Questions?** Check the other docs or explore the codebase!
