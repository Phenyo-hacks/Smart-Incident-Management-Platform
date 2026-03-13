# Deployment Guide

**Document Version:** 1.0  
**Last Updated:** 2024  
**Status:** Active

## Overview

This guide covers deploying the SIMP frontend to various environments.

## Deployment Options

| Platform | Recommended For | Features |
|----------|-----------------|----------|
| Vercel | Production | Auto CI/CD, Edge Network, Preview Deployments |
| Azure Static Web Apps | Enterprise | Azure integration, AD auth |
| Docker | Self-hosted | Full control, on-premises |
| AWS Amplify | AWS ecosystem | CloudFront CDN, Lambda@Edge |

---

## Vercel Deployment (Recommended)

### Quick Deploy

1. **Push to GitHub**
   ```bash
   git push origin main
   ```

2. **Import in Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your repository
   - Configure environment variables

3. **Configure Environment Variables**
   ```
   NEXT_PUBLIC_API_URL=https://your-api.azurewebsites.net/api
   ```

4. **Deploy**
   - Vercel automatically builds and deploys

### Preview Deployments

Every pull request gets a unique preview URL:
```
https://simp-frontend-git-feature-xyz-team.vercel.app
```

### Production Configuration

**vercel.json:**
```json
{
  "buildCommand": "pnpm build",
  "devCommand": "pnpm dev",
  "installCommand": "pnpm install",
  "framework": "nextjs",
  "regions": ["iad1", "sfo1"],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
```

---

## Azure Static Web Apps

### Prerequisites

- Azure subscription
- Azure CLI installed
- GitHub repository

### Setup

1. **Create Static Web App**
   ```bash
   az staticwebapp create \
     --name simp-frontend \
     --resource-group simp-rg \
     --source https://github.com/your-org/simp-frontend \
     --location "East US 2" \
     --branch main \
     --app-location "/" \
     --output-location ".next" \
     --login-with-github
   ```

2. **Configure Build**

   **staticwebapp.config.json:**
   ```json
   {
     "navigationFallback": {
       "rewrite": "/index.html"
     },
     "routes": [
       {
         "route": "/api/*",
         "allowedRoles": ["authenticated"]
       }
     ],
     "responseOverrides": {
       "401": {
         "redirect": "/.auth/login/aad"
       }
     }
   }
   ```

3. **Set Environment Variables**
   ```bash
   az staticwebapp appsettings set \
     --name simp-frontend \
     --setting-names NEXT_PUBLIC_API_URL=https://api.example.com
   ```

---

## Docker Deployment

### Dockerfile

```dockerfile
# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Install dependencies
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Copy source
COPY . .

# Build
ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm build

# Production stage
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built files
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
```

### Docker Compose

```yaml
version: '3.8'

services:
  frontend:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://backend:5000/api
    depends_on:
      - backend

  backend:
    image: your-backend-image
    ports:
      - "5000:5000"
```

### Build and Run

```bash
# Build image
docker build -t simp-frontend .

# Run container
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_API_URL=https://api.example.com \
  simp-frontend
```

---

## Environment Configuration

### Environment Variables by Stage

| Variable | Development | Staging | Production |
|----------|-------------|---------|------------|
| `NEXT_PUBLIC_API_URL` | `http://localhost:5000` | `https://api-staging.example.com` | `https://api.example.com` |
| `NEXT_PUBLIC_ENABLE_MOCK` | `true` | `false` | `false` |
| `NEXT_PUBLIC_LOG_LEVEL` | `debug` | `info` | `error` |

### Build-time vs Runtime Variables

**Build-time** (NEXT_PUBLIC_*):
- Embedded during `next build`
- Cannot be changed after build
- Available in browser

**Runtime** (server-side):
- Read at runtime
- Can be changed without rebuild
- Only available in API routes/server components

---

## CI/CD Pipeline

### GitHub Actions

**.github/workflows/deploy.yml:**
```yaml
name: Deploy

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - uses: pnpm/action-setup@v2
        with:
          version: 8
          
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'
          
      - name: Install dependencies
        run: pnpm install --frozen-lockfile
        
      - name: Lint
        run: pnpm lint
        
      - name: Type check
        run: pnpm type-check
        
      - name: Build
        run: pnpm build
        env:
          NEXT_PUBLIC_API_URL: ${{ vars.API_URL }}
          
      - name: Deploy to Vercel
        if: github.ref == 'refs/heads/main'
        run: vercel --prod --token=${{ secrets.VERCEL_TOKEN }}
```

---

## Performance Optimization

### Build Optimization

```javascript
// next.config.mjs
export default {
  output: 'standalone',
  images: {
    domains: ['api.example.com'],
    formats: ['image/avif', 'image/webp'],
  },
  experimental: {
    optimizeCss: true,
  },
};
```

### Caching Headers

```javascript
// next.config.mjs
export default {
  async headers() {
    return [
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};
```

---

## Monitoring

### Vercel Analytics

```bash
pnpm add @vercel/analytics
```

```typescript
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

### Error Tracking (Sentry)

```bash
pnpm add @sentry/nextjs
```

```javascript
// sentry.client.config.ts
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1,
});
```

---

## Troubleshooting

### Common Issues

**Build fails with memory error:**
```bash
NODE_OPTIONS=--max_old_space_size=4096 pnpm build
```

**API connection refused:**
- Check CORS configuration on backend
- Verify API URL includes `/api` path
- Check network connectivity

**Assets not loading:**
- Verify `basePath` in next.config.mjs
- Check asset prefix configuration
- Ensure CDN is properly configured

### Health Check

Add a health endpoint:

```typescript
// app/api/health/route.ts
export async function GET() {
  return Response.json({
    status: 'healthy',
    version: process.env.npm_package_version,
    timestamp: new Date().toISOString(),
  });
}
```
