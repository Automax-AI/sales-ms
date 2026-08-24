# Azure Deployment Plan

> **Status:** Deployed

Generated: 2026-08-06

This is the source of truth for Azure preparation and deployment. The approved
production infrastructure, Twenty runtime, Automax app, and initial lender data
are deployed.

---

## 1. Project overview

**Goal:** Run the existing Twenty CRM and the private `automax-sales` Twenty
application on Azure, with basic GitHub Actions CI/CD and an auditable Azure CLI
+ Bicep deployment flow.

**Path:** Modernize an existing non-Azure application.

**Approved scope:**

- Azure Container Apps in Central US.
- Production-only deployment to Automax Azure Sponsorship.
- Authenticated Basic ACR with anonymous pull and admin access disabled.
- Azure Files mounted by the Container Apps environment for persistent local
  storage.
- Azure-generated HTTPS hostname for the initial release.

---

## 2. Requirements and assumptions

| Attribute | Planned value |
| --- | --- |
| Classification | Small production internal CRM |
| Scale | Small, fewer than 1,000 users |
| Budget | Balanced, single region |
| Availability | One server replica and one continuously running worker initially |
| Data residency | United States |
| Compliance | No additional regulated-data requirements supplied |
| Subscription | Automax Azure Sponsorship (`3b58128f-200a-4afa-8d67-f3fd52a928d0`) |
| Tenant | `31282ff5-a4a3-4f6f-aa94-7e42bb978628` |
| Location | Central US (`centralus`) |
| Domain | Azure-generated Container Apps HTTPS hostname |

### Azure checks completed

- Azure CLI is authenticated to the detected subscription and tenant, and the
  subscription state is `Enabled`.
- Effective policy includes an enforced management-group policy that blocks
  **West Europe**. Central US is not excluded by the policies returned.
- `Microsoft.App`, `Microsoft.ContainerRegistry`, and `Microsoft.Cache` are
  registered.
- `Microsoft.DBforPostgreSQL` was registered successfully.
- Central US appears in the advertised locations for Container Apps,
  PostgreSQL Flexible Server, Azure Managed Redis, and ACR.
- The Azure CLI `quota` extension is not installed. It was not installed during
  this read-only planning phase.

### Policy constraints

- Do not select West Europe.
- Use managed identities and least-privilege RBAC wherever the application and
  Azure service support them.
- Keep credentials out of source and workflow YAML.
- Use Key Vault-backed Container Apps secrets for unavoidable database, Redis,
  and application credentials.
- Use a private ACR with anonymous pull and the admin account disabled.
- Validate Bicep with `build`, `lint`, and `what-if` before deployment.

---

## 3. Components detected

| Component | Type | Technology | Path |
| --- | --- | --- | --- |
| Twenty server + frontend | HTTP web/API | React static frontend served by NestJS/Node 24 | `packages/twenty-docker/twenty/Dockerfile`, target `twenty` |
| Twenty worker | Long-running background worker | Node 24/BullMQ; same image with `yarn worker:prod` | `packages/twenty-server` |
| Database | Required persistence | PostgreSQL 16 in the production compose topology | `packages/twenty-docker/docker-compose.yml` |
| Cache/queue | Required persistence/queue coordination | Redis with `noeviction` | `packages/twenty-docker/docker-compose.yml` |
| File storage | Required shared persistence | `LOCAL` filesystem or S3 only; Azure Blob is not implemented | `packages/twenty-server/src/engine/core-modules/file-storage` |
| Automax Sales app | Private Twenty application | Twenty SDK application, deployed into a running workspace | `packages/twenty-apps/internal/automax-sales` |
| Seed process | Idempotent one-time/manual data load | TypeScript + Twenty GraphQL client | `packages/twenty-apps/internal/automax-sales/src/scripts/seed.ts` |

### Runtime facts that drive the architecture

- The server and worker are distinct long-running processes.
- Only the server exposes HTTP and `/healthz`; the worker has no HTTP listener.
- The worker disables database migrations and cron registration because the
  server currently owns those startup duties.
- Both compose services mount the same local-storage volume.
- The server image entrypoint performs database initialization/upgrades and cron
  registration unless disabled.
- The Automax app is not compiled into the Twenty runtime image. It must be
  published privately and installed/upgraded against the deployed workspace.
- App publication/installation requires a workspace API key after initial
  workspace bootstrap.

---

## 4. Hosting decision

**Selected stack:** Azure Container Apps.

**App Service conclusion:** App Service is not technically impossible, but a
Web App for Containers is not a good direct fit for this repository:

- The topology needs independently managed server and worker processes.
- App Service sidecars scale and restart with the main web container rather than
  independently.
- The worker has no HTTP health endpoint.
- App Service Linux WebJobs are not supported for Alpine-based custom
  containers, while the Twenty image is Alpine-based.
- App Service Docker Compose is being retired on 2027-03-31.
- App Service sidecar migration guidance does not support the shared persistent
  volume pattern used by this deployment.

A redesigned App Service solution could package the worker differently or use
separate plans/apps, but that adds adaptation without a benefit over Container
Apps. Container Apps is therefore the required target for this deployment plan,
unless the user explicitly accepts an App Service-specific redesign.

### Proposed Azure service mapping

| Component | Azure service | Initial sizing |
| --- | --- | --- |
| Twenty server/frontend | Container App, external ingress | Consumption, 0.5 vCPU/1 GiB, min 1, max 3 |
| Twenty worker | Separate Container App, no ingress | Consumption, 0.5 vCPU/1 GiB, min 1, max 1 initially |
| Database migration | Container Apps Job using the same image | Manual/event-driven from CD, 1 replica |
| PostgreSQL | Azure Database for PostgreSQL Flexible Server 16 | Burstable `Standard_B2ms`, 32 GiB storage, backups enabled |
| Redis | Azure Managed Redis | Balanced `B0`, one node initially, `noeviction` |
| Images | Azure Container Registry | See ACR choice below |
| Secrets | Key Vault Standard | RBAC, soft delete, purge protection |
| File persistence | Azure Files mounted into both apps | Standard LRS for initial non-HA deployment |
| Logs | Log Analytics + workspace-based Application Insights | Consumption/pay-as-you-go |
| Identity | User-assigned managed identity | ACR pull and Key Vault secret reads |
| Network | VNet-integrated Container Apps environment | Private data endpoints and private DNS |

### Database migration behavior

The normal server revision will set `DISABLE_DB_MIGRATIONS=true`. CD will first
run a one-shot migration job from the candidate image and only update server and
worker revisions after the job succeeds. This avoids two overlapping server
revisions attempting startup migrations.

### Approved file-storage approach

Twenty currently supports only local filesystem and S3. Azure Blob Storage
cannot be substituted for the S3 endpoint.

Mount one Azure Files share at
`/app/packages/twenty-server/.local-storage` in both server and worker and keep
`STORAGE_TYPE=LOCAL`.

This avoids a core Twenty code change but has one security exception: Container
Apps Azure Files mounts use a storage account key at the platform mount layer.
The key will be generated/referenced by IaC and never committed, but this is not
end-to-end managed identity.

### Approved ACR approach

Use Basic ACR with anonymous pull and admin access disabled;
access is Entra/OIDC/managed-identity authenticated, but the registry endpoint
remains public.

---

## 5. Recipe selection

**Selected:** Bicep infrastructure under `infra/`, executed with Azure CLI.

**Rationale:**

- The user prefers Azure CLI.
- Bicep keeps infrastructure declarative, reviewable, and idempotent.
- Direct `az deployment group what-if/create` is auditable and avoids an
  imperative resource-creation script becoming the source of truth.
- The existing `../code` repository provides useful OIDC, environment, secret,
  staged-deploy, and rollback patterns, but its App Service zip-deploy topology
  is not reusable for Twenty's server/worker containers.
- No `azd init`, Terraform, deployment command, or infrastructure generation is
  part of this planning phase.

### Planned execution sequence after approval

1. Confirm subscription and region and set the CLI subscription explicitly.
2. Install the local quota extension and run read-only quota/usage checks.
3. Register missing resource providers, including
   `Microsoft.DBforPostgreSQL`.
4. Generate Bicep and workflow files.
5. Run Bicep build/lint and `az deployment group what-if`.
6. Run Azure validation; do not deploy until validation passes.
7. Provision infrastructure with `az deployment group create`.
8. Build and push an immutable image, recording its digest.
9. Run the migration job, update server/worker through Bicep, and verify
   `/healthz`.
10. Bootstrap the first Twenty workspace/admin and create a scoped deployment
    API key.
11. Publish/install `automax-sales`, then run the seed only through an explicit
    manual action.

---

## 6. CI/CD design

The workflow design follows the useful patterns in `../code`:

- GitHub OIDC via `azure/login`; no client secret.
- Explicit least-privilege `permissions`.
- GitHub Environments for development/staging/production approval and secrets.
- Build gates before deploy; no partial promotion.
- Immutable artifacts/digests.
- Staged health verification before production traffic.
- Rollback by redeploying the previous image digest/revision, not rebuilding.

All third-party actions must be pinned to full commit SHAs.

### Pull request CI

- Reuse existing `ci-twenty-apps.yaml` for app lint, typecheck, unit tests, and
  install/integration tests.
- Add Bicep build/lint and a Docker build check for deployment-related paths.
- Do not authenticate to Azure for ordinary application-only PR checks.
- Optionally run subscription-scope read-only validation/what-if only on trusted
  branches because forked PRs must not receive Azure identity tokens.

### Development CD

- Trigger on `main` for relevant app/runtime/infra paths.
- Authenticate with GitHub OIDC.
- Build/push the image only when Twenty runtime or Docker inputs changed.
- Deploy the exact image digest to the development Container Apps revision.
- Run migration job and `/healthz` smoke test.
- Publish/install the Automax app when its path changed.

### Production CD

- Manual dispatch or protected production branch/environment.
- Require GitHub Environment approval.
- Reuse the tested image digest; never rebuild for promotion.
- Run `what-if`, migration job, staged revision smoke test, then shift traffic.
- Retain the previous healthy revision for immediate rollback.
- Seed data remains a separate manual workflow input and is never automatic on
  every release.

### Identity and RBAC

- GitHub OIDC deployment identity: resource-group-scoped deployment permission,
  ACR push/task permission, and only the job execution/revision permissions
  needed by CD.
- Container Apps user-assigned identity: `AcrPull` on ACR and
  `Key Vault Secrets User` on the environment vault.
- No Owner, Contributor-at-subscription, registry admin credentials, publish
  profiles, or long-lived service-principal secrets.

---

## 7. Research and verification summary

- Current Bicep resource schemas were reviewed for Container Apps, ACR, Azure
  Files, PostgreSQL Flexible Server, Azure Managed Redis, Key Vault, networking,
  and managed identities.
- Twenty requires a non-clustered Redis endpoint because its current Redis and
  BullMQ clients are configured as single-node clients. Azure Managed Redis B0
  is therefore configured with `NoCluster` and `NoEviction`.
- Azure Files identity-based mounts are not supported by Container Apps. The
  approved mount stores its account key in Key Vault and lets the environment
  identity resolve it.
- Foundation, migration, and service creation are separate deployment phases so
  the database is initialized before the server and worker revisions start.
- Static RBAC review passed: the runtime identity has resource-scoped `AcrPull`
  and `Key Vault Secrets User`; the deployment principal receives only Key Vault
  secret read access in addition to its deployment permissions.
- The Automax app passed lint, typecheck, and all five unit tests after fixing
  Vitest TypeScript path resolution.
- The production Docker image built locally. A local PostgreSQL + Redis +
  production-container smoke test returned HTTP 200 from `/healthz`.

---

## 8. Provisioning limit checklist

### Resource inventory

| Resource type | Number to deploy |
| --- | ---: |
| `Microsoft.App/managedEnvironments` | 1 per environment |
| `Microsoft.App/containerApps` | 2 per environment |
| `Microsoft.App/jobs` | 1 per environment |
| `Microsoft.ContainerRegistry/registries` | 1 |
| `Microsoft.DBforPostgreSQL/flexibleServers` | 1 |
| `Microsoft.Cache/redisEnterprise` | 1 |
| `Microsoft.Cache/redisEnterprise/databases` | 1 |
| `Microsoft.Storage/storageAccounts` | 1 |
| `Microsoft.KeyVault/vaults` | 1 |
| `Microsoft.OperationalInsights/workspaces` | 1 |
| `Microsoft.Insights/components` | 1 |
| `Microsoft.ManagedIdentity/userAssignedIdentities` | 1 |
| `Microsoft.Network/virtualNetworks` | 1 |
| `Microsoft.Network/privateEndpoints` | 1 |
| `Microsoft.Network/privateDnsZones` | 2 |

### Capacity status

| Check | Status | Evidence/next action |
| --- | --- | --- |
| Regional service availability | Passed | Central US advertised by all required providers |
| Container Apps environment quota | Passed | Usage 0; deployment total 1; limit 50 |
| Storage account quota | Passed | Usage 0; deployment total 1; limit 250 |
| PostgreSQL SKU capacity | Passed | Central US capabilities include `Standard_B2ms` |
| Redis SKU capacity | Passed | Central US advertises Azure Managed Redis |
| ACR capacity/network path | Approved | Basic ACR with authenticated access and public endpoint |

All checked resources are within subscription and regional limits.

---

## 9. Estimated cost class

Illustrative Central US retail rates, before sponsorship discounts and excluding
traffic, tax, and unusual log volume:

| Resource | Indicative monthly cost |
| --- | ---: |
| Container Apps server + worker | About $45-$75 depending on active/idle time |
| PostgreSQL Flexible Server `Standard_B2ms` compute | About $112, plus storage/backups |
| Azure Managed Redis Balanced B0 | About $13 |
| ACR Basic | About $5 |
| ACR Premium private endpoint option | About $50, replacing Basic |
| Azure Files, Key Vault, private endpoints, DNS, and monitoring | Roughly $15-$50, usage-dependent |

**Expected single-environment class:** approximately **$190-$290/month**.
Development plus production can roughly double managed-data costs unless the
environments share services, which is not recommended for isolation.

Rates discovered during planning include:

- PostgreSQL B2ms: `$0.15368/hour`.
- Azure Managed Redis B0: `$0.018/hour`.
- ACR Basic: `$0.1666/day`; Premium: `$1.6666/day`.
- Container Apps active usage: `$0.000024/vCPU-second` and
  `$0.000003/GiB-second`, with lower idle CPU pricing.

Final pricing must be recalculated for the user-confirmed region and subscription
offer before deployment.

---

## 10. Generated files

| File | Purpose |
| --- | --- |
| `infra/main.bicep` | Subscription deployment and phased orchestration |
| `infra/main.prod.bicepparam` | Production parameters sourced from environment variables |
| `infra/bicepconfig.json` | Strict Bicep lint configuration |
| `infra/modules/foundation.bicep` | Network, data, identity, secrets, ACR, storage, and monitoring |
| `infra/modules/workloads.bicep` | Azure Files mount, migration job, server, and worker |
| `scripts/azure/preflight.sh` | Read-only account/provider/policy/quota checks |
| `scripts/azure/deploy.sh` | What-if, phased deployment, migration, app install, and seed |
| `scripts/azure/smoke-test.sh` | Health, revision, and app-install verification |
| `.github/workflows/azure-ci.yml` | App, Bicep, shell, and image CI |
| `.github/workflows/azure-deploy-production.yml` | Approved promotion and rollback |

`azure.yaml` is intentionally omitted because Azure CLI + Bicep is the selected
recipe.

---

## 11. Validation and deployment gates

### Planning

- [x] Analyze workspace in MODERNIZE mode
- [x] Scan Docker, runtime, persistence, app deployment, and workflows
- [x] Inspect deployment patterns under `../code`
- [x] Select Container Apps and Azure CLI + Bicep
- [x] Query effective Azure Policy
- [x] Confirm the detected CLI subscription/tenant
- [x] User confirms subscription and Central US region
- [x] User confirms scale/classification/data residency
- [x] User chooses Azure Files storage
- [x] User chooses authenticated Basic ACR
- [x] Fetch actual quota usage/limits with Azure CLI
- [x] User approves this plan

### Preparation after approval

- [x] Generate the listed Bicep, scripts, and workflows
- [x] Apply managed identity and least-privilege RBAC
- [x] Keep secrets out of source and deployment outputs
- [x] Test the production Docker image locally
- [x] Set plan status to `Ready for Validation`

### Validation

- [x] Invoke Azure validation workflow
- [x] Run `az bicep build` and lint checks
- [x] Run `az deployment sub validate`
- [x] Run `az deployment sub what-if`
- [x] Verify provider registration, policy compliance, DNS, and network design
- [x] Record validation proof below
- [x] Set plan status to `Validated`

### Deployment

- [x] Invoke the deployment workflow only after validation
- [x] Provision foundation, run migration, and deploy server/worker
- [x] Test `/healthz`, root UI response, worker status, and migration
- [x] Create the first production workspace/admin
- [x] Publish and install `automax-sales`
- [x] Run the lender seed and verify metadata/data
- [x] Report final deployed endpoint and CI/CD status
- [x] Set plan status to `Deployed`

---

## 12. Validation proof

This section must be populated by the Azure validation phase before status can
be changed to `Validated`.

| Check | Command | Result | Timestamp |
| --- | --- | --- | --- |
| Bicep compilation | `az bicep build --file infra/main.bicep --stdout` | Pass | 2026-08-06T19:41Z |
| Bicep lint | `az bicep lint --file infra/main.bicep` | Pass, no warnings | 2026-08-06T19:41Z |
| App quality | `yarn lint && yarn typecheck && yarn test` | Pass, 5 tests | 2026-08-06T19:22Z |
| Production image | Local build and PostgreSQL/Redis `/healthz` smoke test | Pass | 2026-08-06T19:40Z |
| Azure preflight | `scripts/azure/preflight.sh` | Pass, quota available | 2026-08-06T19:41Z |
| Template validation | `az deployment sub validate ...` | Succeeded | 2026-08-06T19:42Z |
| What-if | `az deployment sub what-if ...` | Succeeded, create-only | 2026-08-06T19:43Z |
| Static RBAC review | Resource-scoped ACR and Key Vault assignments | Pass | 2026-08-06T19:41Z |
| Recovery validation | Preflight, Bicep build/lint, subscription validation, and what-if | Pass | 2026-08-24T14:08Z |
| PostgreSQL recovery | Allow-list required extensions, clean database initialization, `/healthz`, and `/client-config` | Pass | 2026-08-24T14:29Z |

---

## 13. Current phase

Azure infrastructure, the Twenty runtime, and the Automax Sales CRM app are
healthy. The production workspace contains the verified initial lender dataset.

---

## 14. Deployment evidence

- Resource group: `rg-automax-sales-prod`
- Public URL:
  `https://ca-automax-sales-prod.livelysmoke-49bc70fa.centralus.azurecontainerapps.io`
- Public `/healthz`: HTTP 200
- Public `/client-config`: HTTP 200
- Public `/`: HTTP 200
- Server Container App: `Succeeded` / `Running`
- Worker Container App: `Succeeded` / `Running`
- Latest migration execution: `Succeeded`
- PostgreSQL 16 `Standard_B2ms`: `Ready`, public access disabled
- Azure Managed Redis `Balanced_B0`: `Succeeded`, public access disabled, one
  private endpoint
- Basic ACR: admin disabled, anonymous pull disabled
- GitHub production environment, OIDC credential, environment secrets, and
  resource-scoped RBAC are configured.
- Automax Sales CRM application `0.1.0`: published and installed
- Production seed: 12 lenders, 10 contacts, 9 champions, and 12 notes

Deployment recovery notes:

- Azure PostgreSQL rejected Twenty's required `uuid-ossp` and `unaccent`
  extensions during the original initialization. The extensions are now
  allow-listed through Bicep, the empty database was recreated, and the clean
  initialization completed successfully.
- The first Redis private endpoint deployment used a documented group ID not
  accepted by this subscription's API. The live error required
  `redisEnterprise`; Bicep was corrected and revalidated.
- The first ACR build omitted the Docker target and produced the development
  image. The build now explicitly uses `--target twenty`; the corrected image
  passed migration and runtime verification.
