#!/usr/bin/env bash

set -euo pipefail

resource_group="${AZURE_RESOURCE_GROUP:-rg-automax-sales-prod}"
server_name="${AZURE_SERVER_NAME:-ca-automax-sales-prod}"
worker_name="${AZURE_WORKER_NAME:-ca-automax-sales-prod-worker}"
migration_job_name="${AZURE_MIGRATION_JOB_NAME:-caj-automax-sales-prod-migration}"

server_fqdn="$(az containerapp show \
  --resource-group "$resource_group" \
  --name "$server_name" \
  --query properties.configuration.ingress.fqdn \
  --output tsv)"
server_url="https://$server_fqdn"

for attempt in {1..30}; do
  status_code="$(curl \
    --silent \
    --show-error \
    --output /dev/null \
    --write-out '%{http_code}' \
    "$server_url/healthz" || true)"

  if [[ "$status_code" == "200" ]]; then
    break
  fi

  if [[ "$attempt" == "30" ]]; then
    echo "Server health check failed with HTTP $status_code." >&2
    exit 1
  fi

  sleep 10
done

for attempt in {1..30}; do
  client_config_status_code="$(curl \
    --silent \
    --show-error \
    --output /dev/null \
    --write-out '%{http_code}' \
    "$server_url/client-config" || true)"

  if [[ "$client_config_status_code" == "200" ]]; then
    break
  fi

  if [[ "$attempt" == "30" ]]; then
    echo "Client config check failed with HTTP $client_config_status_code." >&2
    exit 1
  fi

  sleep 10
done

worker_status="$(az containerapp show \
  --resource-group "$resource_group" \
  --name "$worker_name" \
  --query properties.runningStatus \
  --output tsv)"

if [[ "$worker_status" != "Running" && "$worker_status" != "Ready" ]]; then
  echo "Worker status is $worker_status." >&2
  exit 1
fi

migration_status="$(az containerapp job execution list \
  --resource-group "$resource_group" \
  --name "$migration_job_name" \
  --query 'sort_by([], &properties.startTime)[-1].properties.status' \
  --output tsv)"

if [[ "$migration_status" != "Succeeded" ]]; then
  echo "Latest migration execution status is $migration_status." >&2
  exit 1
fi

echo "Twenty server and client config are healthy at $server_url."
echo "Worker is $worker_status and the latest migration succeeded."
