targetScope = 'subscription'

@minLength(1)
@maxLength(64)
@description('Name of the environment which is used to generate a short unique hash for resources.')
param environmentName string

@minLength(1)
@description('Primary location for all resources')
param location string

@description('A unique suffix to ensure resource name uniqueness')
param resourceToken string = toLower(uniqueString(subscription().id, environmentName, location))

@description('Flag to deploy Redis cache for high-scale performance')
param deployRedis bool = true

@description('App Service Plan SKU for high performance')
@allowed(['B1', 'B2', 'B3', 'S1', 'S2', 'S3', 'P1v2', 'P2v2', 'P3v2', 'P1v3', 'P2v3', 'P3v3'])
param appServicePlanSku string = 'P2v3'

@description('Redis SKU for caching')
@allowed(['Basic', 'Standard', 'Premium'])
param redisSku string = 'Standard'

@description('Redis capacity (0-6 for C/S family, 1-4 for P family)')
@minValue(0)
@maxValue(6)
param redisCapacity int = 2

@description('Backend container image name')
param backendImageName string = ''

@description('Frontend container image name')
param frontendImageName string = ''

// Define the tags that will be applied to all resources
var tags = {
  'azd-env-name': environmentName
  'project': 'planmorph'
  'environment': environmentName
}

// Create resource group
resource rg 'Microsoft.Resources/resourceGroups@2021-04-01' = {
  name: 'rg-${environmentName}'
  location: location
  tags: tags
}

// Deploy the main infrastructure
module main 'resources.bicep' = {
  name: 'main'
  scope: rg
  params: {
    environmentName: environmentName
    location: location
    resourceToken: resourceToken
    deployRedis: deployRedis
    appServicePlanSku: appServicePlanSku
    redisSku: redisSku
    redisCapacity: redisCapacity
    backendImageName: backendImageName
    frontendImageName: frontendImageName
  }
}

// Outputs
output RESOURCE_GROUP_NAME string = rg.name
output BACKEND_URI string = main.outputs.BACKEND_URI
output FRONTEND_URI string = main.outputs.FRONTEND_URI
output REDIS_HOST_NAME string = deployRedis ? main.outputs.REDIS_HOST_NAME : ''
output AZURE_CONTAINER_REGISTRY_ENDPOINT string = main.outputs.AZURE_CONTAINER_REGISTRY_ENDPOINT
