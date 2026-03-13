# SIMP - Smart Incident Management Platform

Enterprise-grade incident management system built with .NET 8, Clean Architecture, and Azure cloud services.

## Solution Structure

```
SmartIncidentPlatform/
├── src/
│   ├── API/                    # ASP.NET Core Web API (Presentation Layer)
│   │   ├── Controllers/        # REST API endpoints
│   │   ├── Middleware/         # Error handling, logging
│   │   ├── Mappings/           # AutoMapper profiles
│   │   └── Program.cs          # Application entry point
│   │
│   ├── Core/                   # Domain Layer (Business Logic)
│   │   ├── Entities/           # Domain models
│   │   ├── Enums/              # Status, Priority, Role enums
│   │   └── Interfaces/         # Repository & service contracts
│   │
│   ├── Infrastructure/         # Data Access Layer
│   │   └── Data/
│   │       ├── Configurations/ # EF Core entity configurations
│   │       ├── Repositories/   # Repository implementations
│   │       ├── AppDbContext.cs # Database context
│   │       └── UnitOfWork.cs   # Unit of Work pattern
│   │
│   └── Shared/                 # Cross-cutting concerns
│       └── DTOs/               # Data Transfer Objects
│
├── tests/
│   ├── UnitTests/              # Domain & service tests
│   └── IntegrationTests/       # API endpoint tests
│
└── infrastructure/
    └── bicep/                  # Azure IaC templates
```

## Prerequisites

- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [Visual Studio 2022](https://visualstudio.microsoft.com/) (v17.8+)
- [SQL Server 2022](https://www.microsoft.com/sql-server) or Azure SQL
- [Azure CLI](https://docs.microsoft.com/cli/azure/install-azure-cli) (for deployment)

## Quick Start

### 1. Clone and Open Solution

```bash
git clone https://github.com/your-org/simp-backend.git
cd simp-backend
start SmartIncidentPlatform.sln  # Opens in VS2022
```

### 2. Configure Database

Update `src/API/appsettings.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=SIMP;Trusted_Connection=True;"
  }
}
```

### 3. Run Migrations

```bash
# From solution root
dotnet ef migrations add InitialCreate --project src/Infrastructure --startup-project src/API
dotnet ef database update --project src/Infrastructure --startup-project src/API
```

### 4. Run the API

```bash
cd src/API
dotnet run
```

API will be available at:
- Swagger UI: https://localhost:5001/swagger
- Health Check: https://localhost:5001/health

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/incidents` | GET | List incidents (paginated, filtered) |
| `/api/incidents/{id}` | GET | Get incident details |
| `/api/incidents` | POST | Create new incident |
| `/api/incidents/{id}` | PUT | Update incident |
| `/api/incidents/{id}/status` | PATCH | Update status only |
| `/api/incidents/{id}/assign` | POST | Assign to user/group |
| `/api/incidents/{id}/comments` | POST | Add comment |
| `/api/incidents/{id}/attachments` | POST | Upload attachment |
| `/api/users` | GET/POST | User management |
| `/api/categories` | GET/POST | Category management |
| `/api/analytics/dashboard` | GET | Dashboard metrics |

## Architecture Decisions

### Clean Architecture

- **Core**: Pure domain logic, no external dependencies
- **Infrastructure**: EF Core, file storage, external services
- **API**: Controllers, middleware, DI configuration
- **Shared**: DTOs shared between layers

### Key Patterns

- **Repository Pattern**: Abstraction over data access
- **Unit of Work**: Transaction management
- **CQRS-Ready**: Separation of read/write operations
- **Domain Events**: For cross-cutting notifications

## Development Workflow

### Building

```bash
dotnet build SmartIncidentPlatform.sln
```

### Testing

```bash
# All tests
dotnet test

# Unit tests only
dotnet test tests/UnitTests

# With coverage
dotnet test --collect:"XPlat Code Coverage"
```

### Code Quality

```bash
# Format check
dotnet format --verify-no-changes

# Security scan
dotnet list package --vulnerable
```

## Azure Deployment

### Infrastructure Provisioning

```bash
az login
az group create -n rg-simp-prod -l eastus

az deployment group create \
  -g rg-simp-prod \
  -f infrastructure/bicep/main.bicep \
  -p environment=prod
```

### Application Deployment

GitHub Actions workflows handle CI/CD:
- **ci.yml**: Build, test, scan on PR
- **cd.yml**: Deploy to Azure on merge to main

## Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `ConnectionStrings__DefaultConnection` | SQL Server connection string | Yes |
| `Jwt__Key` | JWT signing key (256-bit) | Yes |
| `Jwt__Issuer` | JWT issuer URL | Yes |
| `AzureStorage__ConnectionString` | Blob storage for attachments | Yes |
| `ApplicationInsights__ConnectionString` | Telemetry | Recommended |
| `ServiceBus__ConnectionString` | Async messaging | Optional |

### Feature Flags

Configure in `appsettings.json`:

```json
{
  "Features": {
    "EnableSLAMonitoring": true,
    "EnableEmailNotifications": true,
    "EnableAIClassification": false
  }
}
```

## VS2022 Development Tips

1. **Hot Reload**: Edit code while debugging (Ctrl+Shift+Enter)
2. **SQL Server Object Explorer**: View/edit database directly
3. **Swagger**: Test endpoints without external tools
4. **User Secrets**: `dotnet user-secrets set "Key" "Value"`

## Contributing

1. Create feature branch from `develop`
2. Implement changes with tests
3. Run `dotnet format` before committing
4. Create PR with description of changes
5. Squash merge after approval

## License

Proprietary - Internal Use Only
