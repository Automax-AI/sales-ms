# Automax Sales CRM

Internal Twenty App for tracking lender prospects, appraisal workflows,
contacts, notes, and sales pipeline stages.

## Local workspace

The development workspace created for this app is available at:

- URL: http://localhost:3001
- Email: `admin@automax.local`
- Password: `AutomaxLocal123!`

These credentials are for local development only.

## App commands

Run commands from this directory with Node 24:

```bash
yarn twenty plan
yarn twenty apply
yarn lint
yarn typecheck
yarn test
```

To rerun the idempotent lender import, generate an API key for the workspace
and pass it without committing it:

```bash
AUTOMAX_SALES_API_URL=http://localhost:3000 \
AUTOMAX_SALES_API_KEY=<local-api-key> \
yarn seed
```

The import updates Companies by lender name, links known People, sets the
primary champion, and upserts the initial sales-context Note.
