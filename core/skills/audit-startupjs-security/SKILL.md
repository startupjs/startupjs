---
name: audit-startupjs-security
description: Use when performing a production-readiness security audit of a StartupJS app, including TeamPlay model access control, schemas, aggregations, server/API routes, auth/session flows, file handling, plugins, secrets, configuration, and prioritized mitigation reporting.
---

# Audit StartupJS Security

Use this skill to produce a read-only security audit report for a StartupJS project. Do not make fixes unless the user explicitly asks for remediation after the audit.

## StartupJS Context

- If StartupJS concepts are not already in context from the project `AGENTS.md`, run `npx startupjs skills`, inspect the `startupjs` skill path from that output, and read its `references/AGENTS.md`.
- If the project uses `@startupjs/permissions`, read its README from `node_modules/@startupjs/permissions` and include its permission model in the audit. Do not assume this private package is installed.
- Treat plugins as part of the trusted computing base. Inspect `startupjs.config.js`, plugin options, and package docs/source for plugins that add models, API routes, auth behavior, upload/download endpoints, or access rules.
- Some StartupJS plugins are auto-installed by framework/UI packages and may affect models or APIs even when they are not explicitly listed in `startupjs.config.js`. Inspect generated `teamplay-env.d.ts`, installed plugin packages, and runtime plugin docs/source when app code uses plugin collections or methods such as `$.files`, `FileInput`, `getUrl()`, `getDownloadUrl()`, auth helpers, or permission helpers.
- Generated `teamplay-env.d.ts` imports are a discovery signal, not proof that a runtime plugin feature is active. For plugins with `enabled()` logic or feature gates, inspect the plugin source and `startupjs.config.js` options before claiming a route/model/access rule is active.
- Framework defaults are not findings by themselves. First prove the feature is active in this app; otherwise list the default under inactive/not-applicable context or open questions. For example, only report cookie security flags when cookie sessions are actually in the request/session path; do not report cookie defaults for an app that effectively uses JWT sessions instead.

## Audit Workflow

1. Build the app threat model:
   - identify user types, anonymous flows, admin/owner/member roles, public links/tokens, and sensitive data
   - inspect `startupjs.config.js`, auth features, plugin options, env usage, and package dependencies
   - identify production data that must be private, immutable, tenant-scoped, owner-scoped, or server-only
2. Inventory the security surfaces:
   - `models/` and legacy `model/`: `schema.ts`, `access.ts`, `_aggregation.ts`, model methods, server-only methods
   - `server/`, especially `server/api/`: API endpoints, middleware, uploads/downloads, webhooks, redirects, callbacks
   - app routes that expose tokens, ids, invitation links, admin pages, or file URLs
   - plugins and third-party packages that add models, access rules, routes, auth/session, file storage, or background jobs
3. Build an effective runtime matrix before writing findings:
   - active StartupJS features and important options
   - imported plugins vs effectively enabled plugins
   - active auth/session path and inactive auth/session defaults
   - public collections, private collections, schemas, access rules, forced rules, and server-only collections
   - server aggregations and whether each has its own session/scope checks
   - server routes from app code and plugins
   - whether schema validation is actually active in development and production
4. Audit behavior, not just patterns:
   - do not assume an existing `accessControl()` rule is correct
   - verify the rule matches the collection schema, query patterns, model methods, and real user roles
   - check create/read/update/delete separately; each operation has different security risks
   - when access depends on an id, verify the id comes from the authenticated session or a trusted server-side source
5. Write the report using [references/report-template.md](references/report-template.md).

## Required Report Shape

Read [references/report-template.md](references/report-template.md) before writing the report and keep every top-level section from it:

- Executive Summary
- Severity Legend
- Effective Runtime Matrix
- Findings
- StartupJS-Specific Review
- Generic Security Review
- Positive Controls
- Open Questions
- Recommended Fix Plan
- Validation

Do not collapse the StartupJS-specific or generic review into findings only. If a section has no issues, say what was checked and what residual risk remains. Only omit empty severity groups inside Findings

## Read-Only Discovery Commands

Use these as starting points and adapt to the project:

```bash
npx startupjs skills
npx startupjs check
find models model server app migrations -maxdepth 4 -type f 2>/dev/null | sort
rg -n "accessControl|aggregation\\(|serverAggregate|validateSchema|enableOAuth2|this\\.on\\('api'|expressApp\\.|router\\.|FileInput|getUrl|getDownloadUrl|canRead|canUpload|canDelete|globalThis\\.model|_session|session\\.userId|token" .
rg -n "TeamplayCollections|TeamplayPluginCollections|TeamplayPrivateCollections|TeamplayPluginPrivateCollections|import .*plugin" teamplay-env.d.ts
rg -n "enabled \\(|enabled\\(|cookieSession|jwtSession|offlineSession|oauth2|enableOAuth2|Authorization|access_token|createSession|SESSION_SECRET|force:|openByDefault|forceOnly|serverOnlyCollections|validateSchema.*production|process\\.env\\.NODE_ENV" node_modules/@teamplay node_modules/@startupjs node_modules/startupjs node_modules/startupjs-ui 2>/dev/null
```

- Prefer static inspection first. `npx startupjs check` is optional for an audit; if you run it, note that it can regenerate artifacts such as `teamplay-env.d.ts`, and verify/report whether the worktree changed. Passing type checks is not evidence that the app is secure.
- Use `teamplay-env.d.ts` only as a discovery aid for generated collections/plugin imports; it is not a security boundary.
- For effective backend behavior, inspect the relevant installed package source when config semantics are unclear, especially `@teamplay/backend`, `@teamplay/sharedb-access`, `@teamplay/sharedb-schema`, `@startupjs/server`, auth plugins, and file plugins. Always verify whether schema validation is active in production, not only whether `validateSchema: true` is present; if framework docs/config and runtime source disagree, call out the effective behavior with evidence.
- For auth/session behavior, identify the effective session mechanism before writing findings. StartupJS may install/import cookie, JWT, offline, and OAuth plugins together, but their `enabled()` logic and feature flags decide the active path. Separate “imported”, “enabled”, and “inactive/default not applicable” in the report.
- When file upload/download is present, inspect both the app's plugin options and the file plugin docs/source, usually `node_modules/@startupjs-ui/file-input/files.plugin.js` and its README. In current StartupJS UI, missing `canRead`, `canUpload`, or `canDelete` hooks should be treated as allow-by-default unless source proves otherwise.
- When `@startupjs/permissions` is installed, do not assume `entities` protects those collections. Verify whether it only mixes helper methods into models, whether it adds access rules only for its own collections, and whether app collections still need explicit `access.ts` rules.

## StartupJS-Specific Checklist

- **Config and auth**: check `features.accessControl`, `validateSchema`, `serverAggregate`, OAuth/JWT/session plugins, cookie/token settings, public token flows, and whether security-sensitive plugins force their own rules. Do not turn inactive session defaults into findings; verify the active auth/session path first.
- **Models and schemas**: every public collection should have a schema and explicit access rules before production. Private collections such as `_session` are client-local typing surfaces, not backend validation. Treat schema validation as an effective runtime behavior: confirm whether it runs in production before relying on it.
- **Access control**: with app-wide access control enabled, unspecified collections must be treated as denied by default. With it disabled, forced plugin rules and server-only collections can still matter; identify what remains open. Do not infer the effective behavior from config alone when forced plugin rules are present; inspect backend initialization, `openByDefault`, `forceOnly`, and protected collection handling if needed.
- **Create rules**: verify client-provided owner ids, roles, tenant ids, status fields, and generated fields cannot be forged.
- **Read rules**: verify normal queries only expose documents the current session may read, including list queries and lookup-style screens.
- **Update rules**: verify users cannot change ownership, roles, permissions, stage/status fields, tokens, ids, or cross-tenant references unless explicitly allowed.
- **Delete rules**: verify destructive operations require the right role and scope.
- **Aggregations**: TeamPlay read access does not automatically make an aggregation safe. Every aggregation must validate session, tenant/owner scope, params, and any lookup/unwind/project behavior that can leak data.
- **Server APIs**: every endpoint in `server/` and especially `server/api/` must authenticate and authorize internally unless intentionally public. Pay special attention to file upload/download, OAuth callbacks, webhooks, admin tools, and import/export routes.
- **Files**: verify upload, download/read, delete, storage paths, content type, size limits, filename handling, tokenized URLs, and metadata access. File ids being hard to guess is not authorization.
- **Plugins**: inspect plugin defaults and options, including auto-loaded plugins from framework/UI packages. If a plugin provides model access rules, verify app overrides do not accidentally weaken required protections, and verify whether plugin rules are forced when app-wide access control is disabled.
- **Client trust**: never treat client-side route guards, hidden UI, generated TypeScript types, or `_session` fields as authorization.
- **Generic hardening**: review secrets, env defaults, CORS, redirects, SSR/server logging, error disclosure, rate limits, dependency risk, development-only flags, and production deployment assumptions. Distinguish active risk from unused framework defaults.

## Severity

Use CVSS-style severity labels:

- `CRITICAL`: unauthenticated or cross-tenant data modification/exfiltration, server-side code execution, leaked production secrets, or full account takeover.
- `HIGH`: authorization bypass, sensitive data exposure, unsafe file upload/download, privilege escalation, or missing access control on sensitive collections/endpoints.
- `MEDIUM`: incomplete validation, partial data exposure, weak ownership checks, missing rate limits on security-sensitive endpoints, or defense-in-depth gaps with plausible abuse.
- `LOW`: hardening, observability, minor disclosure, documentation, test coverage, or cleanup issues.

## Reporting Rules

- Lead with findings, not reassurance. If no issue is found in a section, say what was checked and any residual risk.
- Every finding must include severity, evidence with file paths and lines when possible, impact, an exploit scenario, and mitigation steps.
- Distinguish confirmed issues from assumptions and open questions.
- Recommend tests or validation commands that would prove a mitigation works.
- Include the full required report shape. The report can be concise, but it must not skip StartupJS-Specific Review, Generic Security Review, Open Questions, or Validation.
- Be pedantic: the goal is production readiness, not passing a superficial checklist.
