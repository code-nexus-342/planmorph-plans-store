@description('Name of the environment which is used to generate a short unique hash for resources.')
param environmentName string

@description('Primary location for all resources')
param location string = resourceGroup().location

@description('A unique suffix to ensure resource name uniqueness')
param resourceToken string

@description('Flag to deploy Redis cache')
param deployRedis bool = true

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
  project: 'planmorph'
}

var abbrs = loadJsonContent('abbreviations.json')

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

// Container Registry
resource containerRegistry 'Microsoft.ContainerRegistry/registries@2023-07-01' = {
  name: '${abbrs.containerRegistryRegistries}planmorph${toLower(resourceToken)}'
  location: location
  tags: tags
  sku: {
    name: 'Basic'
  }
  properties: {
    adminUserEnabled: false
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

// Backend API Container App
resource backendContainerApp 'Microsoft.App/containerApps@2023-05-01' = {
  name: '${abbrs.appContainerApps}api-${resourceToken}'
  location: location
  tags: union(tags, { 'azd-service-name': 'api' })
  identity: {
    type: 'UserAssigned'
    userAssignedIdentities: {
      '${managedIdentity.id}': {}
    }
  }
  properties: {
    managedEnvironmentId: containerAppsEnvironment.id
    configuration: {
      ingress: {
        external: true
        targetPort: 5000
        corsPolicy: {
          allowedOrigins: ['*']
          allowedMethods: ['*']
          allowedHeaders: ['*']
          allowCredentials: true
        }
      }
      registries: [
        {
          server: containerRegistry.properties.loginServer
          identity: managedIdentity.id
        }
      ]
      secrets: []
    }
    template: {
      containers: [
        {
          image: backendImageName != '' ? '${containerRegistry.properties.loginServer}/${backendImageName}' : 'mcr.microsoft.com/azuredocs/containerapps-helloworld:latest'
          name: 'api'
          env: [
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
              value: ''
            }
            {
              name: 'REDIS_PORT'
              value: '6380'
            }
            {
              name: 'REDIS_PASSWORD'
              value: ''
            }
            {
              name: 'CORS_ORIGIN'
              value: '*'
            }
          ]
          resources: {
            cpu: json('1.0')
            memory: '2.0Gi'
          }
        }
      ]
      scale: {
        minReplicas: 1
        maxReplicas: 10
      }
    }
  }
  dependsOn: [
    acrPullRole
  ]
}

// Frontend Next.js Container App
resource frontendContainerApp 'Microsoft.App/containerApps@2023-05-01' = {
  name: '${abbrs.appContainerApps}web-${resourceToken}'
  location: location
  tags: union(tags, { 'azd-service-name': 'web' })
  identity: {
    type: 'UserAssigned'
    userAssignedIdentities: {
      '${managedIdentity.id}': {}
    }
  }
  properties: {
    managedEnvironmentId: containerAppsEnvironment.id
    configuration: {
      ingress: {
        external: true
        targetPort: 3000
        corsPolicy: {
          allowedOrigins: ['*']
          allowedMethods: ['*']
          allowedHeaders: ['*']
          allowCredentials: true
        }
      }
      registries: [
        {
          server: containerRegistry.properties.loginServer
          identity: managedIdentity.id
        }
      ]
    }
    template: {
      containers: [
        {
          image: frontendImageName != '' ? '${containerRegistry.properties.loginServer}/${frontendImageName}' : 'mcr.microsoft.com/azuredocs/containerapps-helloworld:latest'
          name: 'web'
          env: [
            {
              name: 'NODE_ENV'
              value: 'production'
            }
            {
              name: 'NEXT_PUBLIC_API_URL'
              value: 'https://localhost:5000'
            }
          ]
          resources: {
            cpu: json('1.0')
            memory: '2.0Gi'
          }
        }
      ]
      scale: {
        minReplicas: 1
        maxReplicas: 10
      }
    }
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
output BACKEND_URI string = 'https://${backendContainerApp.properties.configuration.ingress.fqdn}'
output FRONTEND_URI string = 'https://${frontendContainerApp.properties.configuration.ingress.fqdn}'
output REDIS_HOST_NAME string = ''
output AZURE_CONTAINER_REGISTRY_ENDPOINT string = containerRegistry.properties.loginServer
output AZURE_CONTAINER_REGISTRY_NAME string = containerRegistry.name
output SERVICE_API_IDENTITY_PRINCIPAL_ID string = managedIdentity.properties.principalId
output SERVICE_API_NAME string = backendContainerApp.name
output SERVICE_API_URI string = 'https://${backendContainerApp.properties.configuration.ingress.fqdn}'
output SERVICE_WEB_IDENTITY_PRINCIPAL_ID string = managedIdentity.properties.principalId
output SERVICE_WEB_NAME string = frontendContainerApp.name
output SERVICE_WEB_URI string = 'https://${frontendContainerApp.properties.configuration.ingress.fqdn}'
