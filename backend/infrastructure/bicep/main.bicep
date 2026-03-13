// SIMP Infrastructure - Main Bicep Template
// Deploy with: az deployment sub create --location eastus --template-file main.bicep --parameters environment=dev

targetScope = 'subscription'

@allowed(['dev', 'staging', 'prod'])
param environment string = 'dev'

@description('Azure region for resources')
param location string = 'eastus'

@description('SQL admin username')
@secure()
param sqlAdminUsername string

@description('SQL admin password')
@secure()
param sqlAdminPassword string

// Resource group
resource rg 'Microsoft.Resources/resourceGroups@2023-07-01' = {
  name: 'rg-simp-${environment}'
  location: location
  tags: {
    environment: environment
    project: 'SIMP'
    managedBy: 'Bicep'
  }
}

// App Service module
module appService 'modules/app-service.bicep' = {
  name: 'appService'
  scope: rg
  params: {
    environment: environment
    location: location
  }
}

// SQL Database module
module sqlDatabase 'modules/sql-database.bicep' = {
  name: 'sqlDatabase'
  scope: rg
  params: {
    environment: environment
    location: location
    adminUsername: sqlAdminUsername
    adminPassword: sqlAdminPassword
  }
}

// Storage Account module
module storage 'modules/storage.bicep' = {
  name: 'storage'
  scope: rg
  params: {
    environment: environment
    location: location
  }
}

// Application Insights module
module appInsights 'modules/app-insights.bicep' = {
  name: 'appInsights'
  scope: rg
  params: {
    environment: environment
    location: location
  }
}

// Service Bus module
module serviceBus 'modules/service-bus.bicep' = {
  name: 'serviceBus'
  scope: rg
  params: {
    environment: environment
    location: location
  }
}

// Outputs
output resourceGroupName string = rg.name
output appServiceUrl string = appService.outputs.appServiceUrl
output sqlServerName string = sqlDatabase.outputs.sqlServerName
output storageAccountName string = storage.outputs.storageAccountName
output appInsightsInstrumentationKey string = appInsights.outputs.instrumentationKey
