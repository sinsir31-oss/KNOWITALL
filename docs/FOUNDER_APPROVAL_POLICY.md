# KNOWITALL™ public repository — founder approval policy

**Effective immediately as the project's operating policy:** Contributors may propose improvements through issues, forks and pull requests. No contributor, KIA, bot, or assistant may merge into the public default branch, publish a release/package, deploy a website or service, grant privileges, activate automation or spend money on this project's behalf without **explicit founder approval** for that specific action.

Repository owner / CODEOWNER: **@sinsir31-oss**.

## Change lifecycle

1. **Propose:** Open an issue or pull request. Keep the change on an unmerged branch.
2. **Review:** Include a summary, the exact changed files, tests, license and security considerations, and deployment impact.
3. **Founder decision:** Wait for an unambiguous, current approval from the owner. Silence, an AI completion message, passing CI, a contributor's checkbox, and an earlier approval for a different change are **not** approval.
4. **Merge:** Only an appropriately authorized maintainer performs the requested merge; GitHub must enforce the protection rule on `main`.
5. **Deploy/publish:** Requires a **separate** explicit approval, even if the source PR has already been approved.

## Non-negotiable controls

- Do not enable auto-merge, release bots, self-merging KIAs or unattended deploy workflows.
- Outside contributors receive no direct push access to `main`, repository settings, actions secrets, billing, production credentials, or private myAssistant code.
- Protect `main` with GitHub branch protection/ruleset, requiring pull requests, code-owner review and passing checks. Enforce protections on administrators whenever compatible with the owner's operating workflow.
- Changes to `/.github/`, `CODEOWNERS`, workflow definitions, release procedures and this policy are also founder-controlled.
- Run CI with read-only GitHub token permissions and no secrets for untrusted pull requests.
- Never interpret a passing CI check or receipt as a founder authorization.

## Enforcement gap

**CODEOWNERS and this document do not prevent a push or merge by themselves.** The repository owner must enable the settings-based `main` branch protection/ruleset; see [REPOSITORY_LOCKDOWN.md](REPOSITORY_LOCKDOWN.md). Until this is confirmed, the policy is documented but is **not guaranteed by GitHub**.

## GitHub self-review limitation

GitHub does not allow PR authors to approve their own PRs. Founder-authored updates therefore need an appropriately authorized independent reviewer or a narrowly controlled owner bypass, if GitHub supports that configuration. A bypass should never be extended to contributor bots, deploy accounts, or untrusted automation. Using a bypass is an explicit owner action, not evidence that a PR had an independent review.
