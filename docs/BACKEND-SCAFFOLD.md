# Backend Scaffold Guide for VS2022

> This document explains what you need to build in your .NET backend to connect
> with this frontend. It's designed for learning - every section explains WHY.

---

## Understanding the Architecture

### Clean Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         API Layer                                │
│  (Controllers, Middleware, Filters - receives HTTP requests)    │
├─────────────────────────────────────────────────────────────────┤
│                     Application Layer                            │
│  (Services, DTOs, Interfaces - orchestrates business logic)     │
├─────────────────────────────────────────────────────────────────┤
│                       Domain Layer                               │
│  (Entities, Enums, Business Rules - the core of your app)       │
├─────────────────────────────────────────────────────────────────┤
│                    Infrastructure Layer                          │
│  (Database, External APIs, File Storage - technical details)    │
└─────────────────────────────────────────────────────────────────┘
```

**Why this structure?**
- **Separation of Concerns**: Each layer has one job
- **Testability**: You can test business logic without a database
- **Flexibility**: Change your database without touching business rules

---

## Solution Structure

Create this structure in VS2022:

```
SmartIncidentPlatform/
├── SmartIncidentPlatform.sln              # Solution file
│
├── src/
│   ├── SIMP.API/                          # API Layer (ASP.NET Core Web API)
│   │   ├── Controllers/
│   │   │   ├── AuthController.cs          # Login, logout, refresh token
│   │   │   ├── IncidentsController.cs     # CRUD for incidents
│   │   │   ├── UsersController.cs         # User management
│   │   │   ├── CategoriesController.cs    # Category management
│   │   │   ├── SupportGroupsController.cs # Support groups
│   │   │   └── AnalyticsController.cs     # Dashboard metrics
│   │   ├── Middleware/
│   │   │   ├── ErrorHandlingMiddleware.cs # Global error handling
│   │   │   └── RequestLoggingMiddleware.cs# Request logging
│   │   ├── Filters/
│   │   │   └── ValidateModelAttribute.cs  # Model validation
│   │   └── Program.cs                     # App entry point
│   │
│   ├── SIMP.Core/                         # Domain Layer (Class Library)
│   │   ├── Entities/
│   │   │   ├── Incident.cs               # Main incident entity
│   │   │   ├── User.cs                   # User entity
│   │   │   ├── Comment.cs                # Incident comments
│   │   │   ├── Attachment.cs             # File attachments
│   │   │   ├── Category.cs               # Incident categories
│   │   │   ├── SupportGroup.cs           # Support groups
│   │   │   └── SLAPolicy.cs              # SLA configuration
│   │   ├── Enums/
│   │   │   ├── IncidentStatus.cs         # Status values
│   │   │   ├── IncidentPriority.cs       # Priority levels
│   │   │   └── UserType.cs               # User roles
│   │   └── Interfaces/
│   │       ├── IIncidentRepository.cs    # Incident data access
│   │       └── IUnitOfWork.cs            # Transaction management
│   │
│   ├── SIMP.Application/                  # Application Layer (Class Library)
│   │   ├── Services/
│   │   │   ├── IncidentService.cs        # Incident business logic
│   │   │   ├── UserService.cs            # User business logic
│   │   │   └── AnalyticsService.cs       # Metrics calculations
│   │   ├── DTOs/
│   │   │   ├── IncidentDto.cs            # Data transfer objects
│   │   │   ├── CreateIncidentDto.cs
│   │   │   └── UserDto.cs
│   │   └── Mapping/
│   │       └── AutoMapperProfile.cs      # Entity <-> DTO mapping
│   │
│   └── SIMP.Infrastructure/               # Infrastructure Layer (Class Library)
│       ├── Data/
│       │   ├── AppDbContext.cs           # EF Core DbContext
│       │   ├── Configurations/
│       │   │   ├── IncidentConfiguration.cs  # Entity configuration
│       │   │   └── UserConfiguration.cs
│       │   └── Repositories/
│       │       ├── IncidentRepository.cs
│       │       └── UserRepository.cs
│       ├── Migrations/                    # EF Core migrations
│       └── Services/
│           ├── EmailService.cs           # Email sending
│           └── BlobStorageService.cs     # File storage
│
└── tests/
    ├── SIMP.UnitTests/                    # Unit tests
    └── SIMP.IntegrationTests/             # Integration tests
```

---

## Step-by-Step Implementation

### Step 1: Create the Solution

```bash
# In terminal/command prompt
dotnet new sln -n SmartIncidentPlatform

# Create projects
dotnet new webapi -n SIMP.API
dotnet new classlib -n SIMP.Core
dotnet new classlib -n SIMP.Application
dotnet new classlib -n SIMP.Infrastructure

# Add to solution
dotnet sln add src/SIMP.API
dotnet sln add src/SIMP.Core
dotnet sln add src/SIMP.Application
dotnet sln add src/SIMP.Infrastructure

# Set up references (dependency flow)
cd src/SIMP.Application
dotnet add reference ../SIMP.Core

cd ../SIMP.Infrastructure
dotnet add reference ../SIMP.Core
dotnet add reference ../SIMP.Application

cd ../SIMP.API
dotnet add reference ../SIMP.Application
dotnet add reference ../SIMP.Infrastructure
```

### Step 2: Create Domain Entities

```csharp
// src/SIMP.Core/Entities/Incident.cs

using SIMP.Core.Enums;

namespace SIMP.Core.Entities;

/// <summary>
/// The Incident entity represents a single support ticket/issue in the system.
/// This is the CORE of our domain - everything revolves around incidents.
/// 
/// WHY THIS DESIGN:
/// - Guid Id: Globally unique, great for distributed systems
/// - IncidentNumber: Human-readable for users (INC-2024-0001)
/// - Status enum: Strict state machine prevents invalid transitions
/// - SLA fields: Track response/resolution deadlines
/// </summary>
public class Incident
{
    // Primary key - using Guid for distributed systems compatibility
    public Guid Id { get; set; }
    
    // Human-readable identifier (e.g., INC-2024-0001)
    // Generated automatically, never changes
    public string IncidentNumber { get; set; } = string.Empty;
    
    // ========== Core Information ==========
    // These fields capture WHAT the incident is about
    
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    
    // ========== Classification ==========
    // These fields determine HOW we handle the incident
    
    public IncidentStatus Status { get; set; } = IncidentStatus.New;
    public IncidentPriority Priority { get; set; }
    
    // Category relationship - FK to Category table
    public Guid CategoryId { get; set; }
    public virtual Category Category { get; set; } = null!;
    
    public Guid? SubcategoryId { get; set; }
    public virtual Subcategory? Subcategory { get; set; }
    
    // Impact + Urgency = Priority (calculated or manual)
    public ImpactLevel Impact { get; set; }
    public UrgencyLevel Urgency { get; set; }
    
    // ========== Ownership ==========
    // These fields track WHO is involved
    
    // The person who reported the incident
    public Guid RequesterId { get; set; }
    public virtual User Requester { get; set; } = null!;
    
    // The agent currently working on it (optional)
    public Guid? AssignedToId { get; set; }
    public virtual User? AssignedTo { get; set; }
    
    // The support group responsible
    public Guid? AssignedGroupId { get; set; }
    public virtual SupportGroup? AssignedGroup { get; set; }
    
    // ========== Timestamps ==========
    // These fields track WHEN things happened
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
    public DateTime? FirstResponseAt { get; set; }
    public DateTime? ResolvedAt { get; set; }
    public DateTime? ClosedAt { get; set; }
    
    // ========== SLA Tracking ==========
    // These fields enforce service level agreements
    
    public DateTime ResponseDueAt { get; set; }
    public DateTime ResolutionDueAt { get; set; }
    public bool IsResponseBreached { get; set; }
    public bool IsResolutionBreached { get; set; }
    public SLABreachStatus BreachStatus { get; set; } = SLABreachStatus.OnTrack;
    
    // ========== Resolution ==========
    // These fields capture HOW it was resolved
    
    public string? ResolutionNotes { get; set; }
    public ResolutionCode? ResolutionCode { get; set; }
    public bool IsReopened { get; set; }
    public int ReopenCount { get; set; }
    
    // ========== Navigation Properties ==========
    // EF Core uses these to load related data
    
    public virtual ICollection<Comment> Comments { get; set; } = new List<Comment>();
    public virtual ICollection<Attachment> Attachments { get; set; } = new List<Attachment>();
    public virtual ICollection<IncidentHistory> History { get; set; } = new List<IncidentHistory>();
}
```

### Step 3: Create Enums

```csharp
// src/SIMP.Core/Enums/IncidentStatus.cs

namespace SIMP.Core.Enums;

/// <summary>
/// Represents the lifecycle states of an incident.
/// 
/// STATE MACHINE:
/// New -> Open -> InProgress -> Pending -> Resolved -> Closed
///                    |              |          |
///                    v              v          v
///               Escalated    (back to InProgress)  Reopened
/// 
/// WHY THESE STATES:
/// - New: Just created, not yet triaged
/// - Open: Triaged, awaiting assignment
/// - InProgress: Actively being worked on
/// - Pending: Waiting for customer/external input
/// - Resolved: Solution provided, awaiting confirmation
/// - Closed: Confirmed resolved, archived
/// - Reopened: Customer reported issue persists
/// - Cancelled: Duplicate or invalid request
/// </summary>
public enum IncidentStatus
{
    New = 0,
    Open = 1,
    InProgress = 2,
    Pending = 3,
    Resolved = 4,
    Closed = 5,
    Reopened = 6,
    Cancelled = 7
}
```

```csharp
// src/SIMP.Core/Enums/IncidentPriority.cs

namespace SIMP.Core.Enums;

/// <summary>
/// Priority levels with associated SLA targets.
/// 
/// SLA TARGETS (example, configure per organization):
/// P1 (Critical): 1 hour response, 4 hour resolution
/// P2 (High):     4 hour response, 24 hour resolution
/// P3 (Medium):   8 hour response, 48 hour resolution
/// P4 (Low):      24 hour response, 120 hour resolution
/// 
/// CALCULATION:
/// Priority = Impact x Urgency matrix
/// High Impact + High Urgency = P1
/// High Impact + Low Urgency = P2
/// etc.
/// </summary>
public enum IncidentPriority
{
    P1 = 1, // Critical - Business stopped
    P2 = 2, // High - Major feature broken
    P3 = 3, // Medium - Workaround available
    P4 = 4  // Low - Minor inconvenience
}
```

### Step 4: Create the DbContext

```csharp
// src/SIMP.Infrastructure/Data/AppDbContext.cs

using Microsoft.EntityFrameworkCore;
using SIMP.Core.Entities;

namespace SIMP.Infrastructure.Data;

/// <summary>
/// Entity Framework Core DbContext - the bridge between C# and SQL Server.
/// 
/// WHAT IT DOES:
/// - Maps C# classes to database tables
/// - Tracks changes to entities
/// - Generates SQL queries
/// - Handles transactions
/// 
/// HOW TO USE:
/// var incident = await _context.Incidents.FindAsync(id);
/// _context.Incidents.Add(newIncident);
/// await _context.SaveChangesAsync();
/// </summary>
public class AppDbContext : DbContext
{
    // Constructor - receives connection string from DI
    public AppDbContext(DbContextOptions<AppDbContext> options) 
        : base(options)
    {
    }
    
    // ========== DbSets ==========
    // Each DbSet<T> represents a table in the database
    // The property name becomes the table name (pluralized)
    
    public DbSet<Incident> Incidents => Set<Incident>();
    public DbSet<User> Users => Set<User>();
    public DbSet<Comment> Comments => Set<Comment>();
    public DbSet<Attachment> Attachments => Set<Attachment>();
    public DbSet<Category> Categories => Set<Category>();
    public DbSet<Subcategory> Subcategories => Set<Subcategory>();
    public DbSet<SupportGroup> SupportGroups => Set<SupportGroup>();
    public DbSet<SLAPolicy> SLAPolicies => Set<SLAPolicy>();
    public DbSet<RoutingRule> RoutingRules => Set<RoutingRule>();
    public DbSet<IncidentHistory> IncidentHistory => Set<IncidentHistory>();
    
    /// <summary>
    /// Configure entity mappings using Fluent API.
    /// This is where we define relationships, constraints, and indexes.
    /// </summary>
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        
        // Apply all configurations from this assembly
        // (looks for classes that implement IEntityTypeConfiguration<T>)
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);
    }
}
```

### Step 5: Create a Controller

```csharp
// src/SIMP.API/Controllers/IncidentsController.cs

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SIMP.Application.DTOs;
using SIMP.Application.Services;

namespace SIMP.API.Controllers;

/// <summary>
/// REST API controller for incident operations.
/// 
/// REST CONVENTIONS:
/// GET    /api/incidents       - Get all (with filtering/paging)
/// GET    /api/incidents/{id}  - Get one by ID
/// POST   /api/incidents       - Create new
/// PUT    /api/incidents/{id}  - Full update
/// PATCH  /api/incidents/{id}  - Partial update
/// DELETE /api/incidents/{id}  - Delete
/// 
/// WHY [ApiController]:
/// - Automatic model validation
/// - Automatic 400 Bad Request for invalid models
/// - Binding source inference
/// </summary>
[ApiController]
[Route("api/v1/[controller]")]
[Authorize] // All endpoints require authentication
public class IncidentsController : ControllerBase
{
    // Dependencies injected via constructor
    private readonly IIncidentService _incidentService;
    private readonly ILogger<IncidentsController> _logger;
    
    public IncidentsController(
        IIncidentService incidentService,
        ILogger<IncidentsController> logger)
    {
        _incidentService = incidentService;
        _logger = logger;
    }
    
    /// <summary>
    /// Get all incidents with optional filtering and pagination.
    /// 
    /// QUERY PARAMETERS:
    /// - status: Filter by status (comma-separated)
    /// - priority: Filter by priority
    /// - assignedToId: Filter by assigned agent
    /// - page: Page number (default: 1)
    /// - pageSize: Items per page (default: 20)
    /// </summary>
    [HttpGet]
    [ProducesResponseType(typeof(PagedResult<IncidentDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<PagedResult<IncidentDto>>> GetAll(
        [FromQuery] IncidentFilterParams filter)
    {
        _logger.LogInformation("Getting incidents with filter: {@Filter}", filter);
        
        var result = await _incidentService.GetAllAsync(filter);
        return Ok(result);
    }
    
    /// <summary>
    /// Get a single incident by ID.
    /// Returns 404 if not found.
    /// </summary>
    [HttpGet("{id:guid}")]
    [ProducesResponseType(typeof(IncidentDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<IncidentDto>> GetById(Guid id)
    {
        var incident = await _incidentService.GetByIdAsync(id);
        
        if (incident == null)
        {
            _logger.LogWarning("Incident {Id} not found", id);
            return NotFound();
        }
        
        return Ok(incident);
    }
    
    /// <summary>
    /// Create a new incident.
    /// Returns 201 Created with the new incident.
    /// </summary>
    [HttpPost]
    [ProducesResponseType(typeof(IncidentDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<IncidentDto>> Create(
        [FromBody] CreateIncidentDto createDto)
    {
        // Get current user from claims (set by auth middleware)
        var userId = User.GetUserId();
        
        var incident = await _incidentService.CreateAsync(createDto, userId);
        
        _logger.LogInformation(
            "Created incident {IncidentNumber} by user {UserId}",
            incident.IncidentNumber, userId);
        
        // Return 201 with Location header pointing to the new resource
        return CreatedAtAction(
            nameof(GetById),
            new { id = incident.Id },
            incident);
    }
    
    /// <summary>
    /// Update an existing incident.
    /// Returns 204 No Content on success.
    /// </summary>
    [HttpPut("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Update(
        Guid id,
        [FromBody] UpdateIncidentDto updateDto)
    {
        var success = await _incidentService.UpdateAsync(id, updateDto);
        
        if (!success)
            return NotFound();
        
        return NoContent();
    }
    
    /// <summary>
    /// Transition incident to a new status.
    /// Business rules are enforced (e.g., can't go from Closed to New).
    /// </summary>
    [HttpPatch("{id:guid}/status")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> UpdateStatus(
        Guid id,
        [FromBody] UpdateStatusDto statusDto)
    {
        try
        {
            await _incidentService.UpdateStatusAsync(id, statusDto.Status);
            return NoContent();
        }
        catch (InvalidOperationException ex)
        {
            // Invalid state transition
            return BadRequest(new { error = ex.Message });
        }
    }
}
```

---

## What the Frontend Expects

The frontend (`lib/api/services.ts`) calls these endpoints:

| Frontend Method | HTTP Request | Your Controller Method |
|-----------------|--------------|------------------------|
| `incidentService.getAll()` | `GET /api/incidents` | `GetAll()` |
| `incidentService.getById(id)` | `GET /api/incidents/{id}` | `GetById()` |
| `incidentService.create(data)` | `POST /api/incidents` | `Create()` |
| `incidentService.update(id, data)` | `PUT /api/incidents/{id}` | `Update()` |
| `incidentService.updateStatus(id, status)` | `PATCH /api/incidents/{id}/status` | `UpdateStatus()` |

---

## Next Steps

1. **Create the Solution**: Use the commands above
2. **Add NuGet Packages**:
   - `Microsoft.EntityFrameworkCore.SqlServer`
   - `Microsoft.EntityFrameworkCore.Tools`
   - `AutoMapper.Extensions.Microsoft.DependencyInjection`
   - `Microsoft.AspNetCore.Authentication.JwtBearer`
3. **Create Entities**: Start with Incident, User, Category
4. **Create DbContext**: Set up EF Core
5. **Add Migrations**: `dotnet ef migrations add InitialCreate`
6. **Create Controllers**: One per entity
7. **Test with Frontend**: Update `.env.local` with your API URL

---

## Questions?

Check the [API-INTEGRATION.md](API-INTEGRATION.md) for the exact request/response formats the frontend expects.
