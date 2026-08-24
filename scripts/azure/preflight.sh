#!/usr/bin/env bash

set -euo pipefail

subscription_id="${AZURE_SUBSCRIPTION_ID:-3b58128f-200a-4afa-8d67-f3fd52a928d0}"
tenant_id="${AZURE_TENANT_ID:-31282ff5-a4a3-4f6f-aa94-7e42bb978628}"
location="${AZURE_LOCATION:-centralus}"

account_id="$(az account show --query id --output tsv)"
account_tenant_id="$(az account show --query tenantId --output tsv)"

if [[ "$account_id" != "$subscription_id" ]]; then
  echo "Azure CLI is using subscription $account_id; expected $subscription_id." >&2
  exit 1
fi

if [[ "$account_tenant_id" != "$tenant_id" ]]; then
  echo "Azure CLI is using tenant $account_tenant_id; expected $tenant_id." >&2
  exit 1
fi

required_providers=(
  Microsoft.App
  Microsoft.Cache
  Microsoft.ContainerRegistry
  Microsoft.DBforPostgreSQL
  Microsoft.Insights
  Microsoft.KeyVault
  Microsoft.ManagedIdentity
  Microsoft.Network
  Microsoft.OperationalInsights
  Microsoft.Storage
)

for provider in "${required_providers[@]}"; do
  state="$(az provider show --namespace "$provider" --query registrationState --output tsv)"

  if [[ "$state" != "Registered" ]]; then
    echo "Resource provider $provider is $state." >&2
    exit 1
  fi
done

scope="/subscriptions/$subscription_id/providers/Microsoft.App/locations/$location"
environment_limit="$(az quota show \
  --resource-name ManagedEnvironmentCount \
  --scope "$scope" \
  --query properties.limit.value \
  --output tsv)"
environment_usage="$(az quota usage show \
  --resource-name ManagedEnvironmentCount \
  --scope "$scope" \
  --query properties.usages.value \
  --output tsv)"

if ((environment_usage + 1 > environment_limit)); then
  echo "Insufficient Container Apps environment quota in $location." >&2
  exit 1
fi

scope="/subscriptions/$subscription_id/providers/Microsoft.Storage/locations/$location"
storage_limit="$(az quota show \
  --resource-name StorageAccounts \
  --scope "$scope" \
  --query properties.limit.value \
  --output tsv)"
storage_usage="$(az quota usage show \
  --resource-name StorageAccounts \
  --scope "$scope" \
  --query properties.usages.value \
  --output tsv)"

if ((storage_usage + 1 > storage_limit)); then
  echo "Insufficient Storage Account quota in $location." >&2
  exit 1
fi

echo "Azure preflight passed for subscription $subscription_id in $location."
echo "Container Apps environments after deployment: $((environment_usage + 1))/$environment_limit"
echo "Storage accounts after deployment: $((storage_usage + 1))/$storage_limit"
