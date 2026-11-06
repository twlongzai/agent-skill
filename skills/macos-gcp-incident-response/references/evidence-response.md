# Evidence, containment, and billing support

## Minimal evidence acquisition

Agree on the evidence destination, who can access it and retention before collecting. Prefer a clean investigator-controlled encrypted volume or approved repository, not a sync folder or location watched by the suspected malware. A private directory and permissions help access control but are not encryption. Collection on the suspect host is not a forensic disk image and may be tampered with; state that limitation. Escalate to qualified incident responders for high-impact compromise, legal hold or full disk/memory acquisition.

For each artifact record:

- Case/evidence ID; exact source host and path or cloud resource/query; operator and authority.
- UTC acquisition start/end, original timestamps/timezone and known clock skew.
- Method/tool/version, privilege level, command, exit status and collection side effects.
- Size, ownership, mode, extended attributes and symlink status where relevant.
- SHA-256 for acquired bytes, source hash when feasible, and copy verification results.
- Destination and every custody transfer: who, when, purpose, transfer method and receiving hash.

Do not follow symlinks or recursively acquire unrelated files. Capture file metadata first. When collection of a specific regular file is authorized, copy it without execution into the approved protected destination, preserve metadata as supported, and hash the copy. Hash the source before/after if practical; if hashes differ, retain both observations and explain that the source changed. Do not claim perfect preservation: live copies, timestamps, extended attributes and resource forks need separate consideration. Keep originals separate from working/redacted copies and hash the latter separately. Hashes detect changed bytes; they do not prove origin, collection time or malware identity.

Use UTC timeline entries with evidence references, not a narrative filled by assumptions. At minimum distinguish:

- Observed: a specific persisted job points to a specific file; a cloud log records a successful key creation.
- Interpretation: an unusual combination may indicate unauthorized persistence or cloud access.
- Unknown: initial infection vector, whether credentials left the Mac, human identity behind a principal, or exact cost caused by a particular key.

Names from an article are leads only. Do not assert the article's infection chain, campaign or attribution as fact in this case. A negative scoped inspection cannot certify a device free of malware.

## Proposed response, not automatic execution

Prioritize ongoing harm and access preservation. Explain evidence tradeoffs and dependencies, get required approval, execute only the exact approved target/action, record results and verify before moving on. Do not take every action in this menu:

1. A suspicious credential with demonstrated abuse: propose a narrowly scoped disable/revocation, explain legitimate workloads affected and possible remaining sessions/tokens. Deleting a key may be irreversible; disabling, where supported, is more reversible. Revoking one credential does not prove all access ended.
2. Ongoing host activity: propose approved isolation with a safe access/recovery plan. Network changes can sever remote access and are security-sensitive. Do not reboot by default because volatile evidence is lost.
3. Suspicious persistence: preserve the exact artifact and resolved target before an approved unload/quarantine. Never delete all files matching a generic name. Explain how a job might restart and how to validate persistence removal.
4. Ongoing cloud expense: propose restricting the abusive identity/resource/API with dependency impact. Project-wide billing/API disablement can cause outages or data loss and is not a routine first step. Confirm current Google documentation before acting.
5. Recovery: rotate affected secrets from a trusted device under the applicable approval, review account sessions/MFA and unauthorized IAM grants, and consider a trusted rebuild if system integrity is uncertain. Do not export or display replacement secrets or provision persistent access without its required confirmation.

Verification should include fresh persistence/process checks, audit checks for subsequent activity, and delayed billing review with a user-approved schedule when appropriate. Establish a baseline and explicit success criteria; no new observed events during a short window is not proof of eradication.

## Billing-support packet

Draft a factual packet in the assistant's workspace first. A draft is not authorization to submit, email, upload logs or disclose private data. Verify the current authenticated Cloud Billing support route and the user's account role. Do not invent a fraud-support email address. Use the official [Get Cloud Billing support](https://docs.cloud.google.com/support/docs/get-billing-support) and [Resolve Cloud Billing issues](https://docs.cloud.google.com/billing/docs/how-to/resolve-issues) flows. Direct billing-support access normally requires the Billing Account Administrator role; use the official troubleshooter if access is unavailable, and the reseller support route for reseller-managed accounts. The unknown-charge route for people without an account is not automatically the right route for a compromised account holder.

Include only what is necessary:

- Billing account/project identifiers (redact public copies), case contact and case ID if existing.
- First/last suspected unauthorized usage in UTC, affected service/SKUs, currency and disputed estimate versus invoiced amount.
- Concise basis for believing usage was unauthorized, supported by evidence references rather than unsupported attribution.
- Timeline of discovery, reported access and approved containment; unresolved visibility gaps.
- A request for investigation and review of an adjustment for the identified charges, without promising entitlement or a refund.
- Minimal sanitized attachments, their hashes, and an offer to provide additional evidence securely if requested.

Exclude passwords, access tokens, private keys, recovery codes, full payment-card data and unnecessary personal data. Explain exactly which data goes to Google and obtain the required authorization before submitting. Preserve the submitted version, case ID, date and support response. Do not claim the case was filed or adjustment granted without verified confirmation. Track remaining tasks and follow-up dates without inventing commitments or deadlines.
