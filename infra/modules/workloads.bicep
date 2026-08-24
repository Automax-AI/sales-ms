param applicationInsightsConnectionString string
param applicationName string
param containerAppsEnvironmentName string
param containerRegistryLoginServer string
param containerRegistryName string
param deployServices bool
param environmentDefaultDomain string
param environmentName string
param fileShareName string
param imageTag string
param keyVaultUri string
param location string
param runtimeIdentityId string
param storageAccountName string
param tags object

var namePrefix = '${applicationName}-${environmentName}'
var serverName = 'ca-${namePrefix}'
var workerName = 'ca-${namePrefix}-worker'
var migrationJobName = 'caj-${namePrefix}-migration'
var storageMountName = 'twenty-files'
var imageName = '${containerRegistryLoginServer}/twenty:${imageTag}'
var serverUrl = 'https://${serverName}.${environmentDefaultDomain}'

resource containerAppsEnvironment 'Microsoft.App/managedEnvironments@2025-01-01' existing = {
  name: containerAppsEnvironmentName
}

resource runtimeIdentity 'Microsoft.ManagedIdentity/userAssignedIdentities@2024-11-30' existing = {
  name: last(split(runtimeIdentityId, '/'))
}

resource containerRegistry 'Microsoft.ContainerRegistry/registries@2025-04-01' existing = {
  name: containerRegistryName
}

resource environmentStorage 'Microsoft.App/managedEnvironments/storages@2025-07-01' = {
  parent: containerAppsEnvironment
  name: storageMountName
  properties: {
    azureFile: {
      accessMode: 'ReadWrite'
      accountKeyVaultProperties: {
        identity: runtimeIdentity.id
        keyVaultUrl: '${keyVaultUri}secrets/storage-account-key'
      }
      accountName: storageAccountName
      shareName: fileShareName
    }
  }
}

resource server 'Microsoft.App/containerApps@2025-01-01' = if (deployServices) {
  name: serverName
  location: location
  tags: tags
  identity: {
    type: 'UserAssigned'
    userAssignedIdentities: {
      '${runtimeIdentity.id}': {}
    }
  }
  properties: {
    environmentId: containerAppsEnvironment.id
    configuration: {
      activeRevisionsMode: 'Multiple'
      ingress: {
        allowInsecure: false
        external: true
        targetPort: 3000
        traffic: [
          {
            latestRevision: true
            weight: 100
          }
        ]
        transport: 'auto'
      }
      registries: [
        {
          identity: runtimeIdentity.id
          server: containerRegistry.properties.loginServer
        }
      ]
      secrets: [
        {
          identity: runtimeIdentity.id
          keyVaultUrl: '${keyVaultUri}secrets/postgres-database-url'
          name: 'postgres-database-url'
        }
        {
          identity: runtimeIdentity.id
          keyVaultUrl: '${keyVaultUri}secrets/redis-url'
          name: 'redis-url'
        }
        {
          identity: runtimeIdentity.id
          keyVaultUrl: '${keyVaultUri}secrets/twenty-encryption-key'
          name: 'twenty-encryption-key'
        }
      ]
    }
    template: {
      containers: [
        {
          name: 'server'
          image: imageName
          env: [
            {
              name: 'APPLICATIONINSIGHTS_CONNECTION_STRING'
              value: applicationInsightsConnectionString
            }
            {
              name: 'APPLICATION_LOG_DRIVER'
              value: 'CONSOLE'
            }
            {
              name: 'AUTH_PASSWORD_ENABLED'
              value: 'true'
            }
            {
              name: 'DISABLE_CRON_JOBS_REGISTRATION'
              value: 'false'
            }
            {
              name: 'DISABLE_DB_MIGRATIONS'
              value: 'true'
            }
            {
              name: 'DPA_DEPLOYMENT_REGION'
              value: 'US'
            }
            {
              name: 'ENCRYPTION_KEY'
              secretRef: 'twenty-encryption-key'
            }
            {
              name: 'IS_BILLING_ENABLED'
              value: 'false'
            }
            {
              name: 'IS_EMAIL_VERIFICATION_REQUIRED'
              value: 'false'
            }
            {
              name: 'IS_MULTIWORKSPACE_ENABLED'
              value: 'false'
            }
            {
              name: 'NODE_ENV'
              value: 'production'
            }
            {
              name: 'NODE_PORT'
              value: '3000'
            }
            {
              name: 'PG_DATABASE_URL'
              secretRef: 'postgres-database-url'
            }
            {
              name: 'REDIS_URL'
              secretRef: 'redis-url'
            }
            {
              name: 'SERVER_URL'
              value: serverUrl
            }
            {
              name: 'SIGN_IN_PREFILLED'
              value: 'false'
            }
            {
              name: 'STORAGE_LOCAL_PATH'
              value: '.local-storage'
            }
            {
              name: 'STORAGE_TYPE'
              value: 'LOCAL'
            }
          ]
          probes: [
            {
              type: 'Startup'
              httpGet: {
                path: '/healthz'
                port: 3000
              }
              periodSeconds: 10
              timeoutSeconds: 5
              failureThreshold: 30
            }
            {
              type: 'Liveness'
              httpGet: {
                path: '/healthz'
                port: 3000
              }
              initialDelaySeconds: 10
              periodSeconds: 30
              timeoutSeconds: 5
              failureThreshold: 3
            }
            {
              type: 'Readiness'
              httpGet: {
                path: '/healthz'
                port: 3000
              }
              initialDelaySeconds: 5
              periodSeconds: 10
              timeoutSeconds: 5
              failureThreshold: 3
            }
          ]
          resources: {
            cpu: json('0.5')
            memory: '1Gi'
          }
          volumeMounts: [
            {
              mountPath: '/app/packages/twenty-server/.local-storage'
              volumeName: 'server-data'
            }
          ]
        }
      ]
      scale: {
        minReplicas: 1
        maxReplicas: 3
        rules: [
          {
            name: 'http-scaling'
            http: {
              metadata: {
                concurrentRequests: '100'
              }
            }
          }
        ]
      }
      volumes: [
        {
          name: 'server-data'
          storageName: environmentStorage.name
          storageType: 'AzureFile'
        }
      ]
    }
  }
}

resource worker 'Microsoft.App/containerApps@2025-01-01' = if (deployServices) {
  name: workerName
  location: location
  tags: tags
  identity: {
    type: 'UserAssigned'
    userAssignedIdentities: {
      '${runtimeIdentity.id}': {}
    }
  }
  properties: {
    environmentId: containerAppsEnvironment.id
    configuration: {
      activeRevisionsMode: 'Single'
      registries: [
        {
          identity: runtimeIdentity.id
          server: containerRegistry.properties.loginServer
        }
      ]
      secrets: [
        {
          identity: runtimeIdentity.id
          keyVaultUrl: '${keyVaultUri}secrets/postgres-database-url'
          name: 'postgres-database-url'
        }
        {
          identity: runtimeIdentity.id
          keyVaultUrl: '${keyVaultUri}secrets/redis-url'
          name: 'redis-url'
        }
        {
          identity: runtimeIdentity.id
          keyVaultUrl: '${keyVaultUri}secrets/twenty-encryption-key'
          name: 'twenty-encryption-key'
        }
      ]
    }
    template: {
      containers: [
        {
          name: 'worker'
          image: imageName
          command: [
            'yarn'
          ]
          args: [
            'worker:prod'
          ]
          env: [
            {
              name: 'APPLICATIONINSIGHTS_CONNECTION_STRING'
              value: applicationInsightsConnectionString
            }
            {
              name: 'APPLICATION_LOG_DRIVER'
              value: 'CONSOLE'
            }
            {
              name: 'DISABLE_CRON_JOBS_REGISTRATION'
              value: 'true'
            }
            {
              name: 'DISABLE_DB_MIGRATIONS'
              value: 'true'
            }
            {
              name: 'ENCRYPTION_KEY'
              secretRef: 'twenty-encryption-key'
            }
            {
              name: 'NODE_ENV'
              value: 'production'
            }
            {
              name: 'PG_DATABASE_URL'
              secretRef: 'postgres-database-url'
            }
            {
              name: 'REDIS_URL'
              secretRef: 'redis-url'
            }
            {
              name: 'SERVER_URL'
              value: serverUrl
            }
            {
              name: 'STORAGE_LOCAL_PATH'
              value: '.local-storage'
            }
            {
              name: 'STORAGE_TYPE'
              value: 'LOCAL'
            }
          ]
          resources: {
            cpu: json('0.5')
            memory: '1Gi'
          }
          volumeMounts: [
            {
              mountPath: '/app/packages/twenty-server/.local-storage'
              volumeName: 'server-data'
            }
          ]
        }
      ]
      scale: {
        minReplicas: 1
        maxReplicas: 1
      }
      volumes: [
        {
          name: 'server-data'
          storageName: environmentStorage.name
          storageType: 'AzureFile'
        }
      ]
    }
  }
}

resource migrationJob 'Microsoft.App/jobs@2025-01-01' = {
  name: migrationJobName
  location: location
  tags: tags
  identity: {
    type: 'UserAssigned'
    userAssignedIdentities: {
      '${runtimeIdentity.id}': {}
    }
  }
  properties: {
    environmentId: containerAppsEnvironment.id
    configuration: {
      triggerType: 'Manual'
      replicaTimeout: 1800
      replicaRetryLimit: 1
      manualTriggerConfig: {
        parallelism: 1
        replicaCompletionCount: 1
      }
      registries: [
        {
          identity: runtimeIdentity.id
          server: containerRegistry.properties.loginServer
        }
      ]
      secrets: [
        {
          identity: runtimeIdentity.id
          keyVaultUrl: '${keyVaultUri}secrets/postgres-database-url'
          name: 'postgres-database-url'
        }
        {
          identity: runtimeIdentity.id
          keyVaultUrl: '${keyVaultUri}secrets/redis-url'
          name: 'redis-url'
        }
        {
          identity: runtimeIdentity.id
          keyVaultUrl: '${keyVaultUri}secrets/twenty-encryption-key'
          name: 'twenty-encryption-key'
        }
      ]
    }
    template: {
      containers: [
        {
          name: 'migration'
          image: imageName
          command: [
            '/app/entrypoint.sh'
          ]
          args: [
            '/bin/true'
          ]
          env: [
            {
              name: 'APPLICATION_LOG_DRIVER'
              value: 'CONSOLE'
            }
            {
              name: 'DISABLE_CRON_JOBS_REGISTRATION'
              value: 'true'
            }
            {
              name: 'DISABLE_DB_MIGRATIONS'
              value: 'false'
            }
            {
              name: 'ENCRYPTION_KEY'
              secretRef: 'twenty-encryption-key'
            }
            {
              name: 'NODE_ENV'
              value: 'production'
            }
            {
              name: 'PG_DATABASE_URL'
              secretRef: 'postgres-database-url'
            }
            {
              name: 'REDIS_URL'
              secretRef: 'redis-url'
            }
            {
              name: 'SERVER_URL'
              value: serverUrl
            }
            {
              name: 'STORAGE_TYPE'
              value: 'LOCAL'
            }
          ]
          resources: {
            cpu: json('0.5')
            memory: '1Gi'
          }
        }
      ]
    }
  }
}

output migrationJobName string = migrationJob.name
output serverName string = deployServices ? server!.name : ''
output serverUrl string = deployServices ? 'https://${server!.properties.configuration.ingress.fqdn}' : ''
output workerName string = deployServices ? worker!.name : ''
