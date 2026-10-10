<div align="center">

# 📚 Biblioteca — Book Tracking

**A personal book-tracking platform** built with Spring Boot microservices, an API gateway, OAuth2 security, and an Angular single-page app.

[![Java](https://img.shields.io/badge/Java-21-ED8B00?logo=openjdk&logoColor=white)](https://openjdk.org/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.5.x-6DB33F?logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![Spring Cloud](https://img.shields.io/badge/Spring%20Cloud-2025.0.0-6DB33F?logo=spring&logoColor=white)](https://spring.io/projects/spring-cloud)
[![Angular](https://img.shields.io/badge/Angular-20-DD0031?logo=angular&logoColor=white)](https://angular.dev/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=white)](https://www.docker.com/)

Catalogue books, authors, publishers, series and genres · track reading progress · manage wishlists & collections · log sessions & goals · write reviews & quotes · view analytics & spending.

</div>

---

## 📖 Overview

**Biblioteca** is a book-tracking system where a user can build and manage their personal
library end to end. The backend is a set of independent Spring Boot **microservices**
discovered through **Eureka**, configured by a **Spring Cloud Config Server**, and exposed
through a single **API Gateway**. Authentication and authorization are handled by a
dedicated **OAuth2 Authorization Server** that issues JWT tokens.

This repository holds the application source — backend microservices, frontend, SQL schema
and planning. Runtime configuration lives in a separate Spring Cloud Config Git repository
(see [⚙️ Configuration](#️-configuration)).

> [!NOTE]
> The configuration Git repository (`book_tracking_config_property`) is private and is not
> part of this repository.

---

## 🗂️ Repository layout

```text
book_tracking/
├── micro-services/          # 🖧 Spring Boot backend
│   ├── apigateway/          #    Spring Cloud Gateway (entry point)
│   ├── authserver/          #    OAuth2 Authorization Server
│   ├── configserver/        #    Spring Cloud Config Server (Git backend)
│   ├── serviceregistry/     #    Eureka service registry
│   ├── userservice/         #    Users, profiles, preferences
│   ├── catalogservice/      #    Books, authors, publishers, series
│   ├── userlibraryservice/  #    User-owned library, collections, wishlist, reading logs
│   └── docker-compose.yml   #    Container orchestration for the backend
├── web-app/                 # 🖥️ Angular front end
├── sql/                     # 🗄️ Database schema/seed scripts
│   ├── user_db/
│   ├── catalog_db/
│   └── user_library_db/
├── planning.docx            # 📋 Project planning document
├── todo.txt                 # ✅ Outstanding tasks
└── README.md
```

---

## 🏛️ Architecture

```text
                    ┌─────────────────────┐
                    │  Angular web-app    │  http://localhost:4200
                    └──────────┬──────────┘
                               │ OAuth2 (authorization code)
                               ▼
   ┌───────────────────────────────────────────────────────────┐
   │                    API Gateway  :9073                      │
   └───────┬───────────────┬───────────────────┬───────────────┘
           │               │                   │
           ▼               ▼                   ▼
   ┌──────────────┐ ┌──────────────┐ ┌────────────────────┐
   │ userservice  │ │ catalogservice│ │ userlibraryservice │
   │   :8087      │ │   :8090       │ │   :8092           │
   └──────┬───────┘ └──────┬────────┘ └─────────┬──────────┘
          │                │                    │
          ▼                ▼                    ▼
     ┌─────────┐      ┌────────────┐      ┌────────────────┐
     │ user_db │      │ catalog_db │      │ user_library_db│
     └─────────┘      └────────────┘      └────────────────┘
                             │
                    ┌────────┴─────────┐
                    │  authserver :9072│  (issues JWT)
                    └──────────────────┘
          ┌─────────────────┐   ┌──────────────────┐
          │ configserver    │   │ serviceregistry  │
          │    :8082        │   │      :9071       │
          └─────────────────┘   └──────────────────┘
```

| Component | Role |
|---|---|
| 🧭 **serviceregistry** | Netflix Eureka registry — every service registers here |
| ⚙️ **configserver** | Spring Cloud Config Server — serves per-service properties from Git |
| 🚪 **apigateway** | Edge gateway — routes `/userservice/**`, `/catalogservice/**`, `/userlibraryservice/**` via Eureka (`lb://`) |
| 🔐 **authserver** | OAuth2 Authorization Server — issues JWT access/refresh tokens, exposes `/oauth2/jwks` |
| 🔗 **Resource servers** | Validate JWT tokens; resolve peers via Eureka |

### Services

| Service | Port | Context path | Description |
|---|:---:|---|---|
| serviceregistry | `9071` | `/` | Eureka service discovery |
| configserver | `8082` | `/` | Centralized configuration (Git backend) |
| authserver | `9072` | `/` | OAuth2 Authorization Server / JWT issuer |
| apigateway | `9073` | `/` | Edge gateway and routing |
| userservice | `8087` | `/userservice` | Accounts, profiles, preferences, activities, sessions |
| catalogservice | `8090` | `/catalogservice` | Books, editions, authors, publishers, series, genres |
| userlibraryservice | `8092` | `/userlibraryservice` | Owned books, collections, wishlist, reading logs/goals |

---

## 🧰 Tech stack

<table>
<tr><th>Backend (micro-services)</th><th>Frontend (web-app)</th><th>Data</th></tr>
<tr valign="top">
<td>

- ☕ **Java 21**
- 🌱 **Spring Boot 3.5.5** <br/>(userlibraryservice 3.5.6)
- ☁️ **Spring Cloud 2025.0.0**
- 🚪 Spring Cloud Gateway (WebFlux)
- 🧭 Eureka · ⚙️ Spring Cloud Config
- 🔐 OAuth2 Auth + Resource Server (JWT)
- 🗃️ Spring Data JPA / Hibernate
- 🛫 Flyway migrations
- 🧠 Spring Session (Redis) dependency declared in authserver — not configured or wired in code
- 📑 springdoc-openapi (Swagger UI)

</td>
<td>

- 🅰️ **Angular 20** / TypeScript 5.8
- 🧩 **NgRx** (store, effects, entity, devtools)
- 🎨 **PrimeNG** + PrimeIcons + themes
- 💨 **Tailwind CSS** + `tailwindcss-primeui`
- 🔐 `angular-oauth2-oidc`
- 📊 Chart.js · ApexCharts · FontAwesome
- 🧪 Karma + Jasmine

</td>
<td>

- 🐘 **PostgreSQL**
- Three logical databases:
  - `user_db`
  - `catalog_db`
  - `user_library_db`

</td>
</tr>
</table>

> Each backend service is packaged as a Spring Boot fat JAR and built independently
> (there is no parent POM).

### 🗄️ Databases

| Database | Owned by | Contents |
|---|---|---|
| `user_db` | userservice · authserver | users, OAuth2 clients/authorizations/consents, profiles, preferences, settings, activities, sessions |
| `catalog_db` | catalogservice | authors, genres, publishers, books, series, editions and join tables |
| `user_library_db` | userlibraryservice | user books/editions, collections, wishlist, preferences, reading sessions & goals |

Schema and seed scripts live in `sql/` and are numbered for ordering.

---

## ⚙️ Configuration

Runtime configuration is **not** stored in this repository. The **config server** reads it
from a separate Git repository (default:
`https://github.com/ayashaJui/book_tracking_config_property.git`, a **private** repo),
selected per service via `spring.profiles.active`.

| Profile | Used for |
|---|---|
| `localhost` | Local development (config server, Eureka and databases on `localhost`) |
| `development` | Containerized / docker-compose setup (compose network hostnames) |
| `git` | Used by the config server itself to pull from the Git backend |

### 🔑 Required environment variables

Supply these via a `.env` file or a secret store (`.env` is git-ignored):

| Variable | Purpose |
|---|---|
| `GIT_USERNAME` / `GIT_PASSWORD` | Credentials for the private config Git repository |
| `SECURITY_USERNAME` / `SECURITY_PASSWORD` | HTTP Basic credentials protecting the config server |
| `SPRING_PROFILES_ACTIVE` | Active profile for the config server (`git`) |

> [!IMPORTANT]
> The Eureka registry and config server use HTTP Basic auth configured in the service
> `application.properties` files. Externalize and rotate these before deploying.

---

## 🚀 Getting started (local development)

### ✅ Prerequisites

| Tool | Version / notes |
|---|---|
| JDK | Java 21 |
| Maven | 3.9+ |
| Node.js + npm | latest LTS; Angular CLI (`npm i -g @angular/cli`) |
| PostgreSQL | with `user_db`, `catalog_db`, `user_library_db` |
| Redis | optional — only if auth server's Spring Session (Redis) dependency is enabled |
| Docker + Docker Compose | optional, for the containerized flow |

### 1️⃣ Prepare the databases

Create the three PostgreSQL databases and run the scripts in `sql/` (respecting the
numeric file prefixes). The `*_db` scripts load into their matching database.

### 2️⃣ Start the backend (local)

Start services in dependency order, building each first:

```bash
# 1. service registry
cd micro-services/serviceregistry   && mvn spring-boot:run

# 2. config server (needs GIT_* / SECURITY_* env vars)
cd micro-services/configserver      && mvn spring-boot:run

# 3. auth server
cd micro-services/authserver        && mvn spring-boot:run

# 4. business services
cd micro-services/userservice        && mvn spring-boot:run
cd micro-services/catalogservice     && mvn spring-boot:run
cd micro-services/userlibraryservice && mvn spring-boot:run

# 5. gateway
cd micro-services/apigateway        && mvn spring-boot:run
```

With the `localhost` profile, services reach the config server and Eureka on
`localhost:8082` / `localhost:9071`.

### 3️⃣ Start the backend (Docker)

`micro-services/docker-compose.yml` orchestrates the backend on a shared `micro-net`
network. Provide the required env vars, then:

```bash
cd micro-services
docker compose up --build
```

> [!WARNING]
> The compose file currently defines **serviceregistry, configserver, apigateway,
> authserver and userservice**. `catalogservice` and `userlibraryservice` are **not yet
> included** and have no Dockerfiles.

### 4️⃣ Start the frontend

```bash
cd web-app
npm install
npm start          # ng serve → http://localhost:4200
```

The app authenticates via OIDC against the auth server and calls the backend through the
API gateway. Endpoint URLs and the OAuth issuer/client id live in
`web-app/src/environments/environment.ts` and are consumed by
`web-app/src/app/configurations/oauth2.ts`.

### 🏗️ Production build (frontend)

```bash
cd web-app
npm run build      # ng build → dist/
```

---

## 🧩 Frontend modules

Feature modules under `web-app/src/app/modules`:

| | | | |
|---|---|---|---|
| 📊 `analytics` | ✍️ `authors` | 📕 `books` | 🗂️ `collections` |
| 🏠 `dashboard` | 👤 `profile` | 🏢 `publishers` | 💬 `quotes` |
| 📝 `reading-logs` | ⭐ `reviews` | 📚 `series` | ⚙️ `settings` |
| 🔗 `shared` | 💰 `spendings` | 💖 `wishlist` | |

Cross-cutting code lives in `configurations/`, `layout/`, `shared/` and `utilities/`.

---

## 🚧 Deployment notes

Before hosting, there are known items to address:

- 🔐 **Shared credentials** — the config server, Eureka and gateway use `biblioteca`/`biblioteca`
  defined in service `application.properties`; move these to secret injection.
- 🗝️ **DB credentials in the config Git history** — externalize and rotate as needed.
- 📦 **Missing packaging** — `catalogservice` and `userlibraryservice` are absent from
  `docker-compose.yml` and have no Dockerfiles.
- 🖥️ **`localhost` hardwiring** — those two services hardwire the `localhost` profile and a
  `localhost:8082` config import.
- 🔏 **Ephemeral JWT key** — the auth server generates its RSA signing key in memory at
  startup, so keys are not stable across restarts/instances.
- 🌐 **Frontend targets `localhost`** — no production environment file and no server-side
  SPA rewrite configuration.

---

## 📌 Status / backlog

See [`todo.txt`](./todo.txt) (e.g. "Add Book. api + frontend") and
[`planning.docx`](./planning.docx) for the project plan and outstanding work.
