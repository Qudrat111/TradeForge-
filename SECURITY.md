# Security Policy

## Supported Versions

Only the versions listed below receive active security updates. If you are
running an older version, please upgrade before reporting an issue.

| Version | Supported          |
| ------- | ------------------ |
| 1.x     | ✅ Active          |
| 0.x     | ⚠️ Critical fixes only |
| < 0.1   | ❌ Not supported   |

## Reporting a Vulnerability

**Please do not report security vulnerabilities through public GitHub issues.**

If you discover a security vulnerability, please follow the responsible
disclosure process below:

1. **Email** `security@tradeforge.io` with the subject line:
   `[SECURITY] <short description>`.
2. Include a detailed description of the vulnerability, affected versions,
   reproduction steps, and — where possible — a proof-of-concept or patch.
3. You will receive an acknowledgement within **48 hours**.
4. We aim to provide a resolution timeline within **7 business days** for
   critical issues and **30 days** for lower-severity findings.
5. We will coordinate a public disclosure date with you once a fix is ready.

We follow the [CVSS v3.1](https://www.first.org/cvss/v3.1/specification-document)
scoring system to triage severity.

### PGP Key

For highly sensitive reports, you may encrypt your email using our PGP key,
available at `https://tradeforge.io/.well-known/security.asc` and on the
OpenPGP keyserver (`keys.openpgp.org`).

### Bug Bounty

TradeForge operates a private bug bounty programme. Researchers who responsibly
disclose qualifying vulnerabilities may be eligible for recognition or monetary
reward. Contact `security@tradeforge.io` for details.

---

## Security Best Practices

### Secrets Management

- Never commit `.env` files or any file containing credentials to the
  repository. The `.env.example` file contains only placeholder values.
- Rotate all secrets (JWT keys, database passwords, AWS credentials) immediately
  if you suspect they have been compromised.
- Use a secrets manager (e.g., AWS Secrets Manager, HashiCorp Vault) in
  production rather than environment variable files.
- JWT secrets must be at least 64 random bytes generated with a
  cryptographically secure source (`openssl rand -hex 64`).

### Authentication & Authorisation

- All service-to-service communication must use mTLS or signed JWTs.
- JWTs have a short expiry (`JWT_EXPIRES_IN`) paired with a refresh token flow.
- Enable multi-factor authentication (MFA) for all privileged accounts.
- Apply the principle of least privilege to all IAM roles and database users.

### Dependencies

- Dependencies are pinned and audited with `npm audit` in CI.
- Dependabot is enabled for automated patch-level upgrades.
- New dependencies must pass a manual security review before merging.

### Container & Infrastructure

- Base images are pinned to a specific digest, not a mutable tag.
- Containers run as a non-root user with a read-only root filesystem.
- Network policies restrict inter-service communication to declared routes only.
- All traffic is encrypted in transit (TLS 1.2+).

### Code Security

- Input is validated at every service boundary using class-validator DTOs.
- SQL queries use parameterised statements (TypeORM) — raw SQL is forbidden
  unless wrapped in a reviewed helper.
- Sensitive data (passwords, PII) is never logged.
- OWASP Top 10 is reviewed during each major feature design.

---

## Security-Related Contacts

| Role                    | Contact                          |
| ----------------------- | -------------------------------- |
| Security team           | security@tradeforge.io           |
| General engineering     | engineering@tradeforge.io        |
| Data Protection Officer | dpo@tradeforge.io                |
