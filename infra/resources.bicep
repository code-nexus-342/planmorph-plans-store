@description('Name of the environment which is used to generate a short unique hash for resources.')
param environmentName string

@description('Primary location for all resources')
param location string = resourceGroup().location

@description('A unique suffix to ensure resource name uniqueness')
param resourceToken string

@description('Flag to deploy Redis cache')
param deployRedis bool = true

@description('App Service Plan SKU')
param appServicePlanSku string = 'P2v3'

@description('Redis SKU')
param redisSku string = 'Standard'

@description('Redis capacity')
param redisCapacity int = 2

@description('Backend container image name')
param backendImageName string = ''

@description('Frontend container image name')
param frontendImageName string = ''

// Define the tags that will be applied to all resources
var tags = {
  'azd-env-name': environmentName
  'project': 'planmorph'
}

var abbrs = loadJsonContent('abbreviations.json')

// Container Apps Environment
resource containerAppsEnvironment 'Microsoft.App/managedEnvironments@2023-05-01' = {
  name: '${abbrs.appManagedEnvironments}${resourceToken}'
  location: location
  tags: tags
  properties: {
    appLogsConfiguration: {
      destination: 'log-analytics'
      logAnalyticsConfiguration: {
        customerId: logAnalyticsWorkspace.properties.customerId
        sharedKey: logAnalyticsWorkspace.listKeys().primarySharedKey
      }
    }
  }
}

// Log Analytics Workspace
resource logAnalyticsWorkspace 'Microsoft.OperationalInsights/workspaces@2022-10-01' = {
  name: '${abbrs.operationalInsightsWorkspaces}${resourceToken}'
  location: location
  tags: tags
  properties: {
    retentionInDays: 30
    sku: {
      name: 'PerGB2018'
    }
  }
}

// Container Registry
resource containerRegistry 'Microsoft.ContainerRegistry/registries@2023-07-01' = {
  name: '${abbrs.containerRegistryRegistries}${resourceToken}'
  location: location
  tags: tags
  sku: {
    name: 'Basic'
  }
  properties: {
    adminUserEnabled: true
  }
}

// User-assigned managed identity
resource managedIdentity 'Microsoft.ManagedIdentity/userAssignedIdentities@2023-01-31' = {
  name: '${abbrs.managedIdentityUserAssignedIdentities}${resourceToken}'
  location: location
  tags: tags
}

// Assign AcrPull role to the managed identity
resource acrPullRole 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  scope: containerRegistry
  name: guid(subscription().id, resourceGroup().id, managedIdentity.id, 'acrPull')
  properties: {
    roleDefinitionId: subscriptionResourceId('Microsoft.Authorization/roleDefinitions', '7f951dda-4ed3-4680-a7ca-43fe172d538d') // AcrPull
    principalId: managedIdentity.properties.principalId
    principalType: 'ServicePrincipal'
  }
}

// Redis Cache (optional but recommended for high scale)
resource redisCache 'Microsoft.Cache/redis@2024-11-01' = if (deployRedis) {
  name: '${abbrs.cacheRedis}${resourceToken}'
  location: location
  tags: tags
  properties: {
    sku: {
      name: redisSku
      family: redisSku == 'Premium' ? 'P' : 'C'
      capacity: redisCapacity
    }
    enableNonSslPort: false
    minimumTlsVersion: '1.2'
    redisConfiguration: {
      'maxmemory-policy': 'allkeys-lru'
    }
    publicNetworkAccess: 'Enabled'
  }
}

// App Service Plan for high performance (alternative to Container Apps)
resource appServicePlan 'Microsoft.Web/serverfarms@2023-01-01' = {
  name: '${abbrs.webServerFarms}${resourceToken}'
  location: location
  tags: tags
  sku: {
    name: appServicePlanSku
    tier: contains(appServicePlanSku, 'P') ? (contains(appServicePlanSku, 'v3') ? 'PremiumV3' : 'PremiumV2') : (contains(appServicePlanSku, 'S') ? 'Standard' : 'Basic')
  }
  kind: 'linux'
  properties: {
    reserved: true // Required for Linux
  }
}

// Backend API App Service
resource backendAppService 'Microsoft.Web/sites@2023-01-01' = {
  name: '${abbrs.webSitesAppService}backend-${resourceToken}'
  location: location
  tags: union(tags, { 'azd-service-name': 'backend' })
  kind: 'app,linux,container'
  identity: {
    type: 'SystemAssigned, UserAssigned'
    userAssignedIdentities: {
      '${managedIdentity.id}': {}
    }
  }
  properties: {
    serverFarmId: appServicePlan.id
    siteConfig: {
      alwaysOn: true
      linuxFxVersion: backendImageName != '' ? 'DOCKER|${containerRegistry.properties.loginServer}/${backendImageName}' : 'DOCKER|node:18-alpine'
      appSettings: [
        {
          name: 'WEBSITES_ENABLE_APP_SERVICE_STORAGE'
          value: 'false'
        }
        {
          name: 'DOCKER_REGISTRY_SERVER_URL'
          value: 'https://${containerRegistry.properties.loginServer}'
        }
        {
          name: 'DOCKER_REGISTRY_SERVER_USERNAME'
          value: containerRegistry.name
        }
        {
          name: 'DOCKER_REGISTRY_SERVER_PASSWORD'
          value: containerRegistry.listCredentials().passwords[0].value
        }
        {
          name: 'NODE_ENV'
          value: 'production'
        }
        {
          name: 'PORT'
          value: '5000'
        }
        {
          name: 'REDIS_HOST'
          value: deployRedis ? redisCache.properties.hostName : ''
        }
        {
          name: 'REDIS_PORT'
          value: '6380'
        }
        {
          name: 'REDIS_PASSWORD'
          value: deployRedis ? redisCache.listKeys().primaryKey : ''
        }
        {
          name: 'CORS_ORIGIN'
          value: 'https://${frontendAppService.properties.defaultHostName}'
        }
      ]
      cors: {
        allowedOrigins: [
          'https://${frontendAppService.properties.defaultHostName}'
          'http://localhost:3000'
        ]
        supportCredentials: true
      }
      healthCheckPath: '/health'
    }
    httpsOnly: true
    publicNetworkAccess: 'Enabled'
  }
  dependsOn: [
    acrPullRole
  ]
}

// Frontend Next.js App Service
resource frontendAppService 'Microsoft.Web/sites@2023-01-01' = {
  name: '${abbrs.webSitesAppService}frontend-${resourceToken}'
  location: location
  tags: union(tags, { 'azd-service-name': 'frontend' })
  kind: 'app,linux,container'
  identity: {
    type: 'SystemAssigned, UserAssigned'
    userAssignedIdentities: {
      '${managedIdentity.id}': {}
    }
  }
  properties: {
    serverFarmId: appServicePlan.id
    siteConfig: {
      alwaysOn: true
      linuxFxVersion: frontendImageName != '' ? 'DOCKER|${containerRegistry.properties.loginServer}/${frontendImageName}' : 'DOCKER|node:18-alpine'
      appSettings: [
        {
          name: 'WEBSITES_ENABLE_APP_SERVICE_STORAGE'
          value: 'false'
        }
        {
          name: 'DOCKER_REGISTRY_SERVER_URL'
          value: 'https://${containerRegistry.properties.loginServer}'
        }
        {
          name: 'DOCKER_REGISTRY_SERVER_USERNAME'
          value: containerRegistry.name
        }
        {
          name: 'DOCKER_REGISTRY_SERVER_PASSWORD'
          value: containerRegistry.listCredentials().passwords[0].value
        }
        {
          name: 'NODE_ENV'
          value: 'production'
        }
        {
          name: 'NEXT_PUBLIC_API_URL'
          value: 'https://${backendAppService.properties.defaultHostName}'
        }
      ]
      healthCheckPath: '/'
    }
    httpsOnly: true
    publicNetworkAccess: 'Enabled'
  }
  dependsOn: [
    acrPullRole
  ]
}

// Application Insights for monitoring
resource applicationInsights 'Microsoft.Insights/components@2020-02-02' = {
  name: '${abbrs.insightsComponents}${resourceToken}'
  location: location
  tags: tags
  kind: 'web'
  properties: {
    Application_Type: 'web'
    WorkspaceResourceId: logAnalyticsWorkspace.id
  }
}

// Outputs
output BACKEND_URI string = 'https://${backendAppService.properties.defaultHostName}'
output FRONTEND_URI string = 'https://${frontendAppService.properties.defaultHostName}'
output REDIS_HOST_NAME string = deployRedis ? redisCache.properties.hostName : ''
output AZURE_CONTAINER_REGISTRY_ENDPOINT string = containerRegistry.properties.loginServer
output AZURE_CONTAINER_REGISTRY_NAME string = containerRegistry.name
output RESOURCE_GROUP_NAME string = resourceGroup().name
