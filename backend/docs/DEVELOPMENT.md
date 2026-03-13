# SIMP Development Guide

## Visual Studio 2022 Setup

### Required Extensions

1. **EF Core Power Tools** - Visual database design and migrations
2. **CodeMaid** - Code cleanup and formatting
3. **SonarLint** - Code quality analysis
4. **REST Client** - Test APIs directly in VS

### Recommended Settings

```json
// .editorconfig (included in project)
root = true

[*.cs]
indent_style = space
indent_size = 4
dotnet_sort_system_directives_first = true
csharp_new_line_before_open_brace = all
csharp_prefer_braces = true
```

## Project Setup

### 1. Clone Repository

```bash
git clone https://github.com/your-org/simp-backend.git
cd simp-backend
```

### 2. Open Solution

Double-click `SmartIncidentPlatform.sln` or:

```bash
start SmartIncidentPlatform.sln
```

### 3. Restore Dependencies

Visual Studio restores automatically, or manually:

```bash
dotnet restore
```

### 4. Configure User Secrets

```bash
cd src/API
dotnet user-secrets init
dotnet user-secrets set "ConnectionStrings:DefaultConnection" "Server=(localdb)\\mssqllocaldb;Database=SIMP_Dev;Trusted_Connection=True;"
dotnet user-secrets set "Jwt:Key" "YourDevelopmentSecretKey256BitsLong!"
dotnet user-secrets set "Jwt:Issuer" "https://localhost:5001"
```

### 5. Create Database

```bash
# From solution root
dotnet ef database update --project src/Infrastructure --startup-project src/API
```

### 6. Run Application

Press `F5` in Visual Studio or:

```bash
cd src/API
dotnet run
```

Navigate to: https://localhost:5001/swagger

## Coding Standards

### Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Class | PascalCase | `IncidentService` |
| Interface | IPascalCase | `IIncidentRepository` |
| Method | PascalCase | `GetByIdAsync` |
| Property | PascalCase | `CreatedAt` |
| Field | _camelCase | `_repository` |
| Parameter | camelCase | `incidentId` |
| Constant | UPPER_CASE | `MAX_PAGE_SIZE` |

### File Organization

```csharp
// Order: usings, namespace, class
using System;
using Microsoft.Extensions.Logging;
using SIMP.Core.Entities;

namespace SIMP.Core.Services;

public class IncidentService : IIncidentService
{
    // 1. Constants
    private const int MaxPageSize = 100;
    
    // 2. Private fields
    private readonly IIncidentRepository _repository;
    private readonly ILogger<IncidentService> _logger;
    
    // 3. Constructor
    public IncidentService(
        IIncidentRepository repository,
        ILogger<IncidentService> logger)
    {
        _repository = repository;
        _logger = logger;
    }
    
    // 4. Public methods
    public async Task<Incident> GetByIdAsync(Guid id)
    {
        // Implementation
    }
    
    // 5. Private methods
    private void ValidateIncident(Incident incident)
    {
        // Implementation
    }
}
```

### Async/Await Guidelines

```csharp
// DO: Use Async suffix for async methods
public async Task<Incident> GetIncidentAsync(Guid id)

// DO: Use ConfigureAwait(false) in library code
await _repository.GetByIdAsync(id).ConfigureAwait(false);

// DON'T: Block on async code
var result = GetIncidentAsync(id).Result; // Bad!

// DO: Prefer async all the way
public async Task<ActionResult<IncidentDto>> Get(Guid id)
{
    var incident = await _service.GetByIdAsync(id);
    return Ok(incident);
}
```

### Exception Handling

```csharp
// Define domain exceptions
public class IncidentNotFoundException : Exception
{
    public Guid IncidentId { get; }
    
    public IncidentNotFoundException(Guid id) 
        : base($"Incident {id} not found")
    {
        IncidentId = id;
    }
}

// Use in service layer
public async Task<Incident> GetByIdAsync(Guid id)
{
    var incident = await _repository.GetByIdAsync(id);
    if (incident == null)
        throw new IncidentNotFoundException(id);
    return incident;
}

// Controller handles gracefully (via middleware)
```

## Adding New Features

### 1. Add Entity (Core)

```csharp
// src/Core/Entities/WorkNote.cs
public class WorkNote : BaseEntity
{
    public Guid IncidentId { get; set; }
    public string Content { get; set; } = string.Empty;
    public TimeSpan TimeSpent { get; set; }
    public Guid AuthorId { get; set; }
    
    // Navigation properties
    public virtual Incident Incident { get; set; } = null!;
    public virtual User Author { get; set; } = null!;
}
```

### 2. Add Configuration (Infrastructure)

```csharp
// src/Infrastructure/Data/Configurations/WorkNoteConfiguration.cs
public class WorkNoteConfiguration : IEntityTypeConfiguration<WorkNote>
{
    public void Configure(EntityTypeBuilder<WorkNote> builder)
    {
        builder.HasKey(x => x.Id);
        
        builder.Property(x => x.Content)
            .IsRequired()
            .HasMaxLength(4000);
            
        builder.HasOne(x => x.Incident)
            .WithMany(i => i.WorkNotes)
            .HasForeignKey(x => x.IncidentId);
    }
}
```

### 3. Update DbContext

```csharp
// Add to AppDbContext.cs
public DbSet<WorkNote> WorkNotes => Set<WorkNote>();
```

### 4. Generate Migration

```bash
dotnet ef migrations add AddWorkNotes \
  --project src/Infrastructure \
  --startup-project src/API
```

### 5. Add Repository Interface (Core)

```csharp
public interface IWorkNoteRepository : IRepository<WorkNote>
{
    Task<IReadOnlyList<WorkNote>> GetByIncidentAsync(Guid incidentId);
    Task<TimeSpan> GetTotalTimeSpentAsync(Guid incidentId);
}
```

### 6. Implement Repository (Infrastructure)

```csharp
public class WorkNoteRepository : Repository<WorkNote>, IWorkNoteRepository
{
    public WorkNoteRepository(AppDbContext context) : base(context) { }
    
    public async Task<IReadOnlyList<WorkNote>> GetByIncidentAsync(Guid incidentId)
    {
        return await _context.WorkNotes
            .Where(w => w.IncidentId == incidentId)
            .OrderByDescending(w => w.CreatedAt)
            .ToListAsync();
    }
}
```

### 7. Add DTOs (Shared)

```csharp
public record CreateWorkNoteRequest(
    string Content,
    TimeSpan TimeSpent);

public record WorkNoteDto(
    Guid Id,
    string Content,
    TimeSpan TimeSpent,
    string AuthorName,
    DateTime CreatedAt);
```

### 8. Add Controller Endpoints

```csharp
[HttpPost("{incidentId}/worknotes")]
public async Task<ActionResult<WorkNoteDto>> AddWorkNote(
    Guid incidentId,
    CreateWorkNoteRequest request)
{
    // Implementation
}
```

## Testing

### Unit Tests

```csharp
[Fact]
public void Incident_ChangeStatus_ValidTransition_UpdatesStatus()
{
    // Arrange
    var incident = new Incident { Status = IncidentStatus.Open };
    
    // Act
    incident.ChangeStatus(IncidentStatus.InProgress);
    
    // Assert
    Assert.Equal(IncidentStatus.InProgress, incident.Status);
}

[Fact]
public void Incident_ChangeStatus_InvalidTransition_ThrowsException()
{
    // Arrange
    var incident = new Incident { Status = IncidentStatus.Closed };
    
    // Act & Assert
    Assert.Throws<InvalidStatusTransitionException>(
        () => incident.ChangeStatus(IncidentStatus.Open));
}
```

### Integration Tests

```csharp
public class IncidentsControllerTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly HttpClient _client;
    
    public IncidentsControllerTests(WebApplicationFactory<Program> factory)
    {
        _client = factory.CreateClient();
    }
    
    [Fact]
    public async Task GetIncidents_ReturnsPagedResults()
    {
        // Arrange
        // Seed data...
        
        // Act
        var response = await _client.GetAsync("/api/incidents?page=1&pageSize=10");
        
        // Assert
        response.EnsureSuccessStatusCode();
        var result = await response.Content.ReadFromJsonAsync<PagedResult<IncidentDto>>();
        Assert.NotNull(result);
        Assert.True(result.Items.Count <= 10);
    }
}
```

### Run Tests

```bash
# All tests
dotnet test

# With coverage report
dotnet test --collect:"XPlat Code Coverage"
dotnet reportgenerator -reports:./coverage.xml -targetdir:./coverage-report

# Specific project
dotnet test tests/UnitTests
```

## Debugging Tips

### SQL Logging

```csharp
// In development, EF logs queries to console
// See Program.cs configuration

// Or use SQL Server Profiler / Extended Events
```

### Breakpoint Conditions

Right-click breakpoint → Conditions:
- `incidentId == Guid.Parse("...")`
- `incidents.Count > 100`

### Hot Reload

Edit code while debugging - changes apply without restart.
- Supported: Method bodies, lambdas, local functions
- Not supported: New classes, changed signatures

## Common Tasks

### Regenerate AutoMapper Profiles

Profiles auto-register. Add new profile:

```csharp
public class WorkNoteProfile : Profile
{
    public WorkNoteProfile()
    {
        CreateMap<WorkNote, WorkNoteDto>()
            .ForMember(d => d.AuthorName, 
                       o => o.MapFrom(s => s.Author.FullName));
    }
}
```

### Add New Enum

```csharp
// 1. Add to Core/Enums
public enum NotificationType
{
    Email = 1,
    SMS = 2,
    Push = 3,
    InApp = 4
}

// 2. Use in entities with int backing
[Column(TypeName = "int")]
public NotificationType Type { get; set; }
```

### Seed Data

```csharp
// Infrastructure/Data/SeedData.cs
public static class SeedData
{
    public static async Task SeedAsync(AppDbContext context)
    {
        if (!await context.Categories.AnyAsync())
        {
            context.Categories.AddRange(
                new Category { Name = "Hardware", ... },
                new Category { Name = "Software", ... }
            );
            await context.SaveChangesAsync();
        }
    }
}
```
