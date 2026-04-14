# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start dev server (localhost:3000)
npm run build      # Production build
npm run start      # Start production server
npm run lint       # ESLint with auto-fix
npm run format     # Prettier format
```

There are no tests configured in this project.

## Architecture

This is a **Next.js 14 (App Router) frontend** that communicates with a **separate backend API**. The backend URL is configured via `NEXT_PUBLIC_BACKEND_URL`. There is no database or server-side logic in this repo.

### Key environment variables
- `NEXT_PUBLIC_BACKEND_URL` — base URL for all API calls

### Request flow
- All API calls go through the axios instance at `src/lib/axios.ts` (sets `baseURL`, `withCredentials: true`)
- Auth uses **cookie-based JWT**: `access_token` + `refresh_token` HttpOnly cookies set by the backend
- `src/middleware.ts` guards `/dashboard/:path*`: redirects to `/api/auth/refresh` if only a refresh token exists, or `/auth` if both are missing
- `src/app/api/auth/refresh/route.ts` proxies the refresh call to the backend and forwards the `Set-Cookie` header back to the browser

### Feature-based structure

`src/features/` organizes code by domain. Each feature follows this pattern:
```
src/features/<domain>/
  components/   # UI components for this feature
  hooks/        # React Query hooks (useGet*, use*Mutations)
  types.ts      # TypeScript interfaces/types
```

Current features: `authentication`, `contacts`, `emails` (with sub-features `templates` and `records`), `files`.

### State management
- **Server state**: TanStack React Query (`src/lib/queryClient.ts`)
- **Auth state**: `AuthContext` (`src/context/AuthContext.tsx`) — wraps React Query mutations for login/logout and a query for the current user
- Global providers in `src/components/Providers.tsx`: `QueryClientProvider` → `AuthProvider`
- Dashboard layout (`src/app/(main)/(pages)/dashboard/layout.tsx`) adds `NavigationProvider` + shadcn `SidebarProvider`

### API layer
`src/api/` contains plain async functions (one file per domain: `auth.ts`, `email.ts`, `emailTemplates.ts`, `contact.ts`, `companies.ts`) that call the axios instance. These are consumed by React Query hooks in `src/features/`.

All backend responses follow the shape:
```ts
interface ResponseBody<T> { success: boolean; message: string; data?: T; }
```

### UI components
- `src/components/ui/` — shadcn/ui generated components (do not hand-edit; regenerate via shadcn CLI)
- `src/components/` — shared app-level components (`CRMSidebar`, `Navbar`, `Providers`, etc.)
- `src/imports/` — barrel re-exports for Next.js and shadcn to keep imports tidy

### Email template placeholders
Templates use `{{placeholder}}` syntax. Typing `{{` in the subject or body field opens a picker. The `PlaceHolders` enum (`src/features/emails/templates/types.ts`) defines all valid placeholders (contact fields + `internshipLink`, `resumeLink`, `coverLetterLink`, `jobRole`). When link placeholders are present, the `EmailComposer` dynamically shows required link input fields before sending.

### Enums and constants
- `src/enums/enums.ts` — `GenderEnum`, `PositionTypeEnum`, `FilterTypeEnum`
- `src/utils/constants.ts` — position type display mappings
