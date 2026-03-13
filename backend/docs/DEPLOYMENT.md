# SIMP Deployment Guide

## Prerequisites

- Azure subscription with Contributor access
- Azure CLI installed and authenticated
- .NET 8 SDK
- Docker (for container builds)

## Environments

| Environment | Purpose | Azure Resource Group |
|-------------|---------|---------------------|
| Development | Local development | N/A |
| Staging | Testing & QA | rg-simp-staging |
| Production | Live system | rg-simp-prod |

## Infrastructure Provisioning

### 1. Create Resource Group

```bash
az login
az account set --subscription "Your Subscription"

# Production
az group create --name rg-simp-prod --location eastus

# Staging
az group create --name rg-simp-staging --location eastus
```

### 2. Deploy Infrastructure with Bicep

```bash
# Navigate to infrastructure folder
cd infrastructure/bicep

# Deploy staging
az deployment group create \
  --resource-group rg-simp-staging \
  --template-file main.bicep \
  --parameters environment=staging \
  --parameters sqlAdminPassword="$(openssl rand -base64 32)"

# Deploy production
az deployment group create \
  --resource-group rg-simp-prod \
  --template-file main.bicep \
  --parameters environment=prod \
  --parameters sqlAdminPassword="YourSecurePassword123!"
```

### 3. Retrieve Connection Strings

```bash
# Get outputs from deployment
az deployment group show \
  --resource-group rg-simp-prod \
  --name main \
  --query properties.outputs
```

## Application Deployment

### Option 1: GitHub Actions (Recommended)

CI/CD is pre-configured in `.github/workflows/`.

**Setup:**

1. Add GitHub secrets:
   - `AZURE_CREDENTIALS` - Service principal JSON
   - `AZURE_SUBSCRIPTION_ID`
   - `SQL_CONNECTION_STRING`
   - `JWT_SECRET`

2. Push to main branch to trigger deployment

**Creating Azure Service Principal:**

```bash
az ad sp create-for-rbac \
  --name "simp-github-actions" \
  --role Contributor \
  --scopes /subscriptions/{subscription-id}/resourceGroups/rg-simp-prod \
  --sdk-auth
```

### Option 2: Azure DevOps

```yaml
# azure-pipelines.yml
trigger:
  - main

pool:
  vmImage: 'ubuntu-latest'

stages:
  - stage: Build
    jobs:
      - job: BuildAndTest
        steps:
          - task: UseDotNet@2
            inputs:
              version: '8.0.x'
          
          - script: dotnet build --configuration Release
          
          - script: dotnet test --configuration Release
          
          - script: dotnet publish src/API -c Release -o $(Build.ArtifactStagingDirectory)
          
          - publish: $(Build.ArtifactStagingDirectory)
            artifact: api

  - stage: Deploy
    dependsOn: Build
    jobs:
      - deployment: DeployToAzure
        environment: production
        strategy:
          runOnce:
            deploy:
              steps:
                - task: AzureWebApp@1
                  inputs:
                    azureSubscription: 'Azure Connection'
                    appName: 'app-simp-prod'
                    package: '$(Pipeline.Workspace)/api'
```

### Option 3: Manual Deployment

```bash
# Build
dotnet publish src/API -c Release -o ./publish

# Deploy via Azure CLI
az webapp deployment source config-zip \
  --resource-group rg-simp-prod \
  --name app-simp-prod \
  --src ./publish.zip
```

## Database Migrations

### Initial Setup

```bash
# Generate migration
dotnet ef migrations add InitialCreate \
  --project src/Infrastructure \
  --startup-project src/API \
  --output-dir Data/Migrations

# Apply to database
dotnet ef database update \
  --project src/Infrastructure \
  --startup-project src/API
```

### Production Migrations

```bash
# Generate SQL script for review
dotnet ef migrations script \
  --project src/Infrastructure \
  --startup-project src/API \
  --idempotent \
  --output migration.sql

# Apply via Azure CLI or SSMS
sqlcmd -S server.database.windows.net -d SIMP -U admin -P password -i migration.sql
```

## Configuration

### App Service Configuration

Set these in Azure Portal → App Service → Configuration:

| Setting | Value |
|---------|-------|
| `ConnectionStrings__DefaultConnection` | SQL connection string |
| `Jwt__Key` | 256-bit secret key |
| `Jwt__Issuer` | https://app-simp-prod.azurewebsites.net |
| `AzureStorage__ConnectionString` | Blob storage connection |
| `ASPNETCORE_ENVIRONMENT` | Production |

### Key Vault Integration (Recommended)

```bash
# Create Key Vault
az keyvault create \
  --name kv-simp-prod \
  --resource-group rg-simp-prod

# Add secrets
az keyvault secret set --vault-name kv-simp-prod --name "SqlConnectionString" --value "..."
az keyvault secret set --vault-name kv-simp-prod --name "JwtKey" --value "..."

# Grant App Service access
az webapp identity assign --name app-simp-prod --resource-group rg-simp-prod

az keyvault set-policy --name kv-simp-prod \
  --object-id <app-service-principal-id> \
  --secret-permissions get list
```

Update `appsettings.json`:

```json
{
  "KeyVault": {
    "VaultUri": "https://kv-simp-prod.vault.azure.net/"
  }
}
```

## SSL/TLS Configuration

### Custom Domain

```bash
# Add custom domain
az webapp config hostname add \
  --webapp-name app-simp-prod \
  --resource-group rg-simp-prod \
  --hostname incidents.yourcompany.com

# Bind SSL certificate
az webapp config ssl bind \
  --name app-simp-prod \
  --resource-group rg-simp-prod \
  --certificate-thumbprint <thumbprint> \
  --ssl-type SNI
```

### Managed Certificate (Free)

```bash
az webapp config ssl create \
  --name app-simp-prod \
  --resource-group rg-simp-prod \
  --hostname incidents.yourcompany.com
```

## Monitoring Setup

### Application Insights

Already deployed via Bicep. Configure alerts:

```bash
# Create alert for high error rate
az monitor metrics alert create \
  --name "HighErrorRate" \
  --resource-group rg-simp-prod \
  --scopes /subscriptions/.../providers/Microsoft.Web/sites/app-simp-prod \
  --condition "avg requests/failed > 10" \
  --window-size 5m \
  --action webhook https://teams.webhook.url
```

### Log Analytics Queries

```kusto
// Failed requests by endpoint
requests
| where success == false
| summarize count() by name, resultCode
| order by count_ desc

// Slow queries
dependencies
| where duration > 1000
| project timestamp, name, duration, data
```

## Rollback Procedures

### App Service Slots (Zero-Downtime)

```bash
# Deploy to staging slot
az webapp deployment slot create \
  --name app-simp-prod \
  --resource-group rg-simp-prod \
  --slot staging

# Swap when ready
az webapp deployment slot swap \
  --name app-simp-prod \
  --resource-group rg-simp-prod \
  --slot staging \
  --target-slot production

# Rollback (swap again)
az webapp deployment slot swap \
  --name app-simp-prod \
  --resource-group rg-simp-prod \
  --slot production \
  --target-slot staging
```

### Database Rollback

```bash
# Generate rollback script before migration
dotnet ef migrations script \
  --project src/Infrastructure \
  --startup-project src/API \
  --from TargetMigration \
  --to PreviousMigration \
  --output rollback.sql
```

## Health Checks

Verify deployment:

```bash
# Check health endpoint
curl https://app-simp-prod.azurewebsites.net/health

# Expected response
{
  "status": "Healthy",
  "checks": {
    "database": "Healthy",
    "storage": "Healthy",
    "cache": "Healthy"
  }
}
```

## Troubleshooting

### Common Issues

**Connection String Errors**
- Verify firewall rules allow App Service IPs
- Check connection string format for Azure SQL

**JWT Token Issues**
- Ensure JWT key is at least 256 bits
- Verify issuer matches app URL

**Slow Cold Start**
- Enable Always On in App Service
- Use Premium plan for production

### Log Streaming

```bash
az webapp log tail \
  --name app-simp-prod \
  --resource-group rg-simp-prod
```
