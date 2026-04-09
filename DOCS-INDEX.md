# SIMP Documentation Index

> **Quick Reference**: All documentation for the Smart Incident Management Platform

---

## Project Structure

```
SIMP/
├── README.md                    # Frontend overview (Next.js)
├── DOCS-INDEX.md                # THIS FILE - Master index
│
├── docs/                        # FRONTEND Documentation
│   ├── ARCHITECTURE.md          # React/Next.js architecture
│   ├── API-INTEGRATION.md       # How frontend calls backend
│   ├── COMPONENTS.md            # UI component library
│   ├── DEPLOYMENT.md            # Vercel, Azure SWA deployment
│   ├── BACKEND-SCAFFOLD.md      # Guide for VS2022 backend
│   └── IMPLEMENTATION-CHECKLIST.md  # Progress tracker
│
└── backend/                     # BACKEND Project (.NET)
    ├── README.md                # Backend overview
    └── docs/                    # BACKEND Documentation
        ├── API.md               # REST API specification
        ├── ARCHITECTURE.md      # .NET Clean Architecture
        ├── AGENTIC-AI.md        # NEW: Semantic Kernel & AI Agents 
        ├── DEPLOYMENT.md        # Azure deployment
        └── DEVELOPMENT.md       # VS2022 setup guide
```

---

## Documentation by Audience

### For Frontend Developers (Next.js/React)

| Document | Location | Purpose |
|----------|----------|---------|
| Project Overview | [`README.md`](README.md) | Getting started with frontend |
| Architecture Guide | [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) | React patterns, state management, data flow |
| API Client | [`docs/API-INTEGRATION.md`](docs/API-INTEGRATION.md) | How to call backend APIs |
| Components | [`docs/COMPONENTS.md`](docs/COMPONENTS.md) | UI component documentation |
| Deployment | [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) | Deploy to Vercel/Azure |

### For Backend Developers (.NET/VS2022)

| Document | Location | Purpose |
|----------|----------|---------|
| Project Overview | [`backend/README.md`](backend/README.md) | Getting started with backend |
| Architecture Guide | [`backend/docs/ARCHITECTURE.md`](backend/docs/ARCHITECTURE.md) | Clean Architecture, patterns |
| **Agentic AI Strategy** | [`backend/docs/AGENTIC-AI.md`](backend/docs/AGENTIC-AI.md) | **Semantic Kernel orchestration & Plugins** |
| API Specification | [`backend/docs/API.md`](backend/docs/API.md) | Endpoint contracts, request/response |
| Development Guide | [`backend/docs/DEVELOPMENT.md`](backend/docs/DEVELOPMENT.md) | VS2022 setup, coding standards |
| Deployment | [`backend/docs/DEPLOYMENT.md`](backend/docs/DEPLOYMENT.md) | Azure App Service deployment |

### For Project Managers / Full Team

| Document | Location | Purpose |
|----------|----------|---------|
| Implementation Status | [`docs/IMPLEMENTATION-CHECKLIST.md`](docs/IMPLEMENTATION-CHECKLIST.md) | Track progress |
| Backend Scaffold Guide | [`docs/BACKEND-SCAFFOLD.md`](docs/BACKEND-SCAFFOLD.md) | What to build in VS2022 |

---

## Documentation Content Summary

### Frontend Documentation (`/docs/`)

1. **ARCHITECTURE.md** - How the frontend is built
   - Next.js App Router structure
   - Component organization
   - State management (SWR, Context)
   - Data fetching patterns
   - TypeScript patterns
   - Tailwind CSS styling

2. **API-INTEGRATION.md** - Connecting to backend
   - API client setup
   - JWT authentication flow
   - All endpoint specifications
   - Error handling patterns
   - Request/response formats

3. **COMPONENTS.md** - UI component library
   - Layout components (Sidebar, Header)
   - Dashboard widgets
   - Incident management components
   - Analytics components
   - Admin components
   - Shared utilities

4. **DEPLOYMENT.md** - Frontend deployment
   - Vercel (recommended)
   - Azure Static Web Apps
   - Docker containers
   - CI/CD pipelines

5. **BACKEND-SCAFFOLD.md** - Backend guidance
   - Clean Architecture overview
   - Solution structure to create
   - Step-by-step implementation
   - Entity examples (C#)

6. **IMPLEMENTATION-CHECKLIST.md** - Progress tracking
   - Frontend status: 100% complete
   - Backend status: 0% (scaffolded, needs logic)
   - Feature-by-feature breakdown

### Backend Documentation (`/backend/docs/`)

1. **API.md** - Complete API specification
   - Authentication endpoints
   - Incident CRUD operations
   - User management
   - Categories and groups
   - Analytics endpoints
   - Error response format

2. **ARCHITECTURE.md** - .NET architecture
   - Clean Architecture layers
   - Repository & Unit of Work patterns
   - State machine for incidents
   - Database schema (SQL)
   - Azure infrastructure diagram
   - Security considerations

3. **DEPLOYMENT.md** - Azure deployment
   - Bicep infrastructure provisioning
   - GitHub Actions CI/CD
   - Database migrations
   - SSL/TLS setup
   - Monitoring configuration

4. **DEVELOPMENT.md** - VS2022 guide
   - Solution setup
   - Coding standards
   - Naming conventions
   - Feature development workflow
   - Testing patterns
   - Debugging tips
  
5. **AGENTIC-AI.md** - AI Orchestration Strategy
   - Semantic Kernel configuration
   - Native Plugins (C# tools for DB/Logs)
   - Semantic Plugins (Prompt engineering)
   - Agentic workflow for Incident Triage and RCA.

---

## Quick Navigation

### Starting a New Feature

1. **Frontend Component**: Start with [`docs/COMPONENTS.md`](docs/COMPONENTS.md)
2. **API Endpoint**: Reference [`backend/docs/API.md`](backend/docs/API.md)
3. **AI Capability**: Check [`backend/docs/AGENTIC-AI.md`](backend/docs/AGENTIC-AI.md)
4. **Backend Logic**: Follow [`backend/docs/DEVELOPMENT.md`](backend/docs/DEVELOPMENT.md)

### Deploying Changes

1. **Frontend**: [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md)
2. **Backend**: [`backend/docs/DEPLOYMENT.md`](backend/docs/DEPLOYMENT.md)

### Understanding the System

1. **Frontend Architecture**: [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md)
2. **Backend Architecture**: [`backend/docs/ARCHITECTURE.md`](backend/docs/ARCHITECTURE.md)
3. **API Contract**: [`docs/API-INTEGRATION.md`](docs/API-INTEGRATION.md) (frontend view) or [`backend/docs/API.md`](backend/docs/API.md) (backend view)

---

## Document Maintenance

| Document | Owner | Update Frequency |
|----------|-------|------------------|
| Frontend docs (`/docs/`) | Frontend Team | On component/feature changes |
| Backend docs (`/backend/docs/`) | Backend Team | On API/architecture changes |
| Implementation Checklist | Project Lead | Weekly |
| This Index | Any contributor | When adding new docs |

---

## Best Practices

1. **Keep docs close to code**: Frontend docs in `/docs/`, backend docs in `/backend/docs/`
2. **Update checklist**: Mark features complete in `IMPLEMENTATION-CHECKLIST.md`
3. **API changes**: Update both `API-INTEGRATION.md` (frontend) and `API.md` (backend)
4. **New components**: Document in `COMPONENTS.md`
5. **Architecture decisions**: Record in respective `ARCHITECTURE.md`

---

*Last Updated: April 2026*
