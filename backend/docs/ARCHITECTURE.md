# SIMP Architecture Documentation

## System Overview

SIMP follows Clean Architecture principles with clear separation of concerns across four layers.

```
┌─────────────────────────────────────────────────────────────┐
│                         API Layer                           │
│  Controllers, Middleware, DTOs, Filters, API Configuration  │
├─────────────────────────────────────────────────────────────┤
│                    Application Layer                        │
│     Services, Use Cases, Validators, Mapping Profiles       │
├─────────────────────────────────────────────────────────────┤
│                       Core Layer                            │
│   Entities, Value Objects, Domain Events, Interfaces        │
├─────────────────────────────────────────────────────────────┤
│                   Infrastructure Layer                      │
│  EF Core, Repositories, External Services, File Storage     │
└─────────────────────────────────────────────────────────────┘
```

## Layer Responsibilities

### Core Layer (SIMP.Core)

The heart of the application containing business logic with zero external dependencies.

**Entities**
- `Incident` - Main aggregate root with full lifecycle management
- `User` - Support agents, reporters, admins
- `Category` - Hierarchical incident classification
- `SupportGroup` - Team-based assignment
- `SLAPolicy` - Service level definitions

**Domain Rules**
- Incident status transitions follow state machine
- SLA calculations based on priority and category
- Automatic escalation triggers

**Interfaces**
- Repository contracts (IIncidentRepository, IUserRepository)
- Service contracts (IEmailService, IFileStorageService)
- Unit of Work pattern

### Infrastructure Layer (SIMP.Infrastructure)

Implements interfaces defined in Core. All external dependencies live here.

**Data Access**
- Entity Framework Core 8.0 with SQL Server
- Fluent API configurations for each entity
- Repository implementations with specification pattern
- Unit of Work for transaction management

**External Services**
- Azure Blob Storage for attachments
- SMTP/SendGrid for email notifications
- Azure Service Bus for async messaging

### API Layer (SIMP.API)

Presentation layer exposing REST endpoints.

**Controllers**
- Thin controllers delegating to services
- Model binding and validation
- Authorization policies

**Middleware**
- Global error handling
- Request/response logging
- Performance monitoring

**Configuration**
- Dependency injection setup
- Swagger/OpenAPI generation
- CORS policies

### Shared Layer (SIMP.Shared)

Cross-cutting concerns used by multiple layers.

**DTOs**
- Request/Response models
- Mapping profiles
- Validation attributes

## Key Design Patterns

### Repository Pattern

```csharp
public interface IRepository<T> where T : BaseEntity
{
    Task<T?> GetByIdAsync(Guid id);
    Task<IReadOnlyList<T>> ListAllAsync();
    Task<T> AddAsync(T entity);
    Task UpdateAsync(T entity);
    Task DeleteAsync(T entity);
}

public interface IIncidentRepository : IRepository<Incident>
{
    Task<PagedResult<Incident>> GetPagedAsync(IncidentFilter filter);
    Task<IReadOnlyList<Incident>> GetByAssigneeAsync(Guid userId);
    Task<int> GetOpenCountAsync();
}
```

### Unit of Work

```csharp
public interface IUnitOfWork : IDisposable
{
    IIncidentRepository Incidents { get; }
    IUserRepository Users { get; }
    ICategoryRepository Categories { get; }
    
    Task<int> SaveChangesAsync(CancellationToken ct = default);
    Task BeginTransactionAsync();
    Task CommitAsync();
    Task RollbackAsync();
}
```

### Incident State Machine

```
     ┌──────────┐
     │   New    │
     └────┬─────┘
          │
     ┌────▼─────┐      ┌───────────┐
     │   Open   │◄─────│ Reopened  │
     └────┬─────┘      └───────────┘
          │                  ▲
     ┌────▼─────┐            │
     │InProgress│────────────┤
     └────┬─────┘            │
          │                  │
    ┌─────┼─────┐            │
    ▼     ▼     ▼            │
┌───────┐ ┌───────┐ ┌────────┴──┐
│Pending│ │Escalated│  │ Resolved │
└───┬───┘ └────┬───┘  └─────┬────┘
    │          │            │
    └──────────┴────────────┤
                            ▼
                      ┌──────────┐
                      │  Closed  │
                      └──────────┘
```

## Database Schema

### Core Tables

```sql
-- Incidents
CREATE TABLE Incidents (
    Id UNIQUEIDENTIFIER PRIMARY KEY,
    TicketNumber NVARCHAR(20) UNIQUE NOT NULL,
    Title NVARCHAR(200) NOT NULL,
    Description NVARCHAR(MAX),
    Status INT NOT NULL,
    Priority INT NOT NULL,
    CategoryId UNIQUEIDENTIFIER,
    ReporterId UNIQUEIDENTIFIER NOT NULL,
    AssigneeId UNIQUEIDENTIFIER,
    SupportGroupId UNIQUEIDENTIFIER,
    ResponseDeadline DATETIME2,
    ResolutionDeadline DATETIME2,
    ResolvedAt DATETIME2,
    ClosedAt DATETIME2,
    Resolution NVARCHAR(MAX),
    RootCause NVARCHAR(MAX),
    CreatedAt DATETIME2 NOT NULL,
    UpdatedAt DATETIME2 NOT NULL,
    CreatedBy UNIQUEIDENTIFIER,
    UpdatedBy UNIQUEIDENTIFIER
);

-- Users
CREATE TABLE Users (
    Id UNIQUEIDENTIFIER PRIMARY KEY,
    Email NVARCHAR(256) UNIQUE NOT NULL,
    PasswordHash NVARCHAR(MAX) NOT NULL,
    FirstName NVARCHAR(100) NOT NULL,
    LastName NVARCHAR(100) NOT NULL,
    Role INT NOT NULL,
    UserType INT NOT NULL,
    Department NVARCHAR(100),
    IsActive BIT NOT NULL DEFAULT 1,
    LastLoginAt DATETIME2,
    CreatedAt DATETIME2 NOT NULL
);

-- Categories (self-referencing for hierarchy)
CREATE TABLE Categories (
    Id UNIQUEIDENTIFIER PRIMARY KEY,
    Name NVARCHAR(100) NOT NULL,
    Description NVARCHAR(500),
    ParentId UNIQUEIDENTIFIER REFERENCES Categories(Id),
    SLAPolicyId UNIQUEIDENTIFIER,
    DefaultPriority INT,
    IsActive BIT NOT NULL DEFAULT 1
);
```

### Indexes

```sql
-- Performance indexes
CREATE INDEX IX_Incidents_Status ON Incidents(Status);
CREATE INDEX IX_Incidents_Priority ON Incidents(Priority);
CREATE INDEX IX_Incidents_AssigneeId ON Incidents(AssigneeId);
CREATE INDEX IX_Incidents_CreatedAt ON Incidents(CreatedAt DESC);
CREATE INDEX IX_Incidents_TicketNumber ON Incidents(TicketNumber);

-- Composite indexes for common queries
CREATE INDEX IX_Incidents_Status_Priority ON Incidents(Status, Priority);
CREATE INDEX IX_Incidents_Assignee_Status ON Incidents(AssigneeId, Status) 
    INCLUDE (Title, Priority, CreatedAt);
```

## Azure Infrastructure

```
┌─────────────────────────────────────────────────────────────────┐
│                        Azure Front Door                         │
│                      (CDN, WAF, SSL)                            │
└────────────────────────────┬────────────────────────────────────┘
                             │
┌────────────────────────────▼────────────────────────────────────┐
│                       App Service                               │
│                    (SIMP.API Container)                         │
│                                                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │ Controller  │  │  Services   │  │  Background │             │
│  │   Layer     │  │   Layer     │  │   Jobs      │             │
│  └─────────────┘  └─────────────┘  └─────────────┘             │
└────────┬─────────────────┬─────────────────┬────────────────────┘
         │                 │                 │
    ┌────▼────┐      ┌─────▼─────┐     ┌─────▼─────┐
    │ Azure   │      │  Azure    │     │  Azure    │
    │ SQL DB  │      │  Blob     │     │ Service   │
    │         │      │  Storage  │     │   Bus     │
    └─────────┘      └───────────┘     └───────────┘
         │
    ┌────▼────┐
    │ Azure   │
    │ Redis   │
    │ Cache   │
    └─────────┘
```

## Security

### Authentication
- JWT Bearer tokens with refresh token rotation
- Azure AD B2C integration option
- Password hashing with BCrypt

### Authorization
- Role-based access control (RBAC)
- Resource-based policies
- Row-level security in database

### Data Protection
- TLS 1.3 in transit
- Azure SQL TDE at rest
- Managed Identity for Azure services

## Scalability Considerations

### Horizontal Scaling
- Stateless API design
- Distributed cache (Redis)
- Service Bus for background work

### Database Optimization
- Read replicas for reporting
- Proper indexing strategy
- Query optimization

### Caching Strategy
- Response caching for list endpoints
- Distributed cache for session data
- ETag support for client caching

## Monitoring & Observability

### Application Insights
- Request tracing
- Dependency tracking
- Custom metrics
- Log aggregation

### Health Checks
- `/health` - Overall status
- `/health/ready` - Dependencies ready
- `/health/live` - Process alive

### Alerts
- SLA breach warnings
- High error rates
- Performance degradation
- Resource utilization
