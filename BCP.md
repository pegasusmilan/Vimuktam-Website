# VIMUKTAM — BUSINESS CONTINUITY & RECOVERY PLAN

**Version:** 1.2 or Pilot 
**Prepared:** September 2026  
**Status:** Living document

---

## 1. PRINCIPLE OF CONTINUITY

> The ultimate continuity of the manifestation of Vimuktam is in the behaviour of the real humans that participate in Vimuktam. All the other tools, systems and databases are only the means to achieve this.

Vimuktam is not ultimately contained in a website, repository, database, company account or particular piece of technology. These are instruments through which Vimuktam manifests.

This document exists so that a human being can understand, recover and continue Vimuktam even if one or more of its current systems are lost, compromised, inaccessible or discontinued.

The purpose is therefore not simply to preserve files. It is to preserve the ability to reconstruct Vimuktam and continue its work.

---

## 2. PURPOSE

This Business Continuity and Recovery Plan records:

- where Vimuktam material is stored;
- how the systems relate to one another;
- which systems are primary and which are independent backups;
- what access and credentials are required;
- where actual credentials are kept;
- how the website can be recovered;
- how the repositories can be recovered;
- how the media repository can be recovered;
- how the independent R2 backup can be recovered;
- what routine maintenance is required;
- what to do when a particular service becomes inaccessible, corrupted or unavailable;
- and how Vimuktam can continue operating despite the loss of any single system.

The BCP is a practical recovery document, not merely a description of the technical architecture.

---

## 3. VIMUKTAM AS A DIGITAL BODY

Vimuktam currently consists of several interconnected but independently recoverable systems.

### 3.1 Core systems and backups

1. **GitHub** — primary source repository and source of truth for the website.
2. **Cloudflare** — website execution, deployment and associated infrastructure.
3. **Main R2** — primary multimedia and publications storage.
4. **Bitbucket** — Independent Backup 1.
5. **GitLab** — Independent Backup 2 / Standby.
6. **R2 Backup** — independent backup of the primary multimedia repository.
7. **Domain and related web infrastructure** — including the domain/hosting arrangements required to make Vimuktam publicly accessible.
8. **Account and recovery systems** — email, two-factor authentication and credential records required to regain access to the above systems.
9. **Credential Key** — the human-held record identifying where actual credentials and recovery information are kept.
10. **Physical BCP copies** — physical copies retained so that the recovery plan itself does not depend entirely upon digital availability.

The systems should be understood as a network of dependencies rather than as interchangeable copies of the same thing.

---

## 4. CURRENT SYSTEM ARCHITECTURE

### 4.1 Website and code

The primary website repository is:

**GitHub repository:** `pegasusmilan/Vimuktam-Website`

GitHub is the primary repository and source of truth for website code.

The normal development and deployment chain is:

**VS Code / local editing → GitHub → Cloudflare (connected Git deployment)**

The original development computer is not required for recovery. The repository on GitHub is the important recoverable asset.

### 4.2 Website execution

The live website is operated through Cloudflare.

The Cloudflare Worker contains the website's server-side logic and connects the website to the required storage and administrative systems.

### 4.3 Primary media storage

The primary media repository is the Cloudflare R2 bucket:

**`vimuktam-multimedia`**

This repository is separate from GitHub.

The main website Worker accesses this bucket through the R2 binding:

**`MULTIMEDIA`**

Consequently, loss of the GitHub repository and loss of the media repository are separate failure conditions and must be recoverable independently.

### 4.4 Independent code backups

The GitHub repository is independently mirrored to:

- **Bitbucket — Backup 1**
- **GitLab — Backup 2 / Standby**

The GitHub Actions workflow responsible for the backup/deployment process is:

**`.github/workflows/main.yml`**

The GitLab backup is intended to occur through the repository workflow on pushes to `main`, on the scheduled backup cycle, and through manual workflow dispatch.

### 4.5 Independent media backup

The primary R2 media repository has an independent R2 backup:

**Primary:** `vimuktam-multimedia`  
**Backup:** `vimuktam-media-publications-backup`

The backup bucket exists in a **separate Cloudflare account**.

Because the two R2 buckets belong to different Cloudflare accounts, the primary Worker does not use a direct cross-account R2 binding.

Instead, the primary Worker communicates with the backup Worker through an authenticated HTTP endpoint.

The backup Worker has an R2 binding named:

**`BACKUP`**

The incoming backup endpoint is:

**`/api/incoming-backup`**

Authentication between the systems uses the credential:

**`BACKUP_UPLOAD_TOKEN`**

The backup Worker also has an administrative credential:

**`ADMIN_TOKEN`**

Actual token values are not recorded in this document. They remain in the designated credential storage.

---

## 5. PRIMARY DIGITAL VAULT — MAIN R2

### 5.1 Repository

The primary multimedia and publications repository is:

**Cloudflare R2 bucket:** `vimuktam-multimedia`

It stores material that is not appropriately treated as ordinary Git repository source code, including multimedia and publication-related assets.

### 5.2 Relationship to GitHub

The Main R2 repository is not a substitute for GitHub.

GitHub contains the website's source code and repository-managed files.

Main R2 contains the primary multimedia/publication storage.

Both must therefore be included in continuity planning.

### 5.3 Worker binding

The main website Worker uses:

**R2 binding:** `MULTIMEDIA`

### 5.4 Recovery principle

If GitHub is available but Main R2 is unavailable, the website code can still be recovered, but media-dependent functionality may not operate correctly.

If Main R2 is lost or corrupted, it must be restored from the independent R2 Backup where possible.

---

## 6. CLOUDFLARE

Cloudflare is the principal execution and deployment environment for the public Vimuktam website.

It is responsible for the Worker that serves the website and provides access to the R2 media repository.

The current deployment relationship is:

**GitHub → Cloudflare (connected Git deployment) → Cloudflare Worker**

The website Worker also contains the server-side routes required by the website's administrative and Company Documents functions.

### 6.1 Cloudflare recovery

If the Cloudflare Worker becomes unavailable or corrupted:

1. Confirm that the GitHub repository is intact.
2. Confirm that the required Worker source exists in GitHub.
3. Confirm that the Cloudflare connected Git deployment is functioning.
4. Confirm the Cloudflare account and API credentials are available through the Credential Key.
5. Redeploy the Worker from the GitHub repository.
6. Confirm the required R2 binding `MULTIMEDIA`.
7. Confirm the website.
8. Test administrative login and other critical server-side routes.
9. Test access to Main R2.
10. Record the incident.

The Cloudflare dashboard should not be treated as the sole source of the Worker code. The repository is the primary source.

---

## 7. INDEPENDENT BACKUP 1 — BITBUCKET

Bitbucket is the first independent backup of the GitHub repository.

Its purpose is to provide a separately hosted copy of the Vimuktam website repository in case GitHub becomes unavailable, inaccessible or compromised.

Bitbucket is maintained separately from GitHub and should remain independently accessible.

### 7.1 Recovery principle

If GitHub becomes unavailable:

1. Attempt to access Bitbucket.
2. Verify that the latest expected repository state is present.
3. Identify the most recent known-good version.
4. Use the Bitbucket repository as the source for reconstruction or migration if necessary.
5. Establish a replacement primary repository if GitHub cannot be restored.
6. Reconnect deployment infrastructure as necessary.
7. Record the incident.

Bitbucket is therefore not merely an archival copy. It is an independent recovery path.

---

## 8. INDEPENDENT BACKUP 2 — GITLAB / STANDBY

GitLab provides a second independent backup and standby repository.

The project is:

**`vimuktam-group/Vimuktam-Website`**

The GitHub Actions workflow mirrors the primary repository to GitLab.

The workflow is:

**`.github/workflows/main.yml`**

The intended GitLab backup cycle includes:

- pushes to `main`;
- scheduled execution;
- manual workflow dispatch.

GitLab therefore provides an additional recovery path independent of both GitHub and Bitbucket.

### 8.1 Recovery principle

If GitHub and Bitbucket are unavailable:

1. Access GitLab.
2. Verify the latest successful repository mirror.
3. Identify the latest known-good state.
4. Use GitLab as the recovery source.
5. Establish a new primary repository if necessary.
6. Restore deployment infrastructure.
7. Verify the website.
8. Re-establish independent backups.
9. Record the incident.

---

## 9. INDEPENDENT MEDIA BACKUP — R2 BACKUP

### 9.1 Backup repository

The independent media backup is:

**`vimuktam-media-publications-backup`**

This bucket is deliberately located in a **separate Cloudflare account** from the primary R2 bucket.

This separation is important because a failure or loss affecting the primary Cloudflare account should not automatically destroy the independent media backup.

### 9.2 Backup Worker

The separate backup Cloudflare account contains a Worker responsible for receiving and managing backup material.

The Worker has:

**R2 binding:** `BACKUP`

The primary Worker communicates with it through:

**`/api/incoming-backup`**

The request is authenticated using:

**`BACKUP_UPLOAD_TOKEN`**

Administrative access to the backup Worker uses:

**`ADMIN_TOKEN`**

Actual secret values are kept outside this BCP.

### 9.3 Recovery principle

If Main R2 is lost or corrupted:

1. Confirm the independent backup bucket is accessible.
2. Confirm the backup Worker and `BACKUP` binding are functioning.
3. Determine the latest usable backup state.
4. Restore the required files from the backup repository.
5. Recreate or repair the primary R2 bucket if necessary.
6. Reconnect the main Worker through the `MULTIMEDIA` binding.
7. Test representative media and publication files.
8. Record the recovery.

---

## 10. R2 RETENTION AND STORAGE POLICY

The R2 Backup system is intended to provide a rolling historical safety layer rather than merely a second live copy.

### 10.1 Intended retention

The intended retention policy is:

**90-day rolling retention**

Deleted source files and older backup states should remain recoverable for the defined retention period where the backup system has successfully captured them.

### 10.2 Current implementation status

The 90-day rolling retention mechanism is **planned / under implementation and not yet fully verified end-to-end**.

It must not be represented as fully operational until it has been tested.

### 10.3 Storage threshold

The backup system is designed around an approximate storage threshold of:

**9.90 GB**

The purpose of this threshold is to prevent uncontrolled growth of the backup repository and to provide a clear operational warning point.

### 10.4 Verification requirements

Before the retention system is considered fully operational, the following should be tested:

1. A source object is backed up.
2. A later version or replacement is backed up.
3. The source object is deleted or changed.
4. The backup history retains the expected previous state.
5. A historical object can be identified.
6. A historical object can be restored.
7. Objects older than the retention period are handled according to policy.
8. Storage usage is correctly reported.
9. The threshold behaviour is correctly reported.
10. The last successful backup time is correctly recorded.

Until these tests have been completed successfully, the BCP should continue to describe 90-day retention as planned/not fully verified.

---

## 11. THE SIX ALMIRAHS

Vimuktam's administrative recovery system is organized conceptually into six Almirahs.

### Almirah 1 — Website Repository

**GitHub — `pegasusmilan/Vimuktam-Website`**

Primary source of truth for the website code and repository-managed material.

### Almirah 2 — Company Documents

The Company Documents system contains operational and organizational documents that need controlled access and, where appropriate, editing.

The Company Documents portal is part of the website's administrative infrastructure.

The BCP itself is not intended to have a second competing authoritative version in Company Documents.

### Almirah 3 — Main R2

**Cloudflare R2 — `vimuktam-multimedia`**

Primary multimedia and publications repository.

### Almirah 4 — Backup 1

**Bitbucket**

Independent repository backup.

### Almirah 5 — Backup 2 / Standby

**GitLab — `vimuktam-group/Vimuktam-Website`**

Independent repository backup and standby source.

### Almirah 6 — R2 Backup

**Cloudflare R2 — `vimuktam-media-publications-backup`**

Independent media/publication backup in a separate Cloudflare account.

The six Almirahs together provide the principal continuity structure of Vimuktam.

---

## 12. ACCOUNT SECURITY

All systems must be protected by the strongest security mechanisms reasonably available.

These include, where supported:

- two-factor authentication;
- strong unique passwords;
- recovery email addresses;
- recovery codes;
- separate credentials for separate systems;
- restricted API tokens;
- restricted administrative access;
- periodic credential review.

Known security arrangements include:

- GitHub 2FA;
- Atlassian/Bitbucket 2FA;
- Cloudflare account security;
- GitLab account security;
- separate credentials for GitLab project operations;
- separate credentials for R2 backup operations.

Credentials must never be embedded in this public BCP.

---

## 13. CREDENTIAL INVENTORY

The following credential categories must exist and remain recoverable:

| System | Credential / Access |
|---|---|
| GitHub | Account password, 2FA and recovery mechanisms |
| Cloudflare | Account access, API/deployment credentials |
| Main R2 | Cloudflare account and required Worker access |
| Bitbucket | Account password, 2FA and recovery mechanisms |
| GitLab | Account password, 2FA and project credentials |
| GitLab Backup Workflow | GitHub Actions secret/token required for GitLab mirroring |
| Cloudflare Deployment | Cloudflare account access & connected Git deployment configuration |
| R2 Backup | Backup account access |
| R2 Backup Worker | `ADMIN_TOKEN` |
| Main-to-backup transfer | `BACKUP_UPLOAD_TOKEN` |
| Domain / Hosting | Registrar and hosting access |
| Company Documents | Company Documents administrative credential |
| Website administration | Required administrative credentials |

Actual secret values are **not recorded here**.

---

## 14. CREDENTIAL KEY

The Credential Key is the human-held record that identifies where the actual passwords, tokens, recovery codes and other sensitive access information are stored.

This BCP identifies **what credential is required**, while the Credential Key identifies **where the actual credential can be found**.

The two documents serve different purposes.

The Credential Key must therefore be maintained independently and securely.

A person attempting recovery should not need to guess which credential is required or which account it belongs to.

---

## 15. RECOVERY PLANS

### 15.1 Website unavailable

1. Determine whether the failure is local, Cloudflare-related or repository-related.
2. Check Cloudflare Worker status.
3. Check the GitHub repository.
4. Check the latest deployment.
5. If necessary, redeploy from GitHub.
6. Verify `MULTIMEDIA`.
7. Test the public website.
8. Record the incident.

### 15.2 GitHub inaccessible

1. Do not assume the website is permanently lost.
2. Check Bitbucket Backup 1.
3. Check GitLab Backup 2 / Standby.
4. Identify the latest known-good repository state.
5. Reconstruct a primary repository if necessary.
6. Restore deployment.
7. Re-establish independent backups.

### 15.3 Cloudflare inaccessible

1. Confirm that the GitHub repository remains intact.
2. Confirm Cloudflare account/recovery access.
3. If account recovery is possible, restore access.
4. If necessary, establish replacement Cloudflare infrastructure.
5. Redeploy the Worker.
6. Reconnect Main R2.
7. Verify the website.

### 15.4 Main R2 inaccessible

1. Confirm that the issue is limited to Main R2.
2. Confirm the `MULTIMEDIA` binding.
3. Check the primary bucket.
4. Check the independent R2 Backup.
5. Restore required objects.
6. Repair or recreate the primary bucket if necessary.
7. Test the website's media functionality.

### 15.5 Bitbucket inaccessible

Bitbucket is Backup 1 and should not be treated as the only repository backup.

If Bitbucket is unavailable:

1. Confirm GitHub remains operational.
2. Confirm GitLab remains operational.
3. Continue using GitHub as primary.
4. Restore or replace the Bitbucket backup when possible.
5. Verify that two independent repository recovery paths remain available.

### 15.6 GitHub repository lost or corrupted

1. Do not immediately overwrite or destroy remaining copies.
2. Identify the last known-good state.
3. Check Bitbucket.
4. Check GitLab.
5. Compare repository states.
6. Select the correct known-good version.
7. Establish or restore the GitHub repository.
8. Verify the website.
9. Re-establish the automated backup chain.
10. Record the incident.

### 15.7 Website deployment is broken

Do not immediately assume that the website source itself is lost.

1. Check GitHub.
2. Check `.github/workflows/main.yml`.
3. Check the latest GitHub Actions run.
4. Identify whether the failure is in backup or deployment.
5. Verify the Worker entry point and deployment configuration.
6. Verify Cloudflare credentials.
7. Redeploy from the known-good repository state.
8. Test the live website.

### 15.8 GitHub Actions is broken

1. Check the workflow file.
2. Check the latest failed run.
3. Determine whether the failure concerns GitLab backup or Cloudflare deployment.
4. Repair only the affected workflow component.
5. Run the workflow manually.
6. Confirm both backup and deployment results.
7. Record the incident if continuity was affected.

### 15.9 GitLab inaccessible

1. Confirm GitHub remains operational.
2. Confirm Bitbucket remains operational.
3. Continue operating from GitHub.
4. Restore GitLab access.
5. Re-establish the repository mirror.
6. Verify the next successful backup.

### 15.10 R2 Backup inaccessible

1. Confirm that Main R2 remains available.
2. Do not delete or modify Main R2 unnecessarily.
3. Check the separate backup Cloudflare account.
4. Check the backup Worker.
5. Check the `BACKUP` R2 binding.
6. Check the authenticated incoming-backup endpoint.
7. Check the backup credentials.
8. Restore the backup Worker or bucket if necessary.
9. Re-establish the backup relationship.
10. Confirm a successful new backup.

### 15.11 Both repository backups are unavailable

If GitHub, Bitbucket and GitLab are simultaneously inaccessible:

1. Do not modify remaining Cloudflare infrastructure unnecessarily.
2. Check whether the currently deployed Worker remains operational.
3. Check local/development copies if available.
4. Check physical records and recovery documentation.
5. Recover access to at least one repository service.
6. Reconstruct the repository from the latest known-good material.
7. Re-establish the independent backup structure.

### 15.12 Main R2 and R2 Backup are both unavailable

1. Preserve any currently available local or exported media.
2. Check Cloudflare account access.
3. Check backup Worker state.
4. Check whether historical backup material remains accessible.
5. Recover the latest available media state.
6. Rebuild the primary R2 repository.
7. Re-establish an independent R2 backup.
8. Test representative website content.

### 15.13 Complete Cloudflare account failure

If the Cloudflare account containing the main website infrastructure becomes inaccessible:

1. Preserve GitHub.
2. Preserve Bitbucket.
3. Preserve GitLab.
4. Preserve the independent R2 Backup account.
5. Recover the domain and hosting credentials.
6. Establish replacement Cloudflare infrastructure if required.
7. Deploy the Worker from GitHub or another known-good repository backup.
8. Restore Main R2 from the independent R2 Backup where necessary.
9. Reconnect DNS/domain infrastructure.
10. Test the complete website.

The separation of the R2 Backup into another Cloudflare account is specifically intended to improve resilience against this class of failure.

### 15.14 Loss of administrative credentials

1. Consult the Credential Key.
2. Use the appropriate recovery email/account.
3. Use stored recovery codes where required.
4. Do not create random replacement credentials without documenting them.
5. Rotate compromised credentials.
6. Update the Credential Key.
7. Test access.
8. Record the incident.

### 15.15 Loss or corruption of the BCP

The authoritative BCP is stored in the GitHub repository as:

**`BCP.md`**

If the repository becomes unavailable, use the independent repository backups to recover the file.

Physical copies should also exist so that the recovery plan does not depend entirely on the systems it describes.

### 15.16 Suspected compromise

If compromise is suspected:

1. Do not continue making unnecessary changes.
2. Preserve evidence where practical.
3. Secure the affected account.
4. Revoke compromised credentials/tokens.
5. Rotate credentials.
6. Check repository history.
7. Check Worker/deployment history.
8. Check R2 changes.
9. Compare against independent backups.
10. Restore a known-good state if necessary.
11. Re-establish backup integrity.
12. Record the incident.

### 15.17 Complete digital reconstruction

If Vimuktam must be reconstructed from multiple independent systems:

1. Recover the latest known-good website repository from GitHub, Bitbucket or GitLab.
2. Recover the Worker deployment environment.
3. Recover Main R2 or restore it from R2 Backup.
4. Reconnect the domain.
5. Restore administrative access.
6. Restore Company Documents.
7. Verify the six Almirahs.
8. Verify credentials through the Credential Key.
9. Test the website end-to-end.
10. Confirm independent backups are functioning.
11. Update this BCP with the recovery event.

---

## 16. INCIDENT REPORT

Every significant continuity event should be recorded.

The incident record should include:

- date and time;
- affected system;
- what happened;
- suspected cause;
- systems that remained available;
- recovery action taken;
- final outcome;
- credentials or infrastructure changed;
- whether backups were successfully used;
- whether the BCP itself requires modification;
- lessons learned.

The purpose of an incident report is not merely documentation. It improves the next recovery.

---

## 17. DOCUMENT CUSTODY

The BCP is a living operational document.

Its contents should change when the architecture changes.

Changes to any of the following should trigger a BCP review:

- repository structure;
- deployment system;
- Cloudflare architecture;
- R2 buckets;
- backup repositories;
- backup workflows;
- domain/hosting arrangements;
- credential arrangements;
- recovery mechanisms;
- administrative architecture.

The BCP should not contain secret passwords, API tokens, private keys or recovery codes.

Those belong in the Credential Key or the designated secure credential store.

---

## 18. FUTURE BCP MODULES

Future additions may include:

- detailed domain/DNS recovery;
- detailed Cloudflare account recovery;
- complete R2 restoration procedures;
- media integrity verification;
- automated backup verification;
- automated retention verification;
- disaster recovery drills;
- emergency contact procedures;
- offline repository export procedures;
- complete website reconstruction procedure;
- periodic restoration testing;
- formal dependency mapping;
- recovery time objectives;
- recovery point objectives.

These should be added only when the corresponding systems and procedures actually exist.

---

## 19. RECOVERY PRIORITY

In a major failure, recovery should generally proceed in the following order:

### Priority 1 — Human access

Recover:

- email;
- account access;
- 2FA;
- recovery codes;
- Credential Key.

### Priority 2 — Source code

Recover:

- GitHub;
- Bitbucket;
- GitLab.

At least one known-good repository must be recovered.

### Priority 3 — Website execution

Recover:

- Cloudflare;
- Worker;
- deployment;
- domain/DNS.

### Priority 4 — Primary media

Recover:

- Main R2;
- `vimuktam-multimedia`;
- `MULTIMEDIA` binding.

### Priority 5 — Independent media backup

Verify:

- R2 Backup;
- `vimuktam-media-publications-backup`;
- backup Worker;
- `BACKUP` binding;
- backup authentication.

### Priority 6 — Administrative systems

Recover:

- Company Documents;
- administrative interfaces;
- required operational documents.

### Priority 7 — Verification

Test:

- public website;
- administration;
- media;
- repository integrity;
- backups;
- recovery access.

The objective is not merely to make the website appear online. The objective is to restore a sustainable and independently recoverable Vimuktam system.

---

## 20. CURRENT STATUS — SEPTEMBER 2026

### Website

Operational architecture exists through GitHub and Cloudflare.

### GitHub

Primary repository and source of truth:

**`pegasusmilan/Vimuktam-Website`**

### Bitbucket

Independent Backup 1 is established.

### GitLab

Independent Backup 2 / Standby is established:

**`vimuktam-group/Vimuktam-Website`**

### Main R2

Primary media repository is established:

**`vimuktam-multimedia`**

### R2 Backup

Independent backup infrastructure is established:

**`vimuktam-media-publications-backup`**

The backup is located in a separate Cloudflare account and uses the backup Worker with the `BACKUP` binding.

### Retention

The intended **90-day rolling retention** system is planned / under implementation and is **not yet fully implemented and verified end-to-end**.

### Storage threshold

The intended operational threshold is approximately:

**9.90 GB**

### Current continuity position

Vimuktam therefore has:

- one primary code repository;
- two independent code backups/standby repositories;
- one primary media repository;
- one independent media backup;
- separate Cloudflare infrastructure for the media backup;
- documented recovery procedures;
- a Credential Key;
- physical BCP copies.

The remaining work is primarily verification, maintenance and completion of the planned R2 retention mechanism.

---

## 21. WEEKLY MAINTENANCE

At least weekly, verify:

### GitHub

- repository accessible;
- latest changes present;
- no unexpected repository changes;
- GitHub Actions functioning.

### Cloudflare

- website operational;
- Worker operational;
- deployment functioning.

### Main R2

- `vimuktam-multimedia` accessible;
- representative files accessible;
- no unexpected storage problems.

### Bitbucket

- Backup 1 accessible;
- repository mirror reasonably current.

### GitLab

- Backup 2 / Standby accessible;
- repository mirror reasonably current;
- backup workflow functioning.

### R2 Backup

- `vimuktam-media-publications-backup` accessible;
- backup Worker operational;
- `BACKUP` binding operational;
- last successful backup is recent;
- storage usage is within the intended threshold.

### Retention

- check implementation status;
- check for unexpected storage growth;
- record whether 90-day retention remains pending verification.

---

## 22. MONTHLY MAINTENANCE

At least monthly:

1. Verify GitHub repository integrity.
2. Verify Bitbucket Backup 1.
3. Verify GitLab Backup 2 / Standby.
4. Verify Cloudflare deployment.
5. Verify Main R2.
6. Verify R2 Backup.
7. Review backup storage usage.
8. Review the approximately 9.90 GB threshold.
9. Review backup history.
10. Test restoration of at least one representative R2 object when practical.
11. Review the status of the 90-day retention mechanism.
12. Confirm the Credential Key remains accurate.
13. Confirm recovery credentials remain valid.
14. Review 2FA and recovery mechanisms.
15. Check the domain/hosting recovery arrangements.
16. Review the BCP against actual architecture.
17. Update the BCP if the architecture has changed.

A periodic restoration test is more valuable than merely confirming that a backup exists.

---

## 23. BCP PORTAL

The Vimuktam website contains a dedicated BCP reading interface.

The website should render the current authoritative BCP directly from:

**`BCP.md`**

The BCP portal is therefore a reading interface, not a separate copy of the document.

The displayed document must remain synchronized with the authoritative repository file.

Search and reading functionality should operate against the current `BCP.md`.

The purpose of the portal is to make the recovery plan accessible without creating another competing version of it.

---

## 24. AUTHORITATIVE DOCUMENT

There is **one authoritative digital BCP**:

**`BCP.md` in the root of the Vimuktam GitHub repository.**

The repository is:

**`pegasusmilan/Vimuktam-Website`**

This file is the master document.

The website BCP portal reads this file.

Independent repository backups may contain copies of `BCP.md` because they are backups of the entire repository, but they are not separate BCP versions.

No second repository document should be treated as an independent authoritative BCP.

Company Documents may contain operational references to the BCP, but it should not contain a competing master copy.

Physical copies may be retained for disaster recovery, but they are snapshots of the authoritative document rather than separate authoritative versions.

The continuity hierarchy is therefore:

**`BCP.md` → website BCP portal → repository backups → physical copies**

The fundamental rule is:

> **One BCP. One authoritative digital source. Multiple independent means of recovering it.**

---

# END OF VIMUKTAM BUSINESS CONTINUITY & RECOVERY PLAN
