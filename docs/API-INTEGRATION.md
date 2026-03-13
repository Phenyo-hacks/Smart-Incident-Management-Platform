# API Integration Guide

**Document Version:** 1.0  
**Last Updated:** 2024  
**Status:** Active

## Overview

This document describes how the SIMP frontend integrates with the .NET Core backend API.

## Base Configuration

### Environment Variables

```env
# .env.local
NEXT_PUBLIC_API_URL=https://your-api.azurewebsites.net/api
```

### API Client

The API client (`lib/api/client.ts`) handles:

- Base URL configuration
- JWT token injection
- Request/response interceptors
- Error transformation
- Token refresh

```typescript
import { apiClient } from '@/lib/api/client';

// All requests automatically include auth headers
const response = await apiClient.get('/incidents');
```

## Authentication

### JWT Bearer Token Flow

```
1. User submits credentials
      │
      ▼
2. POST /api/auth/login
      │
      ▼
3. Backend validates & returns JWT + Refresh Token
      │
      ▼
4. Frontend stores tokens
      │
      ▼
5. Subsequent requests include: Authorization: Bearer {token}
      │
      ▼
6. On 401, attempt token refresh
      │
      ▼
7. If refresh fails, redirect to login
```

### Azure AD Integration (Alternative)

For Azure AD authentication, configure MSAL:

```typescript
// lib/auth/msal-config.ts
export const msalConfig = {
  auth: {
    clientId: process.env.NEXT_PUBLIC_AZURE_CLIENT_ID,
    authority: `https://login.microsoftonline.com/${process.env.NEXT_PUBLIC_AZURE_TENANT_ID}`,
    redirectUri: process.env.NEXT_PUBLIC_REDIRECT_URI,
  },
};
```

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/login` | Authenticate user |
| POST | `/auth/logout` | Invalidate session |
| POST | `/auth/refresh` | Refresh access token |
| GET | `/auth/me` | Get current user |

#### Login Request/Response

```typescript
// Request
POST /api/auth/login
{
  "email": "user@company.com",
  "password": "********"
}

// Response
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "dGhpcyBpcyBhIHJlZnJl...",
  "expiresIn": 3600,
  "user": {
    "id": "usr_123",
    "email": "user@company.com",
    "name": "John Doe",
    "role": "Agent"
  }
}
```

### Incidents

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/incidents` | List incidents (with filters) |
| POST | `/incidents` | Create incident |
| GET | `/incidents/{id}` | Get incident details |
| PUT | `/incidents/{id}` | Update incident |
| PATCH | `/incidents/{id}/status` | Change status |
| POST | `/incidents/{id}/comments` | Add comment |
| POST | `/incidents/{id}/attachments` | Upload attachment |
| GET | `/incidents/{id}/history` | Get audit history |

#### List Incidents

```typescript
// Request
GET /api/incidents?status=Open&priority=P1&page=1&pageSize=20

// Response
{
  "items": [
    {
      "id": "INC-2024-001",
      "title": "Server outage in production",
      "status": "Open",
      "priority": "P1",
      "category": { "id": "cat_1", "name": "Infrastructure" },
      "assignee": { "id": "usr_5", "name": "Jane Smith" },
      "requester": { "id": "usr_10", "name": "Bob Wilson" },
      "createdAt": "2024-01-15T10:30:00Z",
      "slaStatus": "AtRisk"
    }
  ],
  "totalCount": 150,
  "page": 1,
  "pageSize": 20,
  "totalPages": 8
}
```

#### Create Incident

```typescript
// Request
POST /api/incidents
{
  "title": "Cannot access email",
  "description": "Outlook shows error when trying to connect...",
  "categoryId": "cat_2",
  "priority": "P3",
  "impactedUsers": 1,
  "attachmentIds": ["att_1", "att_2"]
}

// Response
{
  "id": "INC-2024-152",
  "title": "Cannot access email",
  "status": "New",
  "priority": "P3",
  "createdAt": "2024-01-15T14:22:00Z",
  ...
}
```

### Users

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/users` | List users |
| GET | `/users/{id}` | Get user details |
| POST | `/users` | Create user (admin) |
| PUT | `/users/{id}` | Update user |
| PATCH | `/users/{id}/role` | Change role |

### Categories

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/categories` | List all categories |
| POST | `/categories` | Create category |
| PUT | `/categories/{id}` | Update category |
| DELETE | `/categories/{id}` | Delete category |

### Support Groups

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/support-groups` | List groups |
| GET | `/support-groups/{id}` | Get group with members |
| POST | `/support-groups` | Create group |
| PUT | `/support-groups/{id}` | Update group |
| POST | `/support-groups/{id}/members` | Add member |
| DELETE | `/support-groups/{id}/members/{userId}` | Remove member |

### Analytics

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/analytics/dashboard` | Dashboard metrics |
| GET | `/analytics/trends` | Incident trends |
| GET | `/analytics/sla` | SLA compliance |
| GET | `/analytics/team-performance` | Team stats |

#### Dashboard Metrics

```typescript
// Request
GET /api/analytics/dashboard?startDate=2024-01-01&endDate=2024-01-31

// Response
{
  "totalIncidents": 1250,
  "openIncidents": 85,
  "resolvedToday": 23,
  "avgResolutionTime": 14.5,  // hours
  "slaCompliance": 94.2,      // percentage
  "criticalCount": 3,
  "trendVsPreviousPeriod": {
    "incidents": 12.5,        // percentage change
    "resolutionTime": -8.3
  }
}
```

## Error Handling

### Standard Error Response

```typescript
// Error response format
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "One or more validation errors occurred",
    "details": [
      {
        "field": "title",
        "message": "Title must be at least 5 characters"
      }
    ],
    "traceId": "00-abc123-def456-00"
  }
}
```

### Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `UNAUTHORIZED` | 401 | Invalid or expired token |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `VALIDATION_ERROR` | 400 | Invalid request data |
| `CONFLICT` | 409 | Resource conflict (duplicate) |
| `INTERNAL_ERROR` | 500 | Server error |

### Frontend Error Handling

```typescript
// In SWR hooks
const { data, error } = useSWR('/incidents', fetcher);

if (error) {
  if (error.status === 401) {
    // Redirect to login
  } else if (error.status === 403) {
    // Show permission denied
  } else {
    // Show generic error
  }
}
```

## Request/Response Patterns

### Pagination

```typescript
// Request
GET /api/incidents?page=2&pageSize=25

// Response includes
{
  "items": [...],
  "totalCount": 500,
  "page": 2,
  "pageSize": 25,
  "totalPages": 20
}
```

### Filtering

```typescript
// Multiple filters
GET /api/incidents?status=Open,InProgress&priority=P1,P2&categoryId=cat_1

// Date range
GET /api/incidents?createdAfter=2024-01-01&createdBefore=2024-01-31

// Search
GET /api/incidents?search=server%20outage
```

### Sorting

```typescript
// Sort by field (asc/desc)
GET /api/incidents?sortBy=createdAt&sortOrder=desc

// Multiple sort fields
GET /api/incidents?sortBy=priority,createdAt&sortOrder=asc,desc
```

### Field Selection

```typescript
// Include specific fields only
GET /api/incidents?fields=id,title,status,priority
```

## Real-Time Updates (Future)

### SignalR Integration

```typescript
// lib/signalr/connection.ts
import * as signalR from '@microsoft/signalr';

const connection = new signalR.HubConnectionBuilder()
  .withUrl(`${API_URL}/hubs/incidents`)
  .withAutomaticReconnect()
  .build();

// Subscribe to incident updates
connection.on('IncidentUpdated', (incident) => {
  // Update SWR cache
  mutate(`/incidents/${incident.id}`, incident);
});
```

## CORS Configuration

Backend should allow:

```csharp
// Program.cs
builder.Services.AddCors(options =>
{
    options.AddPolicy("Frontend", policy =>
    {
        policy.WithOrigins(
            "http://localhost:3000",
            "https://your-frontend.vercel.app"
        )
        .AllowAnyHeader()
        .AllowAnyMethod()
        .AllowCredentials();
    });
});
```

## Rate Limiting

The API implements rate limiting:

| Endpoint Type | Limit |
|--------------|-------|
| Authentication | 5 requests/minute |
| Read (GET) | 100 requests/minute |
| Write (POST/PUT) | 30 requests/minute |
| File Upload | 10 requests/minute |

### Handling Rate Limits

```typescript
// Response header
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1705324800

// When limit exceeded (429)
{
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests",
    "retryAfter": 60
  }
}
```

## Backend Implementation Notes

### Controller Structure (Example)

```csharp
[ApiController]
[Route("api/[controller]")]
[Authorize]
public class IncidentsController : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<PagedResult<IncidentDto>>> GetIncidents(
        [FromQuery] IncidentFilterDto filter)
    {
        // Implementation
    }

    [HttpPost]
    public async Task<ActionResult<IncidentDto>> CreateIncident(
        [FromBody] CreateIncidentDto request)
    {
        // Implementation
    }
}
```

### DTO Mapping

Ensure backend DTOs match the TypeScript types in `types/domain.ts`:

```csharp
// Backend DTO
public class IncidentDto
{
    public string Id { get; set; }
    public string Title { get; set; }
    public IncidentStatus Status { get; set; }
    public Priority Priority { get; set; }
    // ... matches TypeScript Incident type
}
```
