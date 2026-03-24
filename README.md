# TayLabs Auth

An open-source, self-hosted authentication service built for personal and small-team projects. TayLabs Auth provides a complete identity platform with JWT-based sessions, role-based access control, TOTP two-factor authentication, and more.

## Table of Contents

- [Features](#features)
- [Architecture Overview](#architecture-overview)
- [Prerequisites](#prerequisites)
- [Quick Start with Docker](#quick-start-with-docker)
- [Configuration](#configuration)
- [API Reference](#api-reference)
- [Development Setup](#development-setup)
- [Database Migrations](#database-migrations)

---

## Features

- **Email/password authentication** — signup, login, logout, and session refresh
- **JWT-based sessions** — short-lived access tokens paired with rotating refresh tokens stored in Redis
- **Multi-device session management** — per-device session tracking with the ability to revoke individual devices or all sessions at once
- **Role-based access control (RBAC)** — flexible roles and permissions system supporting multiple services
- **TOTP two-factor authentication** — generate QR codes, verify authenticator apps, and enforce 2FA on login
- **Email verification** — token-based email confirmation flow
- **Password reset** — secure HMAC-signed reset links delivered by email
- **Forced password change** — admins can require users to reset their password on next login
- **CSRF protection** — cookie-based CSRF tokens for all state-changing requests
- **Rate limiting** — Redis-backed per-IP rate limits on login, signup, refresh, and email verification endpoints
- **Admin API** — manage users, roles, permissions, and services
- **Docker-first deployment** — single `docker-compose.yml` covers all services

---

## Architecture Overview

TayLabs Auth is a Node.js/Express API that depends on several external services:

| Service | Purpose |
|---|---|
| **PostgreSQL** | Primary data store (users, roles, permissions, devices, TOTP tokens) |
| **Redis** | Session whitelist and rate-limit counters |
| **TayLabs/Mail** | Transactional email delivery (password reset, email verification) |
| **TayLabs/Keys** *(optional)* | API key management for machine-to-machine auth |

Sessions are managed as a **dual-token system**: a signed refresh token lives in an `HttpOnly` cookie; a short-lived access token is returned in the response body and sent as a `Bearer` token on subsequent requests.

---

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/install/)
- The following companion images must be built and available locally before running the compose commands:
  - `taylabs-keys` — clone [TayLabs/Keys](https://github.com/TayLabs/Keys) and run `pnpm docker:build`
  - `taylabs-mail` — clone [TayLabs/Mail](https://github.com/TayLabs/Mail) and run `pnpm docker:build`

---

## Quick Start with Docker

### Development (infrastructure only)

Spin up Postgres, Redis, the Keys service, and the Mail service. The auth API itself runs locally via `pnpm dev`.

> [!Note]
> Be sure to clone the Keys and Mail services and run `pnpm docker:build` so that the images are available for docker compose to use

```bash
# Clone the repository
git clone https://github.com/TayLabs/Auth.git
cd Auth

# Copy and fill in the environment file
cp .example.env .env
# Edit .env with your secrets (see Configuration section)

# Start infrastructure containers
docker compose --profile development up -d

# Install dependencies and start the dev server
pnpm install
pnpm dev
```

The API will be available at `http://localhost:7313`.

### Production (fully containerised)

Build the auth image and bring up the entire stack with a single command.

```bash
# Build the auth image
pnpm docker:build
# or: docker build -t taylabs-auth .

# Set required environment variables
export MAILTRAP_API_KEY=your_mailtrap_api_key
export MAIL_API_KEY=your_mail_service_api_key

# Start all services
docker compose --profile production up -d
```

> **Note:** The `production` profile starts all services including the auth API container. The `development` profile starts only the infrastructure (Postgres, Redis, Keys, Mail) and is intended for local development where you run the Node process directly.

### Useful compose commands

```bash
# Stop containers without removing them
pnpm docker:stop

# Start previously stopped containers
pnpm docker:start

# Stop and remove containers
pnpm docker:down
```

---

## Configuration

Create a `.env` file at the project root. A documented template is provided at `.example.env` and can simply be duplicated and renamed.

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | ✅ | PostgreSQL connection string, e.g. `postgresql://user:pass@localhost:5313/auth` |
| `REDIS_URI` | ✅ | Redis host and port, e.g. `localhost:6313` |
| `ACCESS_TOKEN_SECRET` | ✅ | Secret used to sign access JWTs (6–24 characters) |
| `ACCESS_TOKEN_TTL` | | Access token lifetime, e.g. `15m` (default: `15m`) |
| `REFRESH_TOKEN_SECRET` | ✅ | Secret used to sign refresh JWTs (12–32 characters) |
| `REFRESH_TOKEN_TTL` | | Refresh token lifetime, e.g. `30d` (default: `30d`) |
| `TOTP_ENCRYPT_KEY` | ✅ | Key used to AES-256-GCM encrypt TOTP secrets at rest (12–32 characters) |
| `RESET_TOKEN_HASH_KEY` | ✅ | HMAC key for password reset tokens (12–32 characters) |
| `RESET_TOKEN_TTL` | | Reset token lifetime, e.g. `15m` (default: `15m`) |
| `EMAIL_VERIFICATION_SECRET` | ✅ | Secret for signing email verification JWTs (6–24 characters) |
| `EMAIL_VERIFICATION_TTL` | | Verification token lifetime, e.g. `10m` (default: `10m`) |
| `MAIL_API` | ✅ | Mail service address, e.g. `localhost:4313` |
| `MAIL_API_KEY` | ✅ | API key registered with the Mail service |
| `FRONTEND_URL` | ✅ | Base URL of your frontend app, used to validate redirect URLs in emails |
| `HOST_DOMAIN` | ✅ | Root domain used for the `domain` attribute on cookies, e.g. `localhost` |
| `PORT` | | Port the server listens on (default: `7313`) |
| `NODE_ENV` | | `development`, `production`, or `test` (default: `production`) |
| `CHECK_PASSWORD_COMPLEXITY` | | Enforce uppercase, lowercase, number, and special character requirements (`true`/`false`, default: `false`) |
| `ADMIN` | | Seed admin credentials in `email:password` format (default: `admin:admin` — a forced password change will be required) |
| `API_KEY_TTL` | | Lifetime for API keys, e.g. `30d` (default: `30d`) |
| `SERVICE_NAME` | | Name used when scoping permissions in access tokens (default: `auth`) |

---

## API Reference

All endpoints are prefixed with `/api/v1` to allow for versioning in the future.

### Authentication — `/auth`

| Method | Path | Description |
|---|---|---|
| `POST` | `/auth/login` | Authenticate with email and password |
| `POST` | `/auth/signup` | Register a new account |
| `POST` | `/auth/refresh` | Rotate the refresh token and get a new access token |
| `GET` | `/auth/csrf` | Obtain a CSRF token |

### Session Management — `/auth/logout`

| Method | Path | Description |
|---|---|---|
| `DELETE` | `/auth/logout` | Revoke the current device session |
| `DELETE` | `/auth/logout/all` | Revoke all active sessions for the authenticated user |

### Two-Factor Authentication — `/auth/totp`

| Method | Path | Description |
|---|---|---|
| `POST` | `/auth/totp/validate` | Validate a TOTP code to complete login when 2FA is pending |

### Password Management — `/auth/password`

| Method | Path | Description |
|---|---|---|
| `POST` | `/auth/password/reset/request` | Send a password reset email |
| `PATCH` | `/auth/password/reset` | Reset password using a token from the email link |
| `PATCH` | `/auth/password/change` | Change password while authenticated |

### Email Verification — `/auth/email`

| Method | Path | Description |
|---|---|---|
| `POST` | `/auth/email/verify/request` | Resend the email verification link |
| `POST` | `/auth/email/verify` | Verify email address using a token from the email link |

### Account — `/account`

| Method | Path | Description |
|---|---|---|
| `GET` | `/account/profile` | Get the authenticated user's profile |
| `PATCH` | `/account/profile` | Update profile fields (name, username, bio, etc.) |
| `PATCH` | `/account/security/two-factor/:switch` | Enable (`on`) or disable (`off`) 2FA |
| `GET` | `/account/security/totp` | List registered TOTP authenticator apps |
| `POST` | `/account/security/totp/create` | Register a new TOTP authenticator (returns a QR code) |
| `POST` | `/account/security/totp/verify/:totpTokenId` | Confirm a newly registered TOTP device |
| `DELETE` | `/account/security/totp/remove/:totpTokenId` | Remove a TOTP authenticator |
| `DELETE` | `/account/delete` | Permanently delete the authenticated user's account |

### Admin — `/admin`

All admin endpoints require an access token with the appropriate permission scope.

| Method | Path | Required Permission | Description |
|---|---|---|---|
| `GET` | `/admin/users` | `user.read.all` | List all users |
| `PATCH` | `/admin/users/:userId/force-password-reset` | `user.write.all` | Force a user to reset their password |
| `GET` | `/admin/users/:userId/roles` | `user.read.all` | Get roles assigned to a user |
| `PATCH` | `/admin/users/:userId/roles` | `user.write.all` | Update roles assigned to a user |
| `GET` | `/admin/roles` | `role.read` | List all roles |
| `GET` | `/admin/roles/:roleId` | `role.read` | Get a role by ID |
| `POST` | `/admin/roles` | `role.write` | Create a new role |
| `PATCH` | `/admin/roles/:roleId` | `role.write` | Update a role |
| `DELETE` | `/admin/roles/:roleId` | `role.write` | Delete a role |
| `GET` | `/admin/services` | `service.read` | List all services |
| `GET` | `/admin/services/:serviceName` | `service.read` | Get a service by name |
| `POST` | `/admin/services/register` | `service.write` | Register a new external service |
| `PATCH` | `/admin/services/:serviceName` | `service.write` | Update a service |
| `DELETE` | `/admin/services/:serviceName` | `service.write` | Remove a service |

---

## Development Setup

### Requirements

- Node.js
- Docker (for Postgres and Redis)

### Steps

```bash
# 1. Install dependencies
pnpm install

# 2. Start infrastructure
docker compose --profile development up -d

# 3. Copy environment file and fill in secrets
cp .example.env .env

# 4. Run in watch mode (auto-restarts on file changes)
pnpm watch

# 5. Run tests
pnpm test
```

### Available scripts

| Script | Description |
|---|---|
| `pnpm dev` | Start the server once in development mode |
| `pnpm watch` | Start with file-watching and auto-restart |
| `pnpm test` | Run the test suite |
| `pnpm build` | Compile TypeScript to `dist/` |
| `pnpm start` | Run the compiled build |
| `pnpm db:init` | Generate and apply all pending migrations |
| `pnpm docker:build` | Build the `taylabs-auth` Docker image |

---

## Database Migrations

Migrations are managed with [Drizzle Kit](https://orm.drizzle.team/kit-docs/overview) and run automatically on server startup.

To manually generate and apply migrations during development:

```bash
pnpm db:init
```

Migration files live in `drizzle/migrations/`. Schema definitions are in `src/config/db/schema/`.

On first boot the server also runs a **seed** function that creates the initial admin user and loads permissions from each service's `taylab.config.yml`. The admin credentials are taken from the `ADMIN` environment variable (`email:password` format). If the default password `admin` is used, the account will be flagged for a forced password change on first login.

---

## License

This project is licensed under the **GNU Affero General Public License v3.0**. See [LICENSE](./LICENSE) for details.

In short: if you run a modified version of this software on a network server, you must make the source code of your modifications available to users of that service.
