# Vimuktam Business Continuity Plan (BCP)

**Version:** 0.1  
**Status:** Initial infrastructure baseline  
**Created:** 11 August 2026  
**Owner:** Vimuktam  
**Review status:** Living document

---

## 1. Purpose

This Business Continuity Plan establishes the systems, safeguards, recovery procedures, decision points and outstanding risks necessary to maintain or reconstruct Vimuktam's digital operations following loss, compromise, accidental deletion, account lockout, service failure or other disruption.

This is an **internal operational document**. It is a living document and must be updated as Vimuktam's digital infrastructure develops.

### Status key

- 🟢 **Implemented & verified** — established and checked.
- 🟡 **Implemented but not yet tested** — exists, but recovery or resilience has not yet been tested.
- 🔵 **Planned** — intended but not yet implemented.
- 🔴 **Critical unresolved risk** — requires attention before the system can be considered adequately resilient.

---

## 2. Critical Digital Assets

| Asset | Current system | Importance | Status |
|---|---|---|---|
| `vimuktam.com` | Hostinger | Critical | 🟢 |
| Website source | GitHub | Critical | 🟢 |
| Independent website backup | Bitbucket | Critical | 🟢 |
| Deployment / CDN | Cloudflare | Important | 🟡 |
| Primary identity | Google Account | Critical | 🟢 |
| Website/domain account | Hostinger | Critical | 🟡 |
| Future training/customer systems | TBD | Critical when operational | 🔵 |
| DNC / future technology | TBD | Critical when operational | 🔵 |

---

## 3. Primary Identity — Google

The primary Google account currently has the following safeguards established:

- Password
- 2-Step Verification
- Authenticator
- Passkey on the Motorola moto g85 5G
- Recovery email
- Multiple recovery phone numbers
- Backup codes
- Device review

**Status:** 🟢 Implemented & verified.

### Recovery principle

Google must not become the only means of recovering any critical business asset. As Vimuktam grows, critical services should have independent recovery routes wherever practical.

---

## 4. GitHub — Primary Website Repository

**Repository:** `pegasusmilan/Vimuktam-Website`

GitHub currently functions as the primary source repository for the website.

Security measures established:

- Password
- Two-factor authentication
- Authenticator
- Recovery codes
- Passkey
- Verified email configuration
- Active-session review

**Status:** 🟢 Implemented & verified.

### Temporary GitHub Personal Access Token

A fine-grained Personal Access Token (PAT) was created specifically for the initial Bitbucket import.

Configuration:

- Name: `Vimuktam Bitbucket Backup`
- Repository access: only `pegasusmilan/Vimuktam-Website`
- Contents: read-only
- Metadata: read-only / required
- Account permissions: none
- Expiration: 7 days
- Purpose: initial Bitbucket repository backup

The token was deleted after the Bitbucket import was successfully completed.

**Status:** 🟢 Completed and credential invalidated.

---

## 5. Independent Website Backup — Bitbucket

**Platform:** Bitbucket Cloud  
**Workspace:** `vimuktam-backup`  
**Repository:** `Vimuktam-Website backup`

The initial import from GitHub has been successfully completed.

The backup currently contains the website source files, including:

- `index.html`
- `brand-identity.html`
- `philosophical-overview.html`

The imported repository also contains Git structure and commit history.

**Status:** 🟢 Initial backup implemented and visually verified.

### Recovery principle

The backup exists independently of the primary GitHub repository. The intended architecture is:

**Primary:** GitHub → Vimuktam Website  
**Independent backup:** Bitbucket → Vimuktam Website backup

The backup is intended to allow reconstruction of the website if GitHub becomes unavailable, compromised or inaccessible.

### Important limitation

The Bitbucket backup is currently a manually established backup. Automatic ongoing synchronization has **not yet been implemented**.

**Status:** 🔵 Planned next step.

---

## 6. Domain — vimuktam.com

**Registrar:** Hostinger  
**Status:** Active  
**Expiration:** 11 December 2026  
**Auto-renewal:** Off

Hostinger's Domain Ownership information was checked and showed the correct owner/contact information, including name, phone, email and address.

**Ownership/contact status:** 🟢 Implemented & verified.

### Renewal decision

Auto-renewal has deliberately not been enabled while Vimuktam remains in development. The decision to retain the domain will be made closer to launch.

### Renewal reminders

Daily ChatGPT reminders have been scheduled from **26 November 2026 through 7 December 2026** to prompt the renewal/retention decision.

**Status:** 🟢 Reminder safeguard established.

### Domain risk

Allowing the domain to expire does not guarantee that it can subsequently be purchased again. If released, another party may register it.

Therefore domain renewal is a strategic business decision, not merely an administrative task.

**Current risk status:** 🟡 Managed but unresolved until the renewal decision is made.

---

## 7. Cloudflare

Cloudflare is part of the website's deployment/network architecture.

It is not currently treated as a primary business-continuity asset because the website source can be reconstructed independently from GitHub/Bitbucket and the domain is held at Hostinger.

**Status:** 🟡 Important infrastructure; detailed recovery procedure not yet documented.

---

## 8. Current Recovery Architecture

The current architecture is:

**Google identity**  
↓  
**GitHub — primary website repository**  
↓  
**Cloudflare — deployment/network layer**

with:

**Bitbucket — independent repository backup**  

and:

**Hostinger — domain registrar**

The objective is to avoid dependence upon a single provider, account or copy of the website source.

---

## 9. Recovery Priorities

In a major disruption, the recovery order should generally be:

1. Recover the primary identity and account access.
2. Establish control of `vimuktam.com`.
3. Recover the website source from GitHub if available.
4. If GitHub is unavailable, recover the repository from Bitbucket.
5. Reconstruct the website deployment.
6. Restore DNS/network configuration.
7. Verify website functionality.
8. Restore supporting services such as analytics, forms, email and future customer systems.
9. Document the incident and update this BCP.

---

## 10. Outstanding Actions

### Priority 1 — Website backup

- [x] Create independent Bitbucket workspace.
- [x] Create private backup repository.
- [x] Import Vimuktam website from GitHub.
- [x] Verify source files are present.
- [x] Verify repository history is present.
- [x] Delete temporary GitHub PAT.
- [ ] Document exact restoration procedure.
- [ ] Test restoration from Bitbucket.
- [ ] Implement automatic backup/synchronization.

### Priority 2 — Additional backup

Investigate a third backup independent of both GitHub and Bitbucket, preferably including an offline or separately controlled copy.

Long-term objective: a practical **3-2-1 backup architecture**:

- 3 copies of important data
- 2 different storage/location types
- 1 genuinely independent/offline copy

**Status:** 🔵 Planned.

### Priority 3 — Recovery testing

A backup should not be considered fully reliable merely because it exists.

Conduct a controlled recovery test:

> Assume the GitHub repository has disappeared. Can Vimuktam be reconstructed from the Bitbucket backup?

Record the result, recovery time and any missing dependencies.

**Status:** 🔵 Planned.

---

## 11. Future BCP Sections

As Vimuktam develops, this BCP should expand to cover:

1. Identity & Authentication
2. Domain & DNS
3. Website
4. Git / Source Control
5. Hosting & Deployment
6. Email
7. Customer Data
8. Payment Systems
9. Learning Management System
10. Training Materials
11. Brand Assets
12. Social Media
13. Analytics & SEO
14. Business Documents
15. Financial Records
16. People / Contractor Access
17. Incident Response
18. Data Breach Response
19. Account Lockout Recovery
20. Website Restoration Procedure
21. Domain Loss Procedure
22. Death / Incapacity / Succession
23. Annual BCP Review

---

## 12. Revision History

| Version | Date | Change |
|---|---|---|
| 0.1 | 11 Aug 2026 | Initial digital infrastructure baseline; Google, GitHub, Hostinger and Bitbucket controls documented. |

---

## 13. BCP Review Principle

The BCP must distinguish between what is **implemented**, what is **verified**, what is merely **planned**, and what remains a **material risk**.

No resilience measure should be treated as complete until the relevant recovery path has been tested or otherwise verified.
