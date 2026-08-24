using './main.bicep'

param location = 'centralus'
param resourceGroupName = 'rg-automax-sales-prod'
param imageTag = readEnvironmentVariable('AUTOMAX_IMAGE_TAG', 'bootstrap')
param deployWorkloads = bool(readEnvironmentVariable('AUTOMAX_DEPLOY_WORKLOADS', 'false'))
param deployServices = bool(readEnvironmentVariable('AUTOMAX_DEPLOY_SERVICES', 'false'))
param deploymentPrincipalId = readEnvironmentVariable('AUTOMAX_DEPLOYMENT_PRINCIPAL_ID')
param postgresAdminPassword = readEnvironmentVariable('AUTOMAX_POSTGRES_ADMIN_PASSWORD')
param encryptionKey = readEnvironmentVariable('AUTOMAX_TWENTY_ENCRYPTION_KEY')
