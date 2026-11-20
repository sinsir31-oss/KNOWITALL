# Security Policy

## Scope

This repository currently contains a non-production KIA profile utility and related documentation. It is not a deployed assistant, credential store, or authorization service.

## Reporting a vulnerability

Do **not** publish secrets, exploit payloads, personal information, or unpatched vulnerability details in a public issue or pull request.

If the repository enables **Private vulnerability reporting**, use GitHub's **Security** tab to submit a private report. Otherwise, request a secure contact method from the repository maintainers without sharing the vulnerability details publicly.

Please include the affected file/version, impact, reproducible steps and suggested mitigation in the private report. No response-time or bounty program is promised.

## Secure operation

- Do not treat KIA profile text as trusted system instructions or authorization.
- Real deployments must implement authentication, tenant isolation, tool-specific authorization, logging and approval controls.
- Do not place production tokens, credentials, customer information or infrastructure settings in this public repository.
