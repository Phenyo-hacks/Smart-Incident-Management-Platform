# SIMP API Documentation

## Overview

RESTful API for the Smart Incident Management Platform. All endpoints return JSON and use standard HTTP status codes.

## Authentication

All endpoints (except `/health`) require JWT Bearer authentication:

```http
Authorization: Bearer <token>
```

### Obtaining a Token

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "expiresAt": "2024-01-15T12:00:00Z",
  "user": {
    "id": "guid",
    "email": "user@example.com",
    "role": "Agent"
  }
}
```

## Incidents

### List Incidents

```http
GET /api/incidents?page=1&pageSize=20&status=Open&priority=High
```

Query Parameters:
| Parameter | Type | Description |
|-----------|------|-------------|
| page | int | Page number (default: 1) |
| pageSize | int | Items per page (default: 20, max: 100) |
| status | string | Filter by status (Open, InProgress, Resolved, etc.) |
| priority | string | Filter by priority (Low, Medium, High, Critical) |
| assignedTo | guid | Filter by assigned user |
| categoryId | guid | Filter by category |
| search | string | Full-text search in title/description |
| sortBy | string | Sort field (createdAt, priority, status) |
| sortOrder | string | asc or desc |

Response:
```json
{
  "items": [
    {
      "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "ticketNumber": "INC-2024-001234",
      "title": "Email system down",
      "description": "Users cannot send emails",
      "status": "InProgress",
      "priority": "Critical",
      "category": { "id": "...", "name": "Email" },
      "reporter": { "id": "...", "fullName": "John Doe" },
      "assignee": { "id": "...", "fullName": "Jane Smith" },
      "createdAt": "2024-01-10T08:30:00Z",
      "updatedAt": "2024-01-10T09:15:00Z",
      "slaBreachStatus": "AtRisk",
      "responseDeadline": "2024-01-10T10:30:00Z",
      "resolutionDeadline": "2024-01-10T16:30:00Z"
    }
  ],
  "totalCount": 150,
  "pageNumber": 1,
  "pageSize": 20,
  "totalPages": 8
}
```

### Get Incident Details

```http
GET /api/incidents/{id}
```

Response includes full incident with comments, attachments, and history.

### Create Incident

```http
POST /api/incidents
Content-Type: application/json

{
  "title": "Printer not working",
  "description": "HP LaserJet on 3rd floor shows offline",
  "priority": "Medium",
  "categoryId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "affectedUserId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "tags": ["hardware", "printer"]
}
```

### Update Incident

```http
PUT /api/incidents/{id}
Content-Type: application/json

{
  "title": "Printer not working - 3rd Floor",
  "description": "Updated description...",
  "priority": "High",
  "categoryId": "..."
}
```

### Update Status

```http
PATCH /api/incidents/{id}/status
Content-Type: application/json

{
  "status": "Resolved",
  "resolution": "Replaced toner cartridge",
  "rootCause": "Empty toner"
}
```

Valid status transitions:
- `New` → `Open`, `Cancelled`
- `Open` → `InProgress`, `Pending`, `Cancelled`
- `InProgress` → `Pending`, `Resolved`, `Escalated`
- `Pending` → `InProgress`, `Resolved`
- `Escalated` → `InProgress`, `Resolved`
- `Resolved` → `Closed`, `Reopened`

### Assign Incident

```http
POST /api/incidents/{id}/assign
Content-Type: application/json

{
  "assigneeId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "supportGroupId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "note": "Assigned to network team"
}
```

### Add Comment

```http
POST /api/incidents/{id}/comments
Content-Type: application/json

{
  "content": "Checked printer logs, appears to be connectivity issue",
  "isInternal": false
}
```

### Upload Attachment

```http
POST /api/incidents/{id}/attachments
Content-Type: multipart/form-data

file: <binary>
description: "Screenshot of error message"
```

## Users

### List Users

```http
GET /api/users?role=Agent&isActive=true
```

### Create User

```http
POST /api/users
Content-Type: application/json

{
  "email": "jane.smith@example.com",
  "firstName": "Jane",
  "lastName": "Smith",
  "role": "Agent",
  "supportGroupIds": ["..."],
  "department": "IT Support"
}
```

### Update User

```http
PUT /api/users/{id}
```

### Deactivate User

```http
DELETE /api/users/{id}
```

Note: Users are soft-deleted (deactivated), not permanently removed.

## Categories

### List Categories

```http
GET /api/categories?includeInactive=false
```

Response:
```json
[
  {
    "id": "...",
    "name": "Hardware",
    "description": "Physical equipment issues",
    "parentId": null,
    "children": [
      { "id": "...", "name": "Printers", "parentId": "..." },
      { "id": "...", "name": "Laptops", "parentId": "..." }
    ],
    "slaPolicyId": "...",
    "defaultPriority": "Medium"
  }
]
```

### Create Category

```http
POST /api/categories
Content-Type: application/json

{
  "name": "Network",
  "description": "Network connectivity issues",
  "parentId": null,
  "slaPolicyId": "...",
  "defaultPriority": "High"
}
```

## Analytics

### Dashboard Metrics

```http
GET /api/analytics/dashboard?period=7d
```

Response:
```json
{
  "summary": {
    "totalIncidents": 156,
    "openIncidents": 42,
    "resolvedToday": 12,
    "avgResolutionTime": "4h 23m",
    "slaComplianceRate": 94.5
  },
  "byStatus": {
    "New": 8,
    "Open": 15,
    "InProgress": 19,
    "Pending": 5,
    "Resolved": 95,
    "Closed": 14
  },
  "byPriority": {
    "Critical": 3,
    "High": 28,
    "Medium": 89,
    "Low": 36
  },
  "trends": {
    "labels": ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    "created": [23, 18, 25, 21, 28, 8, 5],
    "resolved": [20, 22, 19, 24, 26, 6, 3]
  }
}
```

### Agent Performance

```http
GET /api/analytics/agents?period=30d
```

### SLA Report

```http
GET /api/analytics/sla?from=2024-01-01&to=2024-01-31
```

## Error Responses

All errors follow this format:

```json
{
  "type": "https://tools.ietf.org/html/rfc7231#section-6.5.1",
  "title": "Bad Request",
  "status": 400,
  "traceId": "00-abc123...",
  "errors": {
    "Title": ["The Title field is required."],
    "Priority": ["Invalid priority value."]
  }
}
```

### Status Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 204 | No Content (successful delete) |
| 400 | Bad Request (validation error) |
| 401 | Unauthorized (missing/invalid token) |
| 403 | Forbidden (insufficient permissions) |
| 404 | Not Found |
| 409 | Conflict (duplicate, invalid state transition) |
| 422 | Unprocessable Entity (business rule violation) |
| 500 | Internal Server Error |

## Rate Limiting

- 1000 requests per minute per API key
- 429 Too Many Requests when exceeded
- `X-RateLimit-Remaining` header shows remaining quota
