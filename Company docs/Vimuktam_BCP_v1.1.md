# VIMUKTAM — BUSINESS CONTINUITY & RECOVERY PLAN

**Version:** 1.1  
**Prepared:** August 2026  
**Status:** Living document

> The ultimate continuity of the manifestation of Vimuktam is in the behaviours of the real humans that participate in Vimuktam. All the other tools, systems and databases are only the means to achieve this.

## Purpose

This is the Company Docs copy of Vimuktam's Business Continuity & Recovery Plan. It documents the systems, recovery architecture, maintenance arrangements, credential-handling procedure and future BCP modules required to preserve Vimuktam's continuity.

The GitHub repository is both the primary website source and a developing Vimuktam digital vault. Appropriate project and business documents may be kept here. Actual passwords, tokens, recovery codes and other secrets are never stored in the repository.

## Current Architecture

**Primary:** Human direction → ChatGPT → GitHub → Cloudflare → Live Vimuktam Website  
**Backup:** GitHub → Bitbucket  
**Second independent backup:** Planned

**Bitbucket backup:** Daily at 2:00 AM  
**Pipeline:** `backup-from-github`  
**Backup credential validity:** 11 August 2027

## Critical Access

The BCP requires access to Google/Gmail, Yahoo recovery, Shalini's independent recovery account, GitHub, Bitbucket/Atlassian, Cloudflare and Hostinger/domain systems.

Actual credential values are maintained separately in the physical Credential Key.

## Credential Key Rule

The Credential Key contains actual passwords, tokens, recovery codes and other authentication secrets. It must remain separate from this BCP.

- Populate it offline and print it when complete.
- Record actual values only in the Credential Key.
- Keep a sealed master physical copy in a secure, access-controlled location.
- A second sealed physical copy may be held by Shalini as an independent human recovery point.
- Do not photograph or scan the completed Key.
- Do not upload it to GitHub, Bitbucket, Google Drive, email, ChatGPT or another online service.
- When a credential changes, update the physical Key and securely destroy the superseded copy.
- Record only the fact that a credential changed in the Incident Report.
- If the Key is lost, stolen, photographed, scanned, copied or otherwise exposed, treat affected credentials as compromised and change them.

## Recovery Plans

### Website failure

Confirm the failure from another device; check GitHub, Cloudflare and DNS; verify the GitHub-to-Cloudflare connection; redeploy if the repository is intact; test the website; record significant incidents.

### GitHub inaccessible

Determine whether the issue is account access, two-step verification, lost device, recovery method, service failure or repository loss. Use the Credential Key and recovery routes. If GitHub cannot be recovered, use Bitbucket as the recovery source.

### Phone lost

Secure the device where possible; identify affected two-step verification accounts; use alternative recovery methods/recovery codes; recover the identity account first; then recover dependent services; replace the lost verification device.

### Google access lost

Use Google's documented recovery methods, then Yahoo if required, then the independent Shalini recovery pathway if required. Verify downstream critical accounts after recovery.

### Bitbucket inaccessible

Verify GitHub remains intact; recover Bitbucket through Atlassian/Bitbucket recovery; verify the latest backup and pipeline after restoration.

### GitHub lost

Access Bitbucket; locate and verify the latest successful backup; restore to a GitHub repository; re-establish security; reconnect Cloudflare; verify DNS; deploy and test; re-establish automated backup; update the BCP.

### Repository damaged

Do not immediately overwrite it. Examine Git history, identify the last known good version, restore appropriately, compare with Bitbucket if necessary, verify the website and record the incident.

### Cloudflare inaccessible

Verify GitHub and Hostinger/domain access; recover Cloudflare; verify DNS; reconnect deployment; test the website. GitHub remains the source for an alternative deployment if required.

### Domain/Hostinger inaccessible

Recover the account, verify domain ownership and renewal status, restore DNS/deployment settings and confirm `vimuktam.com` resolves correctly.

### ChatGPT/GitHub plugin unavailable

Access GitHub directly. The website and digital vault remain in the repository. Development can continue through direct repository access or another suitable method.

### Backup failure

Check the latest successful backup, GitHub, the pipeline, token/credential expiry and account notifications. Correct the underlying problem, run a manual backup and verify the result.

### Multiple failures

General order: identity → Vimuktam source/digital vault → public website → domain/deployment → backups → commercial/customer systems → supporting services.

### Everything appears lost

Do not assume Vimuktam is lost. Locate this BCP, the physical Credential Key, Bitbucket backup, second independent backup when established, physical BCP copies and recovery accounts. Establish what still exists, recover identity access and then recover the digital vault before major reconstruction.

## Incident Report

Any significant failure, security event, credential change, recovery event or other occurrence affecting continuity should be recorded here.

**Date:**  
**Description:**  
**Cause:**  
**Solution:**  
**Changed Credentials (not actual values):**

Never record actual credential values in the Incident Report. The actual secret belongs in the separate Credential Key.

## Maintenance

### Weekly

- [ ] Confirm live website is accessible.
- [ ] Confirm GitHub is accessible.
- [ ] Confirm latest Bitbucket backup succeeded.
- [ ] Once established, confirm second independent backup succeeded.
- [ ] Check for obvious account/security warnings.
- [ ] Record Credential Key changes and incidents in the Incident Report.

### Monthly — every 30th

- [ ] Check GitHub, Bitbucket and second backup once established.
- [ ] Check Cloudflare and live deployment.
- [ ] Check domain and Hostinger status.
- [ ] Review Google, GitHub, Atlassian/Bitbucket and Cloudflare security notifications.
- [ ] Confirm recovery methods remain usable.
- [ ] Check all subscriptions, renewals and payments.
- [ ] Check token/API credential expiry dates.
- [ ] Update BCP and Credential Key where required.
- [ ] Confirm physical BCP copies remain available.

The monthly check also catches annual obligations. Important renewal dates may additionally have separate reminders.

## Document Custody

Two physical BCP copies exist: one with the principal Vimuktam custodian and one with Shalini. An electronic copy is also held with Shalini by email.

## Future BCP Modules

- TagMango: sales, subscriptions, products, customers and recovery.
- Payments & Finance.
- Customer Data and privacy.
- Intellectual Property.
- Succession / Incapacity / Death.
- Physical Assets and Archives.
- Public and Social Media: **YouTube, Instagram and Facebook / Meta**, including ownership, recovery, two-step verification, content archives, administration and succession.

## Recovery Priority

1. Human and identity access.
2. Vimuktam source and digital vault.
3. Public website.
4. Domain and deployment.
5. Backup systems.
6. Commercial/customer systems.
7. Supporting services.
8. Post-recovery review and documentation.

## Current Status — August 2026

- Website: Operational.
- GitHub digital vault: Active.
- GitHub security: Two-step verification enabled.
- Cloudflare deployment: Active.
- Bitbucket backup: Active and tested.
- Bitbucket backup: Daily at 2:00 AM.
- Backup credential: Valid through 11 August 2027.
- Second independent backup: Planned.
- Google recovery chain: Google → Yahoo → Shalini's independent Gmail.
- Hostinger/domain: Considered current through November 2026.
- Credential Key: Separate physical confidential document.
- Physical BCP copies: Two.
- Shalini electronic BCP copy: Yes.

**Authoritative full BCP:** `BCP.md` in the repository root. This Company Docs copy is maintained for organisational continuity and may be updated alongside it.