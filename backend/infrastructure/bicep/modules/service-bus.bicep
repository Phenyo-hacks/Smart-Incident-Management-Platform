// Service Bus module

param environment string
param location string

var serviceBusName = 'sb-simp-${environment}-${uniqueString(resourceGroup().id)}'

// Service Bus Namespace
resource serviceBus 'Microsoft.ServiceBus/namespaces@2022-10-01-preview' = {
  name: serviceBusName
  location: location
  sku: {
    name: environment == 'prod' ? 'Standard' : 'Basic'
    tier: environment == 'prod' ? 'Standard' : 'Basic'
  }
  properties: {
    minimumTlsVersion: '1.2'
    publicNetworkAccess: 'Enabled'
  }
  tags: {
    environment: environment
  }
}

// Incident Events Queue
resource incidentEventsQueue 'Microsoft.ServiceBus/namespaces/queues@2022-10-01-preview' = {
  parent: serviceBus
  name: 'incident-events'
  properties: {
    maxDeliveryCount: 10
    defaultMessageTimeToLive: 'P14D'
    lockDuration: 'PT5M'
    deadLetteringOnMessageExpiration: true
  }
}

// Notification Queue
resource notificationQueue 'Microsoft.ServiceBus/namespaces/queues@2022-10-01-preview' = {
  parent: serviceBus
  name: 'notifications'
  properties: {
    maxDeliveryCount: 5
    defaultMessageTimeToLive: 'P1D'
    lockDuration: 'PT1M'
    deadLetteringOnMessageExpiration: true
  }
}

// Email Queue
resource emailQueue 'Microsoft.ServiceBus/namespaces/queues@2022-10-01-preview' = {
  parent: serviceBus
  name: 'emails'
  properties: {
    maxDeliveryCount: 3
    defaultMessageTimeToLive: 'P1D'
    lockDuration: 'PT1M'
    deadLetteringOnMessageExpiration: true
  }
}

// Authorization Rule
resource authRule 'Microsoft.ServiceBus/namespaces/AuthorizationRules@2022-10-01-preview' = {
  parent: serviceBus
  name: 'app-access'
  properties: {
    rights: [
      'Listen'
      'Send'
    ]
  }
}

output serviceBusNamespace string = serviceBus.name
output serviceBusEndpoint string = serviceBus.properties.serviceBusEndpoint
