# Google Cloud correlation

Use an existing authorized read-only connector or existing CLI session on a trusted device. Do not sign in on a suspect Mac, print tokens, enumerate secret values, or create credentials. Scope every query to verified projects/organizations/billing accounts; access to one project does not authorize every project visible to the account.

## Inventory and coverage

Selected read-only examples, with placeholders replaced by validated identifiers:

```sh
gcloud auth list --filter=status:ACTIVE --format='value(account)'
gcloud projects describe PROJECT_ID --format=json
gcloud projects get-iam-policy PROJECT_ID --format=json
gcloud services list --enabled --project=PROJECT_ID --format=json
gcloud iam service-accounts list --project=PROJECT_ID --format=json
gcloud iam service-accounts get-iam-policy SA_EMAIL --project=PROJECT_ID --format=json
gcloud iam service-accounts keys list --iam-account=SA_EMAIL --project=PROJECT_ID --format=json
gcloud logging sinks list --project=PROJECT_ID --format=json
```

Inspect service-account resource IAM policies as well as project policies, especially Service Account Token Creator and Workload Identity User grants and external principal bindings. These can permit impersonation without a new service-account key. These reveal current state, not complete historical state. List key metadata only, never private key material or API key strings. Account creation in Google identity systems is distinct from service account creation: identity-provider/Workspace/Cloud Identity logs may be needed, subject to separate authority and availability.

Record effective audit configuration, including inherited organization/folder settings and exempted principals; retention, exclusions, sink destinations and log-view access. Project IAM policy alone does not reveal all effective controls. Query organization/folder logs only when authorized. A private-log permission denial, absent Data Access configuration, expired retention or wrong resource scope must not become a finding of no abuse.

[Cloud Audit Logs](https://docs.cloud.google.com/logging/docs/audit) separates Admin Activity, Data Access, System Event and Policy Denied logs. Admin Activity is always written; most services' Data Access logs must be enabled, with BigQuery an exception. Audit type and supported fields depend on the actual method/service, so consult its current documentation instead of assuming all API calls are recorded. [Configuration and inheritance](https://docs.cloud.google.com/logging/docs/audit/configure-data-access) matter. Enabling logs now cannot reconstruct past requests and is a configuration change with possible cost/privacy consequences.

Also inventory currently billable resources in the approved projects and regions, matched to the unusual SKUs: running Vertex jobs, deployed endpoints, reservations or provisioned capacity, and relevant compute/storage resources. Use service-specific read-only list/describe tools. Existing resources may keep costing money after credentials are revoked or inference traffic stops; identify each exact resource, owner and dependency before proposing approval-gated containment.

## Bounded queries

Start broad enough to detect relevant services, then narrow. This template returns at most 1,000 records; reaching the limit is an explicit completeness warning. Split into smaller windows or use a verified export/pagination mechanism rather than silently treating the result as exhaustive. Retain query text, project, execution time, errors and raw JSON in the approved evidence area. Set `EVIDENCE` only to an existing approved access-restricted directory. Raw JSON can contain secrets or private request data: redirect it privately as below, then derive a sanitized summary rather than returning it to chat.

```sh
gcloud logging read \
 'timestamp >= "2026-01-01T00:00:00Z" AND timestamp < "2026-01-02T00:00:00Z" AND protoPayload.@type="type.googleapis.com/google.cloud.audit.AuditLog"' \
 --project=PROJECT_ID --order=asc --limit=1000 --format=json \
 > "$EVIDENCE/audit.json" 2> "$EVIDENCE/audit-errors.txt"
```

Replace these example dates with the actual incident interval. Useful filters to add after validating names against current service documentation:

```text
protoPayload.serviceName=("iam.googleapis.com" OR "iamcredentials.googleapis.com" OR "serviceusage.googleapis.com" OR "cloudresourcemanager.googleapis.com" OR "aiplatform.googleapis.com")
```

Look for CreateServiceAccount, CreateServiceAccountKey, IAM policy changes, EnableService/BatchEnableServices, credential impersonation and unexpected Vertex AI inference/resource activity. Search method-name substrings initially when versions differ; inspect full names and status in actual entries before classifying an event. Do not limit all investigation to Admin Activity: reads, token minting and inference may be Data Access, with method-specific coverage.

Capture event timestamp and receive timestamp, insert ID/log name, service/method/resource, authenticated principal, delegation information, caller IP/user agent, authorization result, request/operation ID, error status, and service-account key resource name when present. Operation-start records do not prove completion; pair long-running-operation outcomes where available. Minimize request payload collection because it may expose private prompts or data.

[Service-account audit examples](https://docs.cloud.google.com/iam/docs/audit-logging/examples-service-accounts) explain key identity fields and impersonation. `serviceAccountKeyName` is not present for every service/request; a service account principal does not identify the human who held its key. Caller IP can represent NAT, proxies or Google infrastructure. Correlation is evidence of association, not attribution.

Verify the exact Vertex AI or Gemini endpoint, region/model and credential type. Google AI Studio/Gemini API and Vertex AI billing/logging are not interchangeable. Use [service-specific audit documentation](https://docs.cloud.google.com/logging/docs/audit/services). Model request/response logging and inference-metadata logging are separate features, not a guarantee that prompts, token counts or every inference are in audit logs. Do not enable sensitive payload logging as an automatic investigative step.

## Billing and chronology

Read existing Billing reports, cost tables/invoices, and any already-configured billing export. Group by project, service, SKU, usage date/time, location and currency. Compare against normal operations and approved deployments. Distinguish gross cost, credits, adjustments, taxes, invoice month, actual charges and estimates. Record export/report generation time and timezone. A query against an existing BigQuery export can incur query charges; use preview/dry-run and the applicable spending authorization before running a paid query.

Billing data is delayed and updated at service-dependent intervals, so charges posted after containment may reflect earlier usage. New exports may not provide the missing historical scope. Do not promise a fixed delay, perfect per-key cost attribution, or a final loss figure from incomplete data. Cross-check API metrics and audit events with usage time, not just invoice posting time. [Billing reporting and support guidance](https://docs.cloud.google.com/billing/docs/how-to/resolve-issues).

An alerts-only budget does not cap spending. Google also documents service-specific spend-cap budgets; verify eligibility, current behavior, latency and scope before proposing one. Neither should be assumed an immediate universal kill switch. [Budgets](https://docs.cloud.google.com/billing/docs/how-to/budgets) and [spend-cap budgets](https://docs.cloud.google.com/billing/docs/how-to/budgets-spend-caps).
