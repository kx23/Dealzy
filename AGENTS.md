# AGENT CODING GUIDELINES

This document outlines the conventions and commands for automated agents working in the Dealzy repository.

## 1. Build, Lint, and Test Commands

| Project | Action | Command | Single Test |
| :--- | :--- | :--- | :--- |
| **Frontend (JS/React)** | Build | `npm run build` | `npm test -- <path/to/test.js>` |
| | Test | `npm run test` | |
| **Backend (C#/.NET)** | Build | `dotnet build` | N/A (Use filter) |
| | Test | `dotnet test` | `dotnet test --filter "FullyQualifiedName~<TestName>"` |

## 2. Code Style and Conventions

### C# Backend (.NET 9.0)
- **Naming:** PascalCase for classes, methods, and public properties. camelCase for local variables.
- **Types:** `Nullable` is enabled (`<Nullable>enable`). Use strong typing.
- **Imports:** `ImplicitUsings` is enabled. Use standard C# conventions.
- **Error Handling:** Use standard C# exception handling and appropriate HTTP status codes in controllers.

### JS/React Frontend
- **Naming:** PascalCase for React components (e.g., `AddressAutocomplete.jsx`).
- **Formatting:** Standard React/JSX formatting (implicit via `react-scripts` ESLint).
- **Imports:** Use ES module imports.
