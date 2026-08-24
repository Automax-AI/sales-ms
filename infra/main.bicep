targetScope = 'subscription'

@description('Azure region for all production resources.')
param location string = 'centralus'

@description('Production resource group name.')
param resourceGroupName string = 'rg-automax-sales-prod'

@description('Immutable image tag already present in ACR.')
param imageTag string = 'bootstrap'

@description('Deploy server, worker, migration job, and storage mount.')
param deployWorkloads bool = false

@description('Deploy server and worker after the migration job succeeds.')
param deployServices bool = false

@description('Object ID of the interactive or OIDC deployment principal.')
param deploymentPrincipalId string

@secure()
@description('PostgreSQL administrator password. Never store in a parameter file.')
param postgresAdminPassword string

@secure()
@description('Twenty encryption key. Never store in a parameter file.')
param encryptionKey string

var applicationName = 'automax-sales'
var environmentName = 'prod'
var resourceSuffix = uniqueString(subscription().id, resourceGroupName)
var tags = {
  application: applicationName
  environment: environmentName
  managedBy: 'bicep'
}

resource resourceGroup 'Microsoft.Resources/resourceGroups@2024-11-01' = {
  name: resourceGroupName
  location: location
  tags: tags
}

module foundation './modules/foundation.bicep' = {
  name: 'automax-sales-foundation'
  scope: resourceGroup
  params: {
    applicationName: applicationName
    deploymentPrincipalId: deploymentPrincipalId
    encryptionKey: encryptionKey
    environmentName: environmentName
    location: location
    postgresAdminPassword: postgresAdminPassword
    resourceSuffix: resourceSuffix
    tags: tags
  }
}

module workloads './modules/workloads.bicep' = if (deployWorkloads) {
  name: 'automax-sales-workloads'
  scope: resourceGroup
  params: {
    applicationInsightsConnectionString: foundation.outputs.applicationInsightsConnectionString
    applicationName: applicationName
    containerAppsEnvironmentName: foundation.outputs.containerAppsEnvironmentName
    containerRegistryLoginServer: foundation.outputs.containerRegistryLoginServer
    containerRegistryName: foundation.outputs.containerRegistryName
    deployServices: deployServices
    environmentDefaultDomain: foundation.outputs.environmentDefaultDomain
    environmentName: environmentName
    fileShareName: foundation.outputs.fileShareName
    imageTag: imageTag
    keyVaultUri: foundation.outputs.keyVaultUri
    location: location
    runtimeIdentityId: foundation.outputs.runtimeIdentityId
    storageAccountName: foundation.outputs.storageAccountName
    tags: tags
  }
}

output containerRegistryName string = foundation.outputs.containerRegistryName
output keyVaultName string = foundation.outputs.keyVaultName
output migrationJobName string = deployWorkloads ? workloads!.outputs.migrationJobName : ''
output resourceGroupName string = resourceGroup.name
output serverName string = deployWorkloads && deployServices ? workloads!.outputs.serverName : ''
output serverUrl string = deployWorkloads && deployServices ? workloads!.outputs.serverUrl : ''
output workerName string = deployWorkloads && deployServices ? workloads!.outputs.workerName : ''
