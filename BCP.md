# VIMUKTAM — BUSINESS CONTINUITY & RECOVERY PLAN

**Version:** 1.2  
**Prepared:** August 2026  
**Status:** Living document

## 1. PRINCIPLE OF CONTINUITY

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

**PRIMARY repository:** GitHub

### Backup 1 — Bitbucket

**Direction:** GitHub → Bitbucket  
**Schedule:** Daily at 2:00 AM  
**Pipeline/Workflow:** `backup-from-github`  
**Destination:** Independent Bitbucket copy of the GitHub repository  
**Credential:** GitHub Personal Access Token, stored separately in the Credential Key  
**Credential validity:** 11 August 2027

### Backup 2 / Standby — GitLab

**Direction:** GitHub → GitLab  
**Schedule:** Daily at 18:00 UTC, with additional runs on pushes to `main` and manual workflow dispatch  
**Pipeline/Workflow:** `.github/workflows/main.yml`  
**Destination:** `vimuktam-group/Vimuktam-Website`  
**Credential:** GitLab Project Access Token, stored separately in the Credential Key  
**Credential validity:** 11 August 2027

**Bitbucket is Backup 1. GitLab is Backup 2 / Standby.**

Both backup pipelines/workflows are deliberately one-way and cannot modify the primary GitHub repository. Actual credential values are never recorded in this BCP.

## 5. PRIMARY DIGITAL VAULT — GITHUB

**Repository:** `pegasusmilan/Vimuktam-Website`

GitHub is the primary website repository and developing digital vault. It contains website source files, Vimuktam content and appropriate business/project documents.

GitHub is protected by two-step verification. Actual passwords and tokens are never recorded in this BCP.

## 6. WEBSITE DEPLOYMENT — CLOUDFLARE

Cloudflare currently provides the public deployment pathway and connects the GitHub source to the public website.

The arrangement is considered temporary until the website is linked to its intended domain: **vimuktam.com**.

Recovery requires access to Cloudflare, DNS/domain configuration and the GitHub deployment connection.

## 7. INDEPENDENT BACKUP 1 — BITBUCKET

Bitbucket maintains an independent copy of the GitHub repository.

**Direction:** GitHub → Bitbucket  
**Schedule:** Daily at 2:00 AM  
**Pipeline/Workflow:** `backup-from-github`  
**Destination:** Independent Bitbucket copy of the GitHub repository  
**Credential:** GitHub Personal Access Token, stored separately in the Credential Key  
**Credential validity:** 11 August 2027

The backup has been created, tested and verified. Bitbucket is **Backup 1** and provides an independent recovery source if GitHub becomes unavailable, compromised or inaccessible.

## 8. INDEPENDENT BACKUP 2 / STANDBY — GITLAB

GitLab maintains an independent copy of the GitHub repository as **Backup 2 / Standby**.

**Direction:** GitHub → GitLab  
**Schedule:** Daily at 18:00 UTC, with additional runs on pushes to `main` and manual workflow dispatch.  
**Pipeline/Workflow:** `.github/workflows/main.yml`  
**Destination:** `vimuktam-group/Vimuktam-Website`  
**Credential:** GitLab Project Access Token, stored separately in the Credential Key  
**Credential validity:** 11 August 2027

The GitLab backup is one-way and cannot modify the primary GitHub repository. Its purpose is to provide a second independent recovery source if GitHub becomes unavailable, compromised or inaccessible.

The actual GitLab Project Access Token is never recorded in this BCP.

## 9. ACCOUNT SECURITY AND RECOVERY

Critical systems currently include Google/Gmail, Yahoo recovery, GitHub, Bitbucket/Atlassian, TutaMail, GitLab, Cloudflare and Hostinger/domain access.

TutaMail is the email identity associated with the GitLab Backup 2 / Standby account and therefore forms part of that recovery pathway.

The principal Google account has multiple verification and recovery methods. The recovery chain includes Google → Yahoo → an independent Gmail account held by Shalini.

GitHub and Bitbucket/Atlassian have two-step verification enabled. TutaMail and GitLab access are part of the Backup 2 / Standby recovery pathway.

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
- TutaMail Account — GitLab account identity / email associated with the Backup 2 / Standby repository and GitLab administration.
- GitLab Account / Project — Backup 2 / Standby repository and backup administration; account associated with the TutaMail account.
- GitLab Project Access Token — authentication for the GitHub-to-GitLab backup workflow; valid through 11 August 2027. The actual token is maintained only in the Credential Key.
- Cloudflare Account — deployment and DNS/network recovery.
- Hostinger / Domain Account — domain ownership, renewal and DNS-related recovery; current status considered valid through November 2026.

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

Use the Credential Key and documented recovery routes. Do not create a new repository prematurely. If GitHub cannot be recovered, use Bitbucket **Backup 1** as the recovery source. If Backup 1 is unavailable or unsuitable, use GitLab **Backup 2 / Standby**.

### 12.3 IF THE PHONE IS LOST

Secure the lost device where possible. Identify affected two-step verification accounts. Use alternative verification/recovery methods and recovery codes. Recover the principal identity account first, then dependent services. Replace/reconfigure the lost verification device after recovery.

### 12.4 IF GOOGLE ACCOUNT ACCESS IS LOST

Use the documented Google recovery methods, then the Yahoo recovery account if required, and the independent Shalini recovery pathway if required. Once recovered, verify all downstream critical accounts and update the Credential Key if authentication methods changed.

### 12.5 IF BITBUCKET IS INACCESSIBLE

Verify that GitHub remains intact. Recover Bitbucket through Atlassian/Bitbucket recovery. Once restored, verify the latest backup, pipeline and schedule.

If Bitbucket cannot be restored promptly, verify that GitLab **Backup 2 / Standby** remains available and current.

### 12.6 IF GITHUB IS LOST AND A BACKUP MUST BE USED

1. Access Bitbucket **Backup 1** or GitLab **Backup 2 / Standby**.
2. Locate the latest successful backup.
3. Verify the expected website and Vimuktam vault material is present.
4. Create/recover a GitHub repository.
5. Restore the backup into GitHub.
6. Re-establish GitHub security.
7. Reconnect Cloudflare.
8. Verify DNS/domain configuration.
9. Deploy and test the website.
10. Re-establish automated Backup 1 and Backup 2 arrangements.
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

Identify whether the failure concerns Bitbucket **Backup 1** or GitLab **Backup 2 / Standby**. Check the latest successful backup, GitHub, the relevant pipeline/workflow, credential/token expiry and account notifications. Correct the underlying problem, run a manual backup where appropriate and verify the result. Record significant incidents.

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

Do not assume Vimuktam has been lost. Locate this BCP, the Credential Key, Backup 1 / Bitbucket, Backup 2 / GitLab Standby, physical BCP copies and recovery accounts. Establish what still exists, recover identity access, then recover the digital vault before beginning major reconstruction.

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

**After any significant incident, complete the full Monthly Maintenance checklist as soon as practical, even if the incident appears to concern only one system. The purpose is to ensure the entire Vimuktam system is checked and not merely the faulty section.**

## 14. DOCUMENT CUSTODY

Two physical BCP copies exist: one with the principal Vimuktam custodian and one with Shalini.

An electronic copy is also held with Shalini by email.

The purpose of these copies is to ensure that recovery instructions do not disappear along with the systems they describe.

## 15. FUTURE BCP MODULES

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

## 16. RECOVERY PRIORITY

1. Human and identity access.
2. Vimuktam's source and digital vault.
3. Public website.
4. Domain and deployment.
5. Backup systems.
6. Commercial/customer systems.
7. Other supporting services.
8. Post-recovery review and documentation.

The objective is not necessarily to restore everything simultaneously. It is to restore the continuity of Vimuktam, beginning with the elements necessary for its work to continue.

## 17. CURRENT STATUS — AUGUST 2026

- Website: Operational.
- Primary repository/digital vault: GitHub — Active.
- GitHub security: Two-step verification enabled.
- Website deployment: Cloudflare — Active.
- Backup 1: Bitbucket — Active.
- Bitbucket backup: Tested successfully.
- Bitbucket backup schedule: Daily at 2:00 AM.
- Bitbucket backup credential: Valid through 11 August 2027.
- Backup 2 / Standby: GitLab — Active.
- GitLab backup workflow: `.github/workflows/main.yml`.
- GitLab backup schedule: Daily at 18:00 UTC, with additional runs on pushes to `main` and manual workflow dispatch.
- GitLab backup credential: GitLab Project Access Token; actual token stored separately in the Credential Key; valid through 11 August 2027.
- Atlassian security: Two-step verification enabled.
- Bitbucket security: Two-step verification enabled.
- GitLab project security: Access credential maintained separately in the Credential Key.
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

## 18. WEEKLY MAINTENANCE

**Week beginning / date:** ______________________________________________  
**Executive / person performing check:** _________________________________

**Purpose:** A short operational check that asks whether the machine is alive.

- [ ] Confirm the live Vimuktam website is accessible.
- [ ] Confirm the GitHub repository is accessible.
- [ ] Confirm the latest Bitbucket backup has succeeded.
- [ ] Confirm the GitLab Backup 2 / Standby has succeeded.
- [ ] Check for obvious account/security warnings.
- [ ] Confirm any credential changes have been recorded in the Credential Key.
- [ ] Confirm any incidents have been recorded in the Incident Report.

**Notes / exceptions:** __________________________________________________  
_________________________________________________________________________

**Signature / initials:** ______________________    **Date:** ________________

---

## 19. MONTHLY MAINTENANCE

**Maintenance date (normally the 30th):** _______________________________  
**Executive / person performing check:** _________________________________

**Purpose:** The monthly check asks: Is Vimuktam's infrastructure still in order?

### Website and backups

- [ ] Check GitHub repository.
- [ ] Check Bitbucket backup.
- [ ] Check GitLab Backup 2 / Standby.
- [ ] Confirm recent changes exist in the backups.
- [ ] Check Cloudflare and live deployment.
- [ ] Check domain status.

### Accounts and security

- [ ] Review Google security notifications.
- [ ] Review GitHub security notifications.
- [ ] Review Atlassian/Bitbucket notifications.
- [ ] Review GitLab project/account notifications.
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
- [ ] Confirm the BCP copies remain available.
- [ ] Record significant changes to Vimuktam's systems.

**Notes / exceptions:** __________________________________________________  
_________________________________________________________________________

**Incident requiring full-system check?**  Yes / No

**Signature / initials:** ______________________    **Date:** ________________

If an incident occurred at any point during the month, this full checklist must be completed after the incident as well, regardless of whether the incident appeared isolated.

---

## BCP PORTAL — WEBSITE

Vimuktam will maintain a private BCP portal on the website for authorised custodians/executives. The portal is intended to present the current BCP, Incident Report and Weekly/Monthly Maintenance Logs, together with the date and name of the person who last performed each maintenance check.

**Security requirement:** The portal must be protected by server-side access control (preferably Cloudflare Access) before it is exposed publicly. A password written into static HTML or JavaScript is not considered adequate security and must not be used.

Until Cloudflare Access or equivalent server-side protection is configured, the BCP portal must remain unpublished/unlinked from the public website.

**Operational principle:** The online BCP is a working operational view; the physical BCP and physical Credential Key remain the continuity fallback. Actual credentials never appear in the online BCP portal.