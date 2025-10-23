# Script to set Redis password in Container Apps after deployment
param(
    [Parameter(Mandatory=$true)]
    [string]$ResourceGroupName,
    
    [Parameter(Mandatory=$true)]
    [string]$ContainerAppName,
    
    [Parameter(Mandatory=$true)]
    [string]$RedisName
)

Write-Host "Setting Redis password for Container App: $ContainerAppName"

# Get Redis primary key
$redisKey = az redis list-keys --name $RedisName --resource-group $ResourceGroupName --query "primaryKey" --output tsv

if (!$redisKey) {
    Write-Error "Failed to get Redis key"
    exit 1
}

# Update Container App with Redis password
Write-Host "Updating Container App environment variable..."
az containerapp update `
    --name $ContainerAppName `
    --resource-group $ResourceGroupName `
    --set-env-vars "REDIS_PASSWORD=$redisKey"

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Redis password set successfully"
} else {
    Write-Error "❌ Failed to set Redis password"
    exit 1
}
