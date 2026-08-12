# VIMUKTAM — BUSINESS CONTINUITY & RECOVERY PLAN

**Version:** 1.1  
**Prepared:** August 2026  
**Status:** Living document

## 1. THE PRINCIPLE OF CONTINUITY

> The ultimate continuity of the manifestation of Vimuktam is in the behaviours of the real humans that participate in Vimuktam. All the other tools, systems and databases are only the means to achieve this.

Vimuktam is not ultimately contained in a website, repository, database, company account or particular piece of technology. These are instruments through which Vimuktam manifests. This document exists so that a human being can understand, recover and continue Vimuktam even if one or more of its current systems are lost, compromised, inaccessible or discontinued.

The purpose is therefore not simply to preserve files. It is to preserve the ability to reconstruct Vimuktam and continue its work.

## 2. PURPOSE

This BCP records where important Vimuktam material is stored, how the systems relate to one another, what access is required, where actual credentials are kept, how the website can be recovered, what maintenance is required, what backups exist, and what future areas must be incorporated.

It is deliberately modular and may be expanded as Vimuktam develops.

## 3. VIMUKTAM AS A DIGITAL BODY

The website contains and presents literature, histories, philosophical material, galleries, images, articles, embedded/external media, project documentation and other developing Vimuktam content.

The GitHub repository is consequently more than a website source repository. It is becoming Vimuktam's **versioned digital vault**. Appropriate Vimuktam business and project documents may also be kept there so that they benefit from version history, recoverability and independent backup.

This does not make GitHub a password store. Passwords, tokens, recovery codes and other confidential secrets remain outside the repository in the separate Credential Key.

## 4. CURRENT SYSTEM ARCHITECTURE

**Primary workflow:** Human direction → ChatGPT → GitHub → Cloudflare → Live Vimuktam Website

**Backup workflow:** GitHub → Bitbucket

The Bitbucket pipeline is deliberately one-way and cannot modify the primary GitHub repository.

**Bitbucket backup schedule:** Daily at 2:00 AM  
**Pipeline:** `backup-from-github`  
**Backup credential validity:** 11 August 2027

A second independent repository backup is planned using a service separate from Bitbucket.

## 5. PRIMARY DIGITAL VAULT — GITHUB

**Repository:** `pegasusmilan/Vimuktam-Website`

GitHub is the primary website repository and developing digital vault. It contains website source files, Vimuktam content and appropriate business/project documents.

GitHub is protected by two-step verification. Actual passwords and tokens are never recorded in this BCP.

## 6. WEBSITE DEPLOYMENT — CLOUDFLARE

Cloudflare currently provides the public deployment pathway and connects the GitHub source to the public website.

The arrangement is considered temporary until the website is linked to its intended domain: **vimuktam.com**.

Recovery requires access to Cloudflare, DNS/domain configuration and the GitHub deployment connection.

## 7. INDEPENDENT BACKUP — BITBUCKET

Bitbucket maintains an independent copy of the GitHub repository.

**Direction:** GitHub → Bitbucket  
**Frequency:** Daily  
**Time:** 2:00 AM  
**Pipeline:** `backup-from-github`

The backup has been created, tested and verified. Its purpose is to provide a recovery source if GitHub becomes unavailable, compromised or inaccessible.

## 8. SECOND INDEPENDENT BACKUP

A second independent backup is planned. It should retrieve the primary GitHub repository independently and maintain its own copy.

It should be one-way, independently authenticated, independently scheduled and independently recoverable. It should be tested before being considered operational.

## 9. ACCOUNT SECURITY AND RECOVERY

Critical systems currently include Google/Gmail, Yahoo recovery, GitHub, Bitbucket/Atlassian, Cloudflare and Hostinger/domain access.

The principal Google account has multiple verification and recovery methods. The recovery chain includes Google → Yahoo → an independent Gmail account held by Shalini.

GitHub and Bitbucket/Atlassian have two-step verification enabled.

The actual recovery information belongs in the Credential Key, not this BCP.

## 10. CREDENTIAL AND ACCESS INVENTORY

The following access categories are required. **Actual values are not recorded here.**

- Google Account — primary identity, verification and recovery.
- Yahoo Recovery Account — recovery of the principal Google account.
- Shalini Recovery Account — independent recovery pathway.
- GitHub Account — primary repository and digital vault.
- GitHub Personal Access Token — automated Bitbucket backup; current backup credential valid through 11 August 2027.
- Bitbucket / Atlassian Account — backup repository and pipeline administration.
- Bitbucket Backup Token — pipeline authentication.
- Cloudflare Account — deployment and DNS/network recovery.
- Hostinger / Domain Account — domain ownership, renewal and DNS-related recovery; current status considered valid through November 2026.
- Future second backup service — to be added when established.

## 11. CREDENTIAL KEY

The **Credential Key** is maintained separately from this BCP and contains the actual confidential values required to access and recover Vimuktam.

It may contain usernames/account identifiers, passwords, personal access tokens, API tokens, recovery codes, two-step verification information and other authentication material.

### Rule

Actual credentials must never be stored in this BCP, the public website, the GitHub repository, the Bitbucket repository, public documents or ordinary project notes.

The BCP records what is needed. The Credential Key records the actual secret.

## 12. RECOVERY PLANS — PLAIN ENGLISH

The practical recovery question is:

> Something has gone wrong. What do I do now?

### 12.1 IF THE LIVE WEBSITE STOPS WORKING

1. Confirm the website is unavailable from another device or connection.
2. Check GitHub access.
3. Check Cloudflare access.
4. Check domain/DNS configuration.
5. Check the GitHub-to-Cloudflare connection.
6. If the repository is intact, reconnect or redeploy through Cloudflare.
7. Test the public website and important pages.
8. Record any relevant credential change or incident.

### 12.2 IF GITHUB IS INACCESSIBLE

Determine whether the problem is account access, two-step verification, lost device, recovery method, service outage or repository loss.

Use the Credential Key and documented recovery routes. Do not create a new repository prematurely. If GitHub cannot be recovered, use the Bitbucket backup as the recovery source.

### 12.3 IF THE PHONE IS LOST

Secure the lost device where possible. Identify affected two-step verification accounts. Use alternative verification/recovery methods and recovery codes. Recover the principal identity account first, then dependent services. Replace/reconfigure the lost verification device after recovery.

### 12.4 IF GOOGLE ACCOUNT ACCESS IS LOST

Use the documented Google recovery methods, then the Yahoo recovery account if required, and the independent Shalini recovery pathway if required. Once recovered, verify all downstream critical accounts and update the Credential Key if authentication methods changed.

### 12.5 IF BITBUCKET IS INACCESSIBLE

Verify that GitHub remains intact. Recover Bitbucket through Atlassian/Bitbucket recovery. Once restored, verify the latest backup, pipeline and schedule.

### 12.6 IF GITHUB IS LOST AND BITBUCKET MUST BE USED

1. Access Bitbucket.
2. Locate the latest successful backup.
3. Verify the expected website and Vimuktam vault material is present.
4. Create/recover a GitHub repository.
5. Restore the backup into GitHub.
6. Re-establish GitHub security.
7. Reconnect Cloudflare.
8. Verify DNS/domain configuration.
9. Deploy and test the website.
10. Re-establish automated backup.
11. Update this BCP with any changed infrastructure.

### 12.7 IF THE GITHUB REPOSITORY IS DAMAGED

Do not immediately overwrite it. Examine Git history, identify the last known good version, restore appropriately, compare against Bitbucket if necessary, verify the website and record the incident.

### 12.8 IF CLOUDFLARE IS INACCESSIBLE

Verify GitHub and domain/Hostinger access. Recover Cloudflare, verify DNS, reconnect deployment and test the website. If Cloudflare itself becomes unsuitable, GitHub remains the source from which an alternative deployment can be established.

### 12.9 IF THE DOMAIN / HOSTINGER ACCOUNT IS INACCESSIBLE

Recover Hostinger/domain access, verify ownership and renewal status, restore DNS/deployment settings and confirm that `vimuktam.com` resolves correctly.

### 12.10 IF CHATGPT OR THE GITHUB PLUGIN IS UNAVAILABLE

Access GitHub directly. The website and digital vault remain in the repository. Development can continue through direct repository access or another suitable method. Cloudflare deployment and the independent backup remain separate systems.

### 12.11 IF A BACKUP FAILS

Check the latest successful backup, GitHub, the pipeline, credential/token expiry and account notifications. Correct the underlying problem, run a manual backup and verify the result. Record significant incidents.

### 12.12 IF MULTIPLE SYSTEMS FAIL

General order:

1. Identity and account access.
2. Vimuktam source and digital vault.
3. Public website.
4. Domain and deployment.
5. Backup systems.
6. Commercial/customer systems.
7. Supporting services.

### 12.13 IF EVERYTHING DIGITAL APPEARS LOST

Do not assume Vimuktam has been lost. Locate this BCP, the Credential Key, Bitbucket backup, the second independent backup once established, physical BCP copies and recovery accounts. Establish what still exists, recover identity access, then recover the digital vault before beginning major reconstruction.

### 12.14 EXTERNAL MEDIA

Repository backups preserve pages, links, embeds and website code. They do not necessarily preserve externally hosted media itself. Important external material may later require its own archival arrangement.

## 13. INCIDENT REPORT

Any significant failure, security event, credential change, recovery event or other occurrence affecting continuity should be recorded here.

The purpose is to leave a clear trail so that a future custodian can understand what happened, why it happened, what was done and whether anything else needs attention.

### Incident Report Format

**Date:**  
**Description:**  
**Cause:**  
**Solution:**  
**Changed Credentials (not actual values):**

Actual credential values must never be recorded in the Incident Report. The actual new credential belongs in the separate Credential Key.

### Credential Key Procedure

The Credential Key is deliberately separate from the BCP. It contains actual passwords, tokens, recovery codes and other authentication secrets.

1. Populate the Credential Key offline, preferably on a computer that is not being used to upload or publish the document. Print it only when the entries are complete.
2. Record actual values only in the Credential Key. The BCP, Incident Report and repository record only the name/purpose of the credential, never its value.
3. Maintain a sealed master physical copy in a secure, access-controlled location. A second sealed physical copy may be held by Shalini as the independent human recovery point.
4. Do not photograph or scan the completed Key. Do not keep a digital copy unless a future security arrangement specifically provides for one.
5. When a credential changes, update the physical Key and securely destroy the superseded page or copy. Record only the fact that the credential changed in the Incident Report.
6. If the Key is lost, stolen, photographed, scanned, copied or otherwise exposed, treat the affected credentials as compromised and change them as soon as practical.
7. Never send the completed Credential Key to ChatGPT or upload it to any online service.

## 14. WEEKLY MAINTENANCE

- [ ] Confirm the live Vimuktam website is accessible.
- [ ] Confirm the GitHub repository is accessible.
- [ ] Confirm the latest Bitbucket backup has succeeded.
- [ ] Once established, confirm the second independent backup has succeeded.
- [ ] Check for obvious account/security warnings.
- [ ] Record any changes in the Credential Key and any incidents in the Incident Report.

## 15. MONTHLY MAINTENANCE

The monthly check asks: **Is Vimuktam's infrastructure still in order?**

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

This monthly check is intended to catch annual as well as monthly obligations. Important deadlines may also have separate reminders.

### Documentation

- [ ] Update the BCP if infrastructure has changed.
- [ ] Update the Credential Key if credentials have changed.
- [ ] Confirm the BCP copies remain available.
- [ ] Record significant changes to Vimuktam's systems.

## 16. DOCUMENT CUSTODY

Two physical BCP copies exist: one with the principal Vimuktam custodian and one with Shalini.

An electronic copy is also held with Shalini by email.

The purpose of these copies is to ensure that recovery instructions do not disappear along with the systems they describe.

## 17. FUTURE BCP MODULES

The BCP is intentionally expandable.

### A. TagMango
Sales, subscriptions, products, customer management, platform access and recovery.

### B. Payments & Finance
Payment systems, banking, settlements, financial records, access and recovery.

### C. Customer Data
What data exists, where it is stored, who controls it, privacy requirements, backup/export arrangements and recovery.

### D. Intellectual Property
Ownership, authorship, licensing, permissions, commissioned work and third-party material.

### E. Succession / Incapacity / Death
Who may take control, access to the Credential Key, transfer of domains/accounts, intellectual property, continuation of Vimuktam's work and instructions for designated successors.

### F. Physical Assets and Archives
Books, manuscripts, instruments, recordings, artwork, equipment, physical archives and other material assets.

### G. Public and Social Media Presence
YouTube, Instagram and Facebook / Meta, including account ownership, recovery, two-step verification, content archives, administrative access and succession.

## 18. RECOVERY PRIORITY

1. Human and identity access.
2. Vimuktam's source and digital vault.
3. Public website.
4. Domain and deployment.
5. Backup systems.
6. Commercial/customer systems.
7. Other supporting services.
8. Post-recovery review and documentation.

The objective is not necessarily to restore everything simultaneously. It is to restore the continuity of Vimuktam, beginning with the elements necessary for its work to continue.

## 19. CURRENT STATUS — AUGUST 2026

- Website: Operational.
- Primary repository/digital vault: GitHub — Active.
- GitHub security: Two-step verification enabled.
- Website deployment: Cloudflare — Active.
- Independent backup: Bitbucket — Active.
- Bitbucket backup: Tested successfully.
- Bitbucket backup schedule: Daily at 2:00 AM.
- Bitbucket backup credential: Valid through 11 August 2027.
- Second independent backup: Planned.
- Atlassian security: Two-step verification enabled.
- Bitbucket security: Two-step verification enabled.
- Google security: Multiple verification/recovery methods enabled.
- Google recovery chain: Yahoo → Shalini's independent Gmail.
- Domain/Hostinger: Considered current through November 2026.
- Domain renewal reminders: Maintained separately.
- Credential Key: Maintained separately as a physical confidential document.
- Physical BCP copies: Two.
- Shalini electronic BCP copy: Yes.
- TagMango/commercial systems: Future BCP module.
- Payments: Future BCP module.
- Customer data: Future BCP module.
- Intellectual property: Future BCP module.
- Succession/incapacity: Future BCP module.
- YouTube / Instagram / Facebook: Future BCP module.

## 20. BCP REVIEW PRINCIPLE

The BCP must distinguish between what is implemented, what is verified, what is planned, and what remains a material risk.

No resilience measure should be treated as complete until the relevant recovery path has been tested or otherwise verified.
