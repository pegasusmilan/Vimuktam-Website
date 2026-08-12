# VIMUKTAM — BUSINESS CONTINUITY & RECOVERY PLAN

**Version:** 1.1  
**Prepared:** August 2026  
**Status:** Living document

> The ultimate continuity of the manifestation of Vimuktam is in the behaviours of the real humans that participate in Vimuktam. All the other tools, systems and databases are only the means to achieve this.

This Company Docs copy mirrors the working BCP. It documents the systems, recovery architecture, credential-handling procedure, incident procedure, maintenance arrangements and future BCP modules required to preserve Vimuktam's continuity.

**Actual passwords, tokens, recovery codes and other secrets are never stored in this repository. They remain in the separate physical Credential Key.**

## 2. PURPOSE

This BCP records where important Vimuktam material is stored, how the systems relate to one another, what access is required, where actual credentials are kept, how the website can be recovered, what maintenance is required, what backups exist, and what future areas must be incorporated.

## 3. VIMUKTAM AS A DIGITAL BODY

The GitHub repository is both the primary website source and a developing **versioned digital vault**. Appropriate Vimuktam business and project documents may be kept there so that they benefit from version history, recoverability and independent backup.

It is not a password store.

## 4. CURRENT SYSTEM ARCHITECTURE

**Primary:** Human direction → ChatGPT → GitHub → Cloudflare → Live Vimuktam Website  
**Backup:** GitHub → Bitbucket  
**Second independent backup:** Planned

**Bitbucket backup:** Daily at 2:00 AM  
**Pipeline:** `backup-from-github`  
**Backup credential validity:** 11 August 2027

## 5. PRIMARY DIGITAL VAULT — GITHUB

**Repository:** `pegasusmilan/Vimuktam-Website`

GitHub is the primary website repository and developing digital vault. It contains website source files, Vimuktam content and appropriate business/project documents.

## 6. WEBSITE DEPLOYMENT — CLOUDFLARE

Cloudflare currently provides the public deployment pathway and connects the GitHub source to the public website. The arrangement is considered temporary until the website is linked to **vimuktam.com**.

## 7. INDEPENDENT BACKUP — BITBUCKET

Bitbucket maintains an independent copy of the GitHub repository. It is one-way, runs daily at 2:00 AM and has been tested successfully.

## 8. SECOND INDEPENDENT BACKUP

A second independent repository backup is planned. It should be one-way, independently authenticated, independently scheduled, independently recoverable and tested before being considered operational.

## 9. ACCOUNT SECURITY AND RECOVERY

Critical systems include Google/Gmail, Yahoo recovery, Shalini's independent recovery account, GitHub, Bitbucket/Atlassian, Cloudflare and Hostinger/domain access.

The principal Google recovery chain is Google → Yahoo → an independent Gmail account held by Shalini.

GitHub and Bitbucket/Atlassian have two-step verification enabled.

## 10. CREDENTIAL AND ACCESS INVENTORY

Required access categories are Google, Yahoo recovery, Shalini's recovery account, GitHub, GitHub backup token, Bitbucket/Atlassian, Bitbucket backup token, Cloudflare, Hostinger/domain and the future second backup service.

Actual values are maintained only in the physical Credential Key.

## 11. CREDENTIAL KEY

The Credential Key contains the actual confidential values required to access and recover Vimuktam.

Actual credentials must never be stored in this BCP, the public website, the GitHub repository, the Bitbucket repository, public documents or ordinary project notes.

## 12. RECOVERY PLANS — PLAIN ENGLISH

### 12.1 Website failure

Confirm the failure from another device; check GitHub, Cloudflare and DNS; verify the GitHub-to-Cloudflare connection; redeploy if the repository is intact; test the website; record significant incidents.

### 12.2 GitHub inaccessible

Determine whether the issue is account access, two-step verification, lost device, recovery method, service failure or repository loss. Use the Credential Key and recovery routes. If GitHub cannot be recovered, use Bitbucket as the recovery source.

### 12.3 Phone lost

Secure the device where possible; identify affected two-step verification accounts; use alternative recovery methods/recovery codes; recover the identity account first; then recover dependent services; replace the lost verification device.

### 12.4 Google access lost

Use Google's documented recovery methods, then Yahoo if required, then the independent Shalini recovery pathway if required. Verify downstream critical accounts after recovery.

### 12.5 Bitbucket inaccessible

Verify GitHub remains intact; recover Bitbucket through Atlassian/Bitbucket recovery; verify the latest backup and pipeline after restoration.

### 12.6 GitHub lost

Access Bitbucket; locate and verify the latest successful backup; restore to a GitHub repository; re-establish security; reconnect Cloudflare; verify DNS; deploy and test; re-establish automated backup; update the BCP.

### 12.7 Repository damaged

Do not immediately overwrite it. Examine Git history, identify the last known good version, restore appropriately, compare with Bitbucket if necessary, verify the website and record the incident.

### 12.8 Cloudflare inaccessible

Verify GitHub and Hostinger/domain access; recover Cloudflare; verify DNS; reconnect deployment; test the website. GitHub remains the source for an alternative deployment if required.

### 12.9 Domain/Hostinger inaccessible

Recover the account, verify domain ownership and renewal status, restore DNS/deployment settings and confirm `vimuktam.com` resolves correctly.

### 12.10 ChatGPT/GitHub plugin unavailable

Access GitHub directly. The website and digital vault remain in the repository. Development can continue through direct repository access or another suitable method.

### 12.11 Backup failure

Check the latest successful backup, GitHub, the pipeline, token/credential expiry and account notifications. Correct the underlying problem, run a manual backup and verify the result.

### 12.12 Multiple failures

General order: identity → Vimuktam source/digital vault → public website → domain/deployment → backups → commercial/customer systems → supporting services.

### 12.13 Everything appears lost

Do not assume Vimuktam is lost. Locate this BCP, the physical Credential Key, Bitbucket backup, second independent backup when established, physical BCP copies and recovery accounts. Establish what still exists, recover identity access and then recover the digital vault before major reconstruction.

### 12.14 External media

Repository backups preserve pages, links, embeds and website code. They do not necessarily preserve externally hosted media itself. Important external material may later require its own archival arrangement.

## 13. INCIDENT REPORT

Any significant failure, security event, credential change, recovery event or other occurrence affecting continuity should be recorded here.

### Incident Report Format

**Date:**  
**Description:**  
**Cause:**  
**Solution:**  
**Changed Credentials (not actual values):**

Never record actual credential values in the Incident Report. The actual secret belongs in the separate Credential Key.

### Credential Key Procedure

1. Populate the Credential Key offline and print it when complete.
2. Record actual values only in the Credential Key; record only names/purposes in the BCP and Incident Report.
3. Keep a sealed master physical copy in a secure, access-controlled location; a second sealed copy may be held by Shalini.
4. Do not photograph or scan the completed Key or upload it to any online service.
5. When a credential changes, update the physical Key and securely destroy the superseded copy; record the change in the Incident Report.
6. If the Key is lost, stolen, photographed, scanned, copied or otherwise exposed, treat affected credentials as compromised and change them.
7. Never send the completed Credential Key to ChatGPT or upload it to the repository.

**After any significant incident, complete the full Monthly Maintenance checklist as soon as practical, even if the incident appears to concern only one system. The purpose is to ensure the entire Vimuktam system is checked and not merely the faulty section.**

## 14. DOCUMENT CUSTODY

Two physical BCP copies exist: one with the principal Vimuktam custodian and one with Shalini. An electronic copy is also held with Shalini by email.

## 15. FUTURE BCP MODULES

- TagMango: sales, subscriptions, products, customers and recovery.
- Payments & Finance.
- Customer Data and privacy.
- Intellectual Property.
- Succession / Incapacity / Death.
- Physical Assets and Archives.
- Public and Social Media: **YouTube, Instagram and Facebook / Meta**, including ownership, recovery, two-step verification, content archives, administration and succession.

## 16. RECOVERY PRIORITY

1. Human and identity access.
2. Vimuktam source and digital vault.
3. Public website.
4. Domain and deployment.
5. Backup systems.
6. Commercial/customer systems.
7. Supporting services.
8. Post-recovery review and documentation.

## 17. CURRENT STATUS — AUGUST 2026

- Website: Operational.
- GitHub digital vault: Active.
- GitHub security: Two-step verification enabled.
- Cloudflare deployment: Active.
- Bitbucket backup: Active and tested; daily at 2:00 AM.
- Backup credential: Valid through 11 August 2027.
- Second independent backup: Planned.
- Google recovery chain: Google → Yahoo → Shalini's independent Gmail.
- Hostinger/domain: Considered current through November 2026.
- Credential Key: Separate physical confidential document.
- Physical BCP copies: Two.
- Shalini electronic BCP copy: Yes.

## 18. WEEKLY MAINTENANCE

**Week beginning / date:** ______________________________________________  
**Executive / person performing check:** _________________________________

- [ ] Confirm live Vimuktam website is accessible.
- [ ] Confirm GitHub repository is accessible.
- [ ] Confirm latest Bitbucket backup has succeeded.
- [ ] Once established, confirm second independent backup has succeeded.
- [ ] Check for obvious account/security warnings.
- [ ] Confirm credential changes have been recorded in the Credential Key.
- [ ] Confirm incidents have been recorded in the Incident Report.

**Notes / exceptions:** __________________________________________________  
_________________________________________________________________________

**Signature / initials:** ______________________    **Date:** ________________

---

## 19. MONTHLY MAINTENANCE

**Maintenance date (normally the 30th):** _______________________________  
**Executive / person performing check:** _________________________________

### Website and backups
- [ ] Check GitHub repository.
- [ ] Check Bitbucket backup.
- [ ] Check second independent backup once established.
- [ ] Confirm recent changes exist in backups.
- [ ] Check Cloudflare and live deployment.
- [ ] Check domain status.

### Accounts and security
- [ ] Review Google security notifications.
- [ ] Review GitHub security notifications.
- [ ] Review Atlassian/Bitbucket notifications.
- [ ] Review Cloudflare notifications.
- [ ] Confirm recovery methods remain usable.
- [ ] Confirm Credential Key access.

### Subscriptions, renewals and payments — every 30th
- [ ] Check whether any subscription requires payment.
- [ ] Check whether any service requires renewal.
- [ ] Check domain renewal status.
- [ ] Check Hostinger status.
- [ ] Check token/API credential expiry dates.
- [ ] Check hosting and cloud services.
- [ ] Check software subscriptions.
- [ ] Check any other recurring Vimuktam service or payment.

### Documentation
- [ ] Update the BCP if infrastructure has changed.
- [ ] Update the Credential Key if credentials have changed.
- [ ] Confirm BCP copies remain available.
- [ ] Record significant changes to Vimuktam's systems.

**Notes / exceptions:** __________________________________________________  
_________________________________________________________________________

**Incident requiring full-system check?** Yes / No

**Signature / initials:** ______________________    **Date:** ________________

If an incident occurred at any point during the month, this full checklist must be completed after the incident as well, regardless of whether the incident appeared isolated.

## BCP PORTAL — WEBSITE

Vimuktam will maintain a private BCP portal on the website for authorised custodians/executives. The portal is intended to present the current BCP, Incident Report and Weekly/Monthly Maintenance Logs, together with the date and name of the person who last performed each maintenance check.

**Security requirement:** The portal must be protected by server-side access control (preferably Cloudflare Access) before it is exposed publicly. A password written into static HTML or JavaScript is not considered adequate security and must not be used.

Until Cloudflare Access or equivalent server-side protection is configured, the BCP portal must remain unpublished/unlinked from the public website.

The online BCP is a working operational view; the physical BCP and physical Credential Key remain the continuity fallback. Actual credentials never appear in the online BCP portal.

**Authoritative full BCP:** `BCP.md` in the repository root.