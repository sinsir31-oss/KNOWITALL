# One-time GitHub enforcement checklist for the founder

The public codebase contains `.github/CODEOWNERS`, but **GitHub repository settings must enforce approval**. The connected GitHub integration cannot modify repository rules or branch protection, so these settings must be applied by the repository owner.

Open: **https://github.com/sinsir31-oss/KNOWITALL/settings/rules**

Create a **branch ruleset** for the default branch `main` and enable it (Active). If the ruleset screen is unavailable, use Settings → Branches → Add branch protection rule for `main`.

Recommended enforcement:

1. **Require a pull request before merging.**
2. **Require approving reviews, including review from Code Owners**, with at least one approval (the sole code owner is `@sinsir31-oss`).
3. **Dismiss stale approvals** when new commits are pushed. Consider requiring approval of the most recent reviewable push.
4. **Require status checks** to pass; use the existing `test` GitHub Actions job after GitHub recognizes it.
5. **Block force pushes and branch deletions** on `main`.
6. **Apply to administrators and other actors** where possible; keep bypass access minimal and only under explicit founder control.
7. **Do not enable auto-merge** or any auto-deploy, auto-publish or auto-release workflow.
8. Check Actions → General for appropriate read-only default `GITHUB_TOKEN` permissions, limit installation access to what is required, and keep pull-request workflows away from production secrets.

**Important:** A developer can still make edits in their own fork. Your control is over what enters the official `main` branch, releases, deployments and privileged resources. Only users granted write/admin roles can normally push directly to your repository, but enforce branch rules against those roles.

Because GitHub doesn't permit approving your own pull request, decide on a trusted second reviewer for founder-authored PRs or use a tightly restricted founder-only override for your own changes. Do not give outside contributors an override.

## Verify

- From another contributor account, open a test PR without approving it. GitHub should show a merge block until you approve it.
- Confirm code owner `@sinsir31-oss` is requested automatically.
- Confirm a new commit invalidates stale approval.
- Confirm failure of the `test` job blocks merging.
- Confirm no automatic deployment, release or merge workflows remain enabled.
- Check the repository **Rules** view regularly for active enforcement.

No setting is considered configured merely because it appears in this checklist.
