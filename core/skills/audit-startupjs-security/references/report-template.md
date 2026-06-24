# StartupJS Security Audit Report Template

Use this exact structure unless the user asks for another format. Keep every top-level section even when the section is short; only omit empty severity groups under Findings.

## Executive Summary

- Overall posture:
- Production readiness: Ready / Not ready / Ready after listed fixes
- Highest risks:
- Scope audited:
- Scope not audited:
- Assumptions:

## Severity Legend

- `CRITICAL`: immediate production blocker with likely severe compromise.
- `HIGH`: production blocker or urgent pre-launch fix.
- `MEDIUM`: should be fixed before production or tightly tracked with a clear owner.
- `LOW`: hardening, cleanup, tests, or lower-risk defense-in-depth.

## Effective Runtime Matrix

- Active StartupJS features:
- Important server/backend options:
- Auth/session plugins imported:
- Auth/session plugins effectively enabled:
- Auth/session defaults reviewed but not applicable:
- Public collections:
- Private collections:
- Collections with schemas:
- Collections with access rules:
- Forced access rules:
- Server-only collections:
- Server aggregations:
- App server routes:
- Plugin server routes:
- Schema validation behavior in development:
- Schema validation behavior in production:

## Findings

Group findings by severity, highest first. Use stable ids like `SEC-001`.

### CRITICAL

#### SEC-001: Short Title

- Area:
- Evidence:
- Impact:
- Exploit scenario:
- Root cause:
- Mitigation:
- Verification:

Repeat for each issue. Omit empty severity groups only if there are no findings at that level.

## StartupJS-Specific Review

### Configuration And Auth

- Access control feature state:
- Effective access behavior, including forced plugin rules:
- Schema validation state:
- Effective schema validation behavior by environment, if verified:
- Server aggregation state:
- Auth/session plugins imported:
- Auth/session plugins effectively enabled:
- Auth/session defaults reviewed but not applicable:
- Public token/link flows:
- Notes:

### Model Security

- Collections audited:
- Collections with schemas:
- Collections with access rules:
- Missing or weak rules:
- Create/read/update/delete concerns:
- Server-only or sensitive collections:

### Aggregation Security

- Aggregations audited:
- Session checks:
- Tenant/owner/role checks:
- Param validation:
- Lookup/project/leak risks:

### Server API Security

- Endpoints audited:
- Authn/authz checks:
- Upload/download/file risks:
- Webhook/callback risks:
- Input validation:
- Rate limiting:
- Error/log disclosure:

### Plugin Security

- Plugins audited:
- Auto-loaded plugins discovered:
- Plugins effectively enabled:
- Plugins imported but disabled or feature-gated:
- Framework defaults reviewed but inactive:
- Plugin model changes:
- Plugin access defaults:
- Forced plugin rules:
- Plugin routes or server hooks:
- App overrides and option risks:
- `@startupjs/permissions` notes, if installed:

## Generic Security Review

### Secrets And Config

- Env vars:
- Production defaults:
- Secret exposure:
- Cookie/JWT/session settings:

### Data Validation And Injection

- Server-side validation:
- Query/operator injection:
- File/path handling:
- Redirect/URL handling:

### Multi-Tenant And Role Isolation

- Tenant boundaries:
- Ownership checks:
- Admin/staff permissions:
- Cross-user data access:

### Operational Hardening

- Rate limits:
- Logging and monitoring:
- Error handling:
- Dependency risks:
- Backups/admin tooling:

## Positive Controls

List important controls that are already present and appear correctly implemented. Keep this factual and evidence-based.

## Open Questions

List any missing context that affects the final risk assessment.

## Recommended Fix Plan

1. Immediate blockers:
2. High-priority fixes:
3. Medium-priority fixes:
4. Hardening and tests:

## Validation

- Commands run:
- Static checks:
- Tests reviewed or recommended:
- Manual verification still needed:
