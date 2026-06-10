# AGENT CODING GUIDELINES

High-signal facts for agents working in the Dealzy monorepo.

## Repo structure

Monorepo with two isolated projects and a shared domain library:

| Directory | Project | Tech |
|---|---|---|
| `DealZy.Api/` | ASP.NET Core Web API (entry point) | .NET 9.0 |
| `DealZy.Domain/` | Domain models, DTOs | .NET 9.0 class library |
| `DealZy.Infrastructure/` | EF Core DbContext, services, migrations | .NET 9.0 class library |
| `dealzy.frontend/` | React SPA (Create React App) | React 19, `react-scripts` 5 |

## Commands

| Context | Action | Command | Notes |
|---|---|---|---|
| Backend | Build | `dotnet build` | Run from repo root |
| Backend | Run | `dotnet run --project DealZy.Api` | Serves on `http://localhost:5176` |
| Backend | Test | `dotnet test` | **No test projects exist** — command finds nothing |
| Frontend | Install | `npm install` | Run from `dealzy.frontend/` |
| Frontend | Dev server | `npm start` | Serves on `http://localhost:3000` |
| Frontend | Build | `npm run build` | |
| Frontend | Test | `npm test` | Use `npm test -- <path>` for single file |

## Architecture quirks

- **No test projects exist** anywhere in the repo. `dotnet test` is a no-op.
- **No CI/CD** — no `.github/` directory at all.
- **AGENTS.md** and **`package-lock.json`** are both in `.gitignore`.
- **Database:** PostgreSQL via EF Core + Npgsql. Auto-migrates and seeds on startup via `Program.cs`. Seed admin: `admin@dealzy.com` / `Admin123!`.
- **Auth:** ASP.NET Core Identity + JWT Bearer with refresh tokens (`RefreshToken` entity stored in DB).
- **JSON Patch:** `Microsoft.AspNetCore.Mvc.NewtonsoftJson` enables PATCH endpoints (e.g., `AdsController`). The API uses Newtonsoft.Json for patch operations alongside System.Text.Json.
- **CORS:** Only `http://localhost:3000` is allowed (`AllowFrontend` policy).
- **Geocoding:** Nominatim (OpenStreetMap) HTTP client — respects rate limits.
- **Email:** Resend API (`Resend` SDK 0.5.0).
- **Frontend proxy:** `package.json` sets `"proxy": "http://localhost:5176"` so CRA dev server forwards `/api/*` calls to the backend.

## Frontend conventions

- **File extensions:** `.jsx` for components (e.g., `AddressAutocomplete.jsx`), `.js` for pages and utilities.
- **Component casing:** PascalCase for React components.
- **UI:** Bootstrap 5.3.3.
- **Auth state:** React Context (`AuthContext.js`) with Axios interceptor (`api.js`) handling token refresh.
- **Routing:** `react-router-dom` v7 — routes defined in `App.js`.
- **API client:** Axios instance in `api.js` with interceptor for JWT refresh logic on 401.
- `jwt-decode` v4 is pure ESM; may need special handling with CRA's webpack.

## Backend conventions

- `<Nullable>enable</Nullable>` and `<ImplicitUsings>enable</ImplicitUsings>` project-wide.
- PascalCase for classes, methods, public properties.
- `.NET 9.0` throughout.
- Controllers follow standard ASP.NET Core attribute routing and return `IActionResult`.
- Seed data in `ApplicationDbContextSeed.cs` — runs on every startup after applying migrations.
