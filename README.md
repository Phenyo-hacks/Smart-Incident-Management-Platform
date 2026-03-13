# Smart Incident Management Platform (SIMP) - Frontend

> **Learning Project**: This codebase is extensively commented to help you understand
> every aspect of building an enterprise React/Next.js application.

---

## Quick Links

| Document | Description |
|----------|-------------|
| [DOCS-INDEX.md](DOCS-INDEX.md) | **Master documentation index (start here)** |
| [ARCHITECTURE.md](docs/ARCHITECTURE.md) | Frontend architecture patterns and decisions |
| [API-INTEGRATION.md](docs/API-INTEGRATION.md) | How to connect to your .NET backend |
| [COMPONENTS.md](docs/COMPONENTS.md) | Component library documentation |
| [DEPLOYMENT.md](docs/DEPLOYMENT.md) | Deployment guides (Vercel, Azure, Docker) |
| [BACKEND-SCAFFOLD.md](docs/BACKEND-SCAFFOLD.md) | What to build in VS2022 |
| [IMPLEMENTATION-CHECKLIST.md](docs/IMPLEMENTATION-CHECKLIST.md) | Progress tracking |

### Backend Documentation

| Document | Description |
|----------|-------------|
| [backend/README.md](backend/README.md) | .NET backend project overview |
| [backend/docs/API.md](backend/docs/API.md) | REST API specification |
| [backend/docs/ARCHITECTURE.md](backend/docs/ARCHITECTURE.md) | .NET Clean Architecture |
| [backend/docs/DEPLOYMENT.md](backend/docs/DEPLOYMENT.md) | Azure deployment guide |
| [backend/docs/DEVELOPMENT.md](backend/docs/DEVELOPMENT.md) | VS2022 development guide |

---

## Architecture Overview

This project uses a **hybrid development approach**:

```
+------------------+          +------------------+
|    Frontend      |          |     Backend      |
|  (This Project)  |   <-->   |  (.NET Project)  |
+------------------+          +------------------+
       |                              |
   Frontend                       Backend
   - React/Next.js                - ASP.NET Core 8
   - TypeScript                   - C# / Entity Framework
   - Tailwind CSS                 - SQL Server
   - UI Components                - Azure Services
   - API Client                   - Business Logic
```

### Frontend (This Project)
- Complete frontend UI scaffolding
- TypeScript type definitions matching your domain
- API client ready to connect to your backend
- Reusable component library
- Responsive design with your color palette

### Backend (.NET Project in VS2022)
- Domain entities and business logic
- Database with Entity Framework Core
- REST API controllers
- Authentication (Azure AD / JWT)
- Azure service integrations

---

## Project Structure

```
simp-frontend/
├── app/                              # Next.js App Router (pages)
│   ├── (auth)/                       # Auth routes (login, etc.)
│   │   └── login/page.tsx            # Login page
│   ├── (dashboard)/                  # Protected routes (require auth)
│   │   ├── layout.tsx                # Dashboard layout with sidebar
│   │   ├── dashboard/page.tsx        # Main dashboard
│   │   ├── incidents/                # Incident management
│   │   │   ├── page.tsx              # List all incidents
│   │   │   ├── [id]/page.tsx         # View single incident
│   │   │   └── new/page.tsx          # Create incident
│   │   ├── analytics/                # Analytics & reporting
│   │   │   ├── page.tsx              # Analytics overview
│   │   │   ├── sla/page.tsx          # SLA compliance
│   │   │   └── performance/page.tsx  # Agent performance
│   │   ├── admin/                    # Administration
│   │   │   ├── users/page.tsx        # User management
│   │   │   ├── categories/page.tsx   # Category management
│   │   │   ├── groups/page.tsx       # Support groups
│   │   │   ├── sla/page.tsx          # SLA policies
│   │   │   ├── routing/page.tsx      # Routing rules
│   │   │   └── roles/page.tsx        # Roles & permissions
│   │   ├── profile/page.tsx          # User profile
│   │   ├── notifications/page.tsx    # Notifications center
│   │   └── settings/page.tsx         # User settings
│   ├── layout.tsx                    # Root layout
│   ├── page.tsx                      # Entry point (redirects)
│   └── globals.css                   # Global styles + theme
│
├── components/                       # Reusable React components
│   ├── layout/                       # Layout components
│   │   ├── app-sidebar.tsx           # Main navigation
│   │   └── app-header.tsx            # Top header
│   ├── dashboard/                    # Dashboard widgets
│   ├── incidents/                    # Incident components
│   ├── analytics/                    # Analytics components
│   ├── admin/                        # Admin components
│   ├── providers.tsx                 # Context providers (auth, theme)
│   └── ui/                           # shadcn/ui base components
│
├── lib/                              # Utilities and services
│   ├── api/                          # API integration layer
│   │   ├── client.ts                 # HTTP client with auth
│   │   └── services.ts               # API service functions
│   ├── auth/                         # Authentication
│   │   └── auth-context.tsx          # Auth state management
│   └── hooks/                        # Custom React hooks
│       ├── use-incidents.ts          # Incident data hooks
│       ├── use-analytics.ts          # Analytics hooks
│       └── use-data.ts               # Generic data hooks
│
├── types/                            # TypeScript definitions
│   └── domain.ts                     # Domain model types
│
├── docs/                             # Documentation
│   ├── ARCHITECTURE.md               # Architecture guide
│   ├── API-INTEGRATION.md            # Backend integration
│   ├── COMPONENTS.md                 # Component docs
│   ├── DEPLOYMENT.md                 # Deployment guide
│   ├── BACKEND-SCAFFOLD.md           # VS2022 backend guide
│   └── IMPLEMENTATION-CHECKLIST.md   # Progress tracker
│
└── public/                           # Static assets
    └── images/                       # Image assets
```

---

## Understanding the Code

### Key Concepts

#### 1. Route Groups in Next.js
```
app/
├── (auth)/       # Routes WITHOUT dashboard layout
│   └── login/    # -> /login
└── (dashboard)/  # Routes WITH dashboard layout
    ├── dashboard/    # -> /dashboard
    └── incidents/    # -> /incidents
```
The parentheses `()` create route groups - they affect the layout but NOT the URL.

#### 2. TypeScript Types
All our domain types are in `types/domain.ts`. They match your .NET backend:
```typescript
// Frontend (TypeScript)          // Backend (C#)
interface Incident {              public class Incident {
  id: string;                         public Guid Id { get; set; }
  title: string;                      public string Title { get; set; }
  status: IncidentStatus;             public IncidentStatus Status { get; set; }
}                                 }
```

#### 3. API Integration Pattern
```typescript
// 1. Types define the shape
interface Incident { ... }

// 2. API client handles HTTP
const client = new ApiClient();

// 3. Services provide methods
const incidents = await incidentService.getAll();

// 4. Hooks manage state
const { data, error, isLoading } = useIncidents();

// 5. Components render UI
<IncidentList incidents={data} />
```

---

## Color Palette

We use a purple/mauve enterprise theme:

| Name | Hex | CSS Variable | Usage |
|------|-----|--------------|-------|
| Deep Purple | `#5B3765` | `--primary` | Primary buttons, actions |
| Purple Mauve | `#9E6899` | `--accent` | Accents, secondary actions |
| Mauve | `#BA88AE` | `--ring` | Focus rings, highlights |
| Dusty Rose | `#D6A8C4` | `--muted` | Muted text, subtle elements |
| Light Pink | `#F3CCDE` | `--secondary` | Backgrounds, cards |

---

## Getting Started

### Prerequisites
- Node.js 20+
- pnpm (`npm install -g pnpm`)

### Installation

```bash
# 1. Install dependencies
pnpm install

# 2. Create environment file
cp .env.example .env.local

# 3. Edit .env.local with your backend URL
NEXT_PUBLIC_API_URL=https://localhost:5001/api

# 4. Start development server
pnpm dev

# 5. Open http://localhost:3000
```

### Development Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start dev server with hot reload |
| `pnpm build` | Build for production |
| `pnpm start` | Run production build |
| `pnpm lint` | Run ESLint |
| `pnpm type-check` | Check TypeScript types |

---

## Next Steps

1. **Explore the Frontend**: Click through all pages in the browser
2. **Read the Components**: Check `components/` with all the comments
3. **Set Up VS2022**: Follow [BACKEND-SCAFFOLD.md](docs/BACKEND-SCAFFOLD.md)
4. **Connect the Dots**: Use [API-INTEGRATION.md](docs/API-INTEGRATION.md)

---

## Support

This is a learning project. Key files to study:

| File | What You'll Learn |
|------|-------------------|
| `types/domain.ts` | TypeScript interfaces, enums |
| `lib/api/client.ts` | HTTP client, authentication |
| `lib/auth/auth-context.tsx` | React Context, state management |
| `components/incidents/incident-list.tsx` | Data tables, filtering |
| `app/(dashboard)/layout.tsx` | Layout patterns, route groups |

---

**Happy Learning!** Remember: every expert was once a beginner.
