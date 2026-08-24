#!/usr/bin/env bash

set -euo pipefail
umask 077

subscription_id="${AZURE_SUBSCRIPTION_ID:-3b58128f-200a-4afa-8d67-f3fd52a928d0}"
tenant_id="${AZURE_TENANT_ID:-31282ff5-a4a3-4f6f-aa94-7e42bb978628}"
location="${AZURE_LOCATION:-centralus}"
resource_group="${AZURE_RESOURCE_GROUP:-rg-automax-sales-prod}"
image_tag="${AUTOMAX_IMAGE_TAG:-$(git rev-parse --short=12 HEAD)-$(date -u +%Y%m%d%H%M%S)}"
parameters_file="infra/main.prod.bicepparam"

az account set --subscription "$subscription_id"

account_type="$(az account show --query user.type --output tsv)"

if [[ "$account_type" == "user" ]]; then
  deployment_principal_id="$(az ad signed-in-user show --query id --output tsv)"
else
  deployment_client_id="$(az account show --query user.name --output tsv)"
  deployment_principal_id="$(az ad sp show --id "$deployment_client_id" --query id --output tsv)"
fi

existing_key_vault="$(
  az keyvault list \
    --resource-group "$resource_group" \
    --query '[0].name' \
    --output tsv 2>/dev/null || true
)"

if [[ -z "${AUTOMAX_POSTGRES_ADMIN_PASSWORD:-}" ]]; then
  if [[ -n "$existing_key_vault" ]]; then
    AUTOMAX_POSTGRES_ADMIN_PASSWORD="$(
      az keyvault secret show \
        --vault-name "$existing_key_vault" \
        --name postgres-admin-password \
        --query value \
        --output tsv
    )"
  else
    AUTOMAX_POSTGRES_ADMIN_PASSWORD="$(openssl rand -hex 24)"
  fi
fi

if [[ -z "${AUTOMAX_TWENTY_ENCRYPTION_KEY:-}" ]]; then
  if [[ -n "$existing_key_vault" ]]; then
    AUTOMAX_TWENTY_ENCRYPTION_KEY="$(
      az keyvault secret show \
        --vault-name "$existing_key_vault" \
        --name twenty-encryption-key \
        --query value \
        --output tsv
    )"
  else
    AUTOMAX_TWENTY_ENCRYPTION_KEY="$(openssl rand -hex 32)"
  fi
fi

export AZURE_LOCATION="$location"
export AZURE_SUBSCRIPTION_ID="$subscription_id"
export AZURE_TENANT_ID="$tenant_id"
export AUTOMAX_DEPLOYMENT_PRINCIPAL_ID="$deployment_principal_id"
export AUTOMAX_IMAGE_TAG="$image_tag"
export AUTOMAX_POSTGRES_ADMIN_PASSWORD
export AUTOMAX_TWENTY_ENCRYPTION_KEY

scripts/azure/preflight.sh

az bicep build --file infra/main.bicep --stdout >/dev/null
az bicep lint --file infra/main.bicep

export AUTOMAX_DEPLOY_WORKLOADS=false
export AUTOMAX_DEPLOY_SERVICES=false

az deployment sub what-if \
  --name automax-sales-foundation-preview \
  --location "$location" \
  --template-file infra/main.bicep \
  --parameters "$parameters_file" \
  --no-pretty-print

az deployment sub create \
  --name automax-sales-foundation \
  --location "$location" \
  --template-file infra/main.bicep \
  --parameters "$parameters_file" \
  --query properties.outputs \
  --output json

container_registry_name="$(
  az deployment sub show \
    --name automax-sales-foundation \
    --query properties.outputs.containerRegistryName.value \
    --output tsv
)"
key_vault_name="$(
  az deployment sub show \
    --name automax-sales-foundation \
    --query properties.outputs.keyVaultName.value \
    --output tsv
)"
runtime_principal_id="$(
  az identity list \
    --resource-group "$resource_group" \
    --query '[0].principalId' \
    --output tsv
)"
container_registry_id="$(
  az acr show \
    --resource-group "$resource_group" \
    --name "$container_registry_name" \
    --query id \
    --output tsv
)"
key_vault_id="$(
  az keyvault show \
    --resource-group "$resource_group" \
    --name "$key_vault_name" \
    --query id \
    --output tsv
)"

for attempt in {1..10}; do
  acr_role="$(
    az role assignment list \
      --scope "$container_registry_id" \
      --assignee "$runtime_principal_id" \
      --query "[?roleDefinitionName=='AcrPull'].roleDefinitionName" \
      --output tsv 2>/dev/null || true
  )"
  key_vault_role="$(
    az role assignment list \
      --scope "$key_vault_id" \
      --assignee "$runtime_principal_id" \
      --query "[?roleDefinitionName=='Key Vault Secrets User'].roleDefinitionName" \
      --output tsv 2>/dev/null || true
  )"

  if [[ "$acr_role" == "AcrPull" && "$key_vault_role" == "Key Vault Secrets User" ]]; then
    break
  fi

  if [[ "$attempt" == "10" ]]; then
    echo "Runtime RBAC assignments did not propagate within ten minutes." >&2
    exit 1
  fi

  sleep 60
done

az acr build \
  --registry "$container_registry_name" \
  --image "twenty:$image_tag" \
  --file packages/twenty-docker/twenty/Dockerfile \
  --target twenty \
  .

export AUTOMAX_DEPLOY_WORKLOADS=true
export AUTOMAX_DEPLOY_SERVICES=false

az deployment sub what-if \
  --name automax-sales-migration-preview \
  --location "$location" \
  --template-file infra/main.bicep \
  --parameters "$parameters_file" \
  --no-pretty-print

az deployment sub create \
  --name automax-sales-migration \
  --location "$location" \
  --template-file infra/main.bicep \
  --parameters "$parameters_file" \
  --query properties.outputs \
  --output json

migration_job_name="$(
  az deployment sub show \
    --name automax-sales-migration \
    --query properties.outputs.migrationJobName.value \
    --output tsv
)"

execution_name="$(
  az containerapp job start \
    --resource-group "$resource_group" \
    --name "$migration_job_name" \
    --query name \
    --output tsv
)"

for attempt in {1..120}; do
  execution_status="$(
    az containerapp job execution show \
      --resource-group "$resource_group" \
      --name "$migration_job_name" \
      --job-execution-name "$execution_name" \
      --query properties.status \
      --output tsv
  )"

  if [[ "$execution_status" == "Succeeded" ]]; then
    break
  fi

  if [[ "$execution_status" == "Failed" || "$attempt" == "120" ]]; then
    echo "Migration job finished with status $execution_status." >&2
    exit 1
  fi

  sleep 15
done

export AUTOMAX_DEPLOY_SERVICES=true

az deployment sub what-if \
  --name automax-sales-services-preview \
  --location "$location" \
  --template-file infra/main.bicep \
  --parameters "$parameters_file" \
  --no-pretty-print

az deployment sub create \
  --name automax-sales-production \
  --location "$location" \
  --template-file infra/main.bicep \
  --parameters "$parameters_file" \
  --query properties.outputs \
  --output json

server_url="$(
  az deployment sub show \
    --name automax-sales-production \
    --query properties.outputs.serverUrl.value \
    --output tsv
)"

scripts/azure/smoke-test.sh

if ! az keyvault secret show \
  --vault-name "$key_vault_name" \
  --name twenty-deploy-api-key \
  --query id \
  --output tsv >/dev/null 2>&1; then
  echo "Core Twenty deployment is healthy at $server_url."
  echo "Automax app installation is blocked on the one-time first-workspace signup."
  echo "Create the first admin workspace, create a workspace API key, and store it"
  echo "as Key Vault secret 'twenty-deploy-api-key'; then rerun this script."
  exit 2
fi

twenty_api_key="$(
  az keyvault secret show \
    --vault-name "$key_vault_name" \
    --name twenty-deploy-api-key \
    --query value \
    --output tsv
)"

API_URL="$server_url" API_KEY="$twenty_api_key" node -e "
  const fs = require('fs');
  const os = require('os');
  const path = require('path');
  const directory = path.join(os.homedir(), '.twenty');
  fs.mkdirSync(directory, { recursive: true, mode: 0o700 });
  fs.writeFileSync(
    path.join(directory, 'config.json'),
    JSON.stringify({
      version: 1,
      remotes: {
        production: {
          apiUrl: process.env.API_URL,
          apiKey: process.env.API_KEY,
          accessToken: process.env.API_KEY
        }
      }
    }, null, 2),
    { mode: 0o600 }
  );
"

(
  cd packages/twenty-apps/internal/automax-sales
  yarn install --immutable
  yarn twenty app:publish --private --remote production
  yarn twenty app:install --remote production
  AUTOMAX_SALES_API_URL="$server_url" \
    AUTOMAX_SALES_API_KEY="$twenty_api_key" \
    yarn seed
)

unset twenty_api_key

echo "Automax Sales CRM is deployed and seeded at $server_url."
