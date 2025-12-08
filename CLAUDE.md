# CLAUDE.md - AI Assistant Guide for Kaiser Linktree Admin

## Project Overview

**Project Name:** KaiserJasulyo - Linktree Admin Panel
**Type:** Next.js 14.2.5 Full-Stack Web Application
**Language:** TypeScript & JavaScript (German language UI)
**Primary Purpose:** Admin panel for managing a linktree-style service with dynamic content management

This is a modern Next.js application that provides a linktree-style homepage with an admin interface for content management. All content is managed through Directus CMS, making this a fully headless CMS-driven application.

---

## Technology Stack

### Core Framework
- **Next.js 14.2.5** - App Router architecture (not Pages Router)
- **React 18** - UI library with hooks
- **TypeScript 5** - Type-safe JavaScript
- **Node.js 18** - Runtime environment

### Styling & Animation
- **Tailwind CSS 3.4.1** - Utility-first CSS framework
- **Framer Motion 11.3.19** - Advanced animations
- **Tailwind Animate** - Additional animation utilities
- **PostCSS** - CSS processing

### State Management
- **Zustand** - Lightweight state management (auth token only)
- **React Hooks** - Local component state

### UI Libraries
- **Radix UI** - Accessible UI primitives (hover-card, label)
- **Tabler Icons** - Icon set
- **Lucide React** - Additional icons
- **React Icons** - Icon library
- **Class Variance Authority** - Component styling utilities

### Advanced Effects
- **Three.js & @react-three/fiber** - 3D rendering
- **TSParticles** - Particle effects
- **Cobe** - Globe components
- **Simplex Noise** - Procedural noise generation

### Backend Integration
- **Directus CMS** - Headless CMS (https://directus-1.nekozdevteam.eu)
- RESTful API with JWT authentication

### Development Tools
- **Prettier** - Code formatting (2 spaces, Tailwind plugin)
- **ESLint** - Code linting
- **Docker** - Containerization

---

## Codebase Structure

```
/home/user/kaiser/
├── app/                          # Next.js App Router (all pages)
│   ├── layout.tsx               # Root layout with ToastContainer & Footer
│   ├── page.tsx                 # Homepage - displays links from Directus
│   ├── globals.css              # Global Tailwind & custom styles
│   ├── admin/                   # Protected admin routes
│   │   ├── page.tsx            # Main admin dashboard
│   │   ├── header/page.tsx     # Header/title management
│   │   ├── links/page.tsx      # Links management
│   │   └── welcome/page.tsx    # Welcome message management
│   ├── login/page.tsx          # Authentication page
│   ├── impressum/page.tsx      # Legal page (dynamic block content)
│   └── bildergalerie/page.tsx  # Image gallery
│
├── components/
│   ├── ui/                      # Reusable animation components
│   │   ├── background-beams.tsx      # Animated background effect
│   │   ├── shooting-stars.tsx        # Shooting stars animation
│   │   ├── stars-background.tsx      # Static stars
│   │   ├── moving-border.tsx         # Animated border component
│   │   ├── parallax-scroll.tsx       # Parallax scrolling
│   │   └── spinner.jsx              # Loading spinner
│   │
│   ├── ui_self/                 # Business/domain components
│   │   ├── header.jsx          # Homepage header with gradient
│   │   ├── button.jsx          # Link button with gold styling
│   │   ├── HeaderForm.tsx      # Form for editing header
│   │   ├── HeaderTable.tsx     # Table for headers
│   │   ├── LinkForm.tsx        # Form for links
│   │   ├── LinkTable.tsx       # Table for links
│   │   ├── WelcomeForm.tsx     # Form for welcome message
│   │   ├── WelcomeTable.tsx    # Table for welcome messages
│   │   ├── Modal.jsx           # Modal component
│   │   └── dropdown.tsx        # Admin navigation dropdown
│   │
│   └── footer.js               # Footer with copyright & impressum
│
├── lib/                         # Utilities & configuration
│   ├── config.js               # Directus API config & models
│   ├── state.ts                # Zustand auth store
│   └── utils.ts                # API service functions (CRUD)
│
├── types/
│   └── directus.d.ts           # TypeScript interfaces
│
├── public/
│   ├── Website.mp4             # Background video
│   └── Mod_fam_galaxy.webp     # Galaxy image
│
└── Configuration Files:
    ├── package.json
    ├── tsconfig.json
    ├── next.config.mjs
    ├── tailwind.config.js
    ├── components.json
    ├── postcss.config.mjs
    ├── Dockerfile
    └── .prettierrc
```

---

## Key Files Reference

### Application Entry Points
- `/app/page.tsx` - Homepage (public-facing linktree)
- `/app/login/page.tsx` - Authentication
- `/app/admin/page.tsx` - Admin dashboard (protected)
- `/app/layout.tsx` - Root layout wrapper

### Core Configuration
- `/lib/config.js` - Directus API URL and model names
- `/lib/state.ts` - Global authentication state (Zustand)
- `/lib/utils.ts` - All API service functions for CRUD operations
- `/types/directus.d.ts` - TypeScript type definitions

### Styling
- `/app/globals.css` - Global styles and CSS variables
- `/tailwind.config.js` - Tailwind theme configuration
- `/.prettierrc` - Code formatting rules (2 spaces, Tailwind plugin)

---

## Directus CMS Integration

### API Configuration
- **Base URL:** `https://directus-1.nekozdevteam.eu`
- **Authentication:** JWT Bearer tokens
- **Location:** `/lib/config.js`

### Data Models (Collections)
```javascript
MODELS = {
  HEADER: "Header_Kaiser",        // Homepage title
  LINKS: "Links_Kaiser",          // Linktree buttons
  WELCOME: "Welcome_Kaiser",      // Welcome message
  IMPRESSUM: "impressum_kaiser",  // Legal content blocks
  BILDERGALERIE: "Bildergalerie"  // Image gallery
}
```

### TypeScript Interfaces
All Directus models have corresponding TypeScript interfaces in `/types/directus.d.ts`:
- `HeaderMessageData` - { id?, ueberschrift }
- `LinkData` - { id?, url, title }
- `WelcomeMessageData` - { id?, welcome }
- `impressumData` - { id, content_blocks: ContentBlocks }
- `bieldergalerieData` - { id, sort, picture }
- `BlockEditorData` - Block editor content structure

---

## Authentication & State Management

### Authentication Flow
1. User submits credentials at `/app/login/page.tsx`
2. `directusLogin()` function posts to Directus `/auth/login` endpoint
3. Access token stored in:
   - `localStorage` (key: `directus_token`)
   - Zustand store (`useUserStore`)
4. Protected routes check token existence and redirect to `/login` if missing
5. All API calls use token from Zustand store via `getAuthHeaders()`

### State Management Pattern
```typescript
// Zustand store (/lib/state.ts)
interface UserState {
  token: string | null;
  setToken: (token: string) => void;
  logout: () => void;
}

// Usage in components
const token = useUserStore((state) => state.token);
const setToken = useUserStore((state) => state.setToken);
const logout = useUserStore((state) => state.logout);
```

### Token Hydration Pattern
Protected routes use this pattern to prevent SSR/client mismatches:
```typescript
const [isClient, setIsClient] = useState(false);
useEffect(() => setIsClient(true), []);

useEffect(() => {
  if (isClient && !token) {
    router.push('/login');
  }
}, [isClient, token, router]);
```

---

## Code Conventions & Patterns

### File Naming
- **Components:** PascalCase (`.tsx` for TypeScript, `.jsx` for JavaScript)
- **Pages:** `page.tsx` (Next.js App Router convention)
- **Utilities:** camelCase (`.ts` files)
- **Styles:** `globals.css`, kebab-case for custom CSS files

### Component Structure
```typescript
"use client"; // Required for client-side interactivity

import { useState, useEffect } from "react";
import { ComponentProps } from "@/types/...";

export default function ComponentName() {
  const [state, setState] = useState<Type>(initialValue);

  useEffect(() => {
    // Side effects
  }, [dependencies]);

  return (
    <div className="tailwind classes">
      {/* JSX */}
    </div>
  );
}
```

### API Service Pattern (lib/utils.ts)
All CRUD operations follow this pattern:
```typescript
export const fetchItems = async (): Promise<ItemType[]> => {
  try {
    const response = await fetch(`${DIRECTUS_URL}/items/${MODELS.ITEM}`, {
      headers: getAuthHeaders(),
    });
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching items:', error);
    throw error;
  }
};
```

### Error Handling
- **Try-catch blocks** for all async operations
- **Console.error** for logging
- **React Toastify** for user notifications
- Error state in components: `const [error, setError] = useState<string | null>(null);`

### Data Fetching Pattern
```typescript
useEffect(() => {
  async function fetchData() {
    try {
      const response = await fetch(`${DIRECTUS_URL}/items/${MODELS.ITEM}`);
      const data = await response.json();
      setState(data.data);
    } catch (err) {
      console.error("Error:", err);
      setError("Error message");
    } finally {
      setLoading(false);
    }
  }
  fetchData();
}, []);
```

### Loading States
```typescript
if (loading) {
  return <Spinner />;
}
```

---

## Styling Guidelines

### Tailwind CSS Patterns
- **Mobile-first:** Use responsive prefixes (`md:`, `lg:`)
- **Utility classes:** Prefer utilities over custom CSS
- **Class merging:** Use `cn()` utility from `/lib/utils.ts`
  ```typescript
  import { cn } from "@/lib/utils";
  className={cn("base-classes", conditionalClass && "added-class")}
  ```

### Color Scheme
- **Background:** Gray/dark tones (`bg-gray-800`)
- **Text:** Light gray (`text-gray-200`)
- **Accents:** Gold/yellow gradients
- **Buttons:** Gold gradient with hover effects

### Animation Patterns
```typescript
// Framer Motion
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.5 }}
>
  {children}
</motion.div>
```

### Custom CSS Variables
Defined in `/app/globals.css`:
```css
:root {
  --variable-name: value;
}
```

---

## Component Architecture

### Component Categories

1. **Page Components** (`/app/**`)
   - Server or client components
   - Data fetching and routing
   - Use `"use client"` directive when needed

2. **UI Components** (`/components/ui/`)
   - Reusable animation/effect components
   - No business logic
   - Highly configurable via props

3. **Business Components** (`/components/ui_self/`)
   - Domain-specific logic
   - CRUD operations
   - Form validation and submission

### Form Components Pattern
Each entity has paired components:
- `[Entity]Form.tsx` - Add/edit functionality
- `[Entity]Table.tsx` - Display and manage items

Example: `LinkForm.tsx` + `LinkTable.tsx`

### Modal Pattern
```typescript
const [isModalOpen, setIsModalOpen] = useState(false);

<Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
  <FormComponent />
</Modal>
```

---

## Development Workflow

### Setup & Installation
```bash
npm install              # Install dependencies
npm run dev             # Start development server (uses server.js)
npm run build           # Production build
npm start               # Production server
npm run lint            # Run ESLint
```

### Development Server
- **Port:** 3000
- **Custom server:** Uses `server.js` (not standard Next.js dev)
- **Hot reload:** Enabled for all changes

### Code Formatting
```bash
# Prettier is configured with:
- 2 spaces for indentation
- No tabs
- Tailwind CSS plugin for class sorting
```

### TypeScript Configuration
- **Strict mode:** Enabled
- **Path alias:** `@/*` maps to `./*`
- **Module resolution:** Bundler
- **JSX:** Preserve (Next.js handles transformation)

---

## Build & Deployment

### Docker Deployment
Multi-stage Dockerfile:
```dockerfile
# Stage 1: Build
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Production
FROM node:18-alpine AS runner
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
EXPOSE 3000
CMD ["npm", "start"]
```

### Environment Considerations
- **Directus URL** is hardcoded in `/lib/config.js`
- No environment variables currently used
- Consider adding `.env` for API URL configuration

### Image Configuration
Next.js image domains (in `next.config.mjs`):
- `images.unsplash.com`
- `directus-1.nekozdevteam.eu`

---

## Common Development Tasks

### Adding a New Link (Manual Testing)
1. Navigate to `/admin/links`
2. Use LinkForm to add title and URL
3. Submit form
4. View updated list in LinkTable
5. Check homepage for new button

### Creating a New Data Model
1. Add model name to `/lib/config.js` MODELS
2. Create TypeScript interface in `/types/directus.d.ts`
3. Add CRUD functions in `/lib/utils.ts`
4. Create Form and Table components
5. Create admin page in `/app/admin/[model]/page.tsx`

### Adding a New UI Component
1. Create component file in `/components/ui/` or `/components/ui_self/`
2. Use TypeScript for type safety
3. Export as default or named export
4. Import where needed with `@/components/...`

### Modifying Styles
1. **Global changes:** Edit `/app/globals.css`
2. **Theme colors:** Modify `/tailwind.config.js`
3. **Component styles:** Use Tailwind utilities in className
4. **Animations:** Use Framer Motion or CSS animations

---

## Important Notes for AI Assistants

### Language Considerations
- **UI Language:** German (labels, messages, error text)
- **Code comments:** Mixed German/English
- **Variable names:** Often German (`ueberschrift`, `bildergalerie`)
- When adding UI text, use German by default unless specified otherwise

### Authentication Requirements
- **All admin routes** require authentication
- Check for token before accessing protected pages
- Redirect to `/login` if token is missing
- Token is stored in both localStorage and Zustand

### API Patterns to Follow
1. Always use `getAuthHeaders()` for authenticated requests
2. All API calls should have try-catch error handling
3. Show toast notifications for user feedback
4. Log errors to console for debugging
5. Return data.data from Directus responses (nested structure)

### Component Patterns to Follow
1. Use `"use client"` directive for interactive components
2. Implement loading states with `<Spinner />`
3. Handle errors gracefully with error messages
4. Use TypeScript interfaces from `/types/directus.d.ts`
5. Follow existing Form + Table component pattern

### Styling Best Practices
1. **Always use Tailwind utilities** - avoid writing custom CSS
2. Use `cn()` utility for conditional classes
3. Maintain responsive design with `md:` and `lg:` prefixes
4. Keep animations subtle with Framer Motion
5. Follow existing color scheme (dark bg, light text, gold accents)

### File Organization
1. **Pages:** `/app/[route]/page.tsx`
2. **Business logic components:** `/components/ui_self/`
3. **Reusable UI:** `/components/ui/`
4. **API services:** `/lib/utils.ts`
5. **Types:** `/types/directus.d.ts`

### State Management Guidelines
1. **Global state:** Only authentication token (Zustand)
2. **Local state:** Use React hooks (useState, useEffect)
3. **No Redux or complex state management**
4. Keep state close to where it's used

### Testing API Changes
1. Check Directus CMS for data structure
2. Verify API endpoints manually if needed
3. Test authentication flow completely
4. Verify token persistence across page refreshes

### Common Pitfalls to Avoid
1. **Don't forget `"use client"`** for interactive components
2. **Don't skip error handling** in async operations
3. **Don't use localStorage directly** - use Zustand store
4. **Don't create custom CSS** - use Tailwind
5. **Don't hardcode data** - fetch from Directus
6. **Don't skip TypeScript types** - always define interfaces
7. **Don't forget mobile responsiveness** - test responsive classes

### Code Quality Standards
1. **Format code** with Prettier (2 spaces)
2. **Use TypeScript** for type safety
3. **Follow existing naming conventions**
4. **Comment complex logic** (in English or German)
5. **Keep components focused** - single responsibility
6. **Reuse existing components** when possible

### Security Considerations
1. **Never expose tokens** in client-side code beyond necessary
2. **Validate data** before sending to API
3. **Sanitize user input** in forms
4. **Use HTTPS** for all API calls (already configured)
5. **Check authentication** on all protected routes

---

## Quick Reference

### Import Aliases
```typescript
import { Component } from "@/components/..."    // Absolute imports
import { utility } from "@/lib/..."             // Library utilities
import { Type } from "@/types/..."              // Type definitions
```

### Common Imports
```typescript
// React
import { useState, useEffect } from "react";

// Next.js
import { useRouter } from "next/navigation";

// State
import useUserStore from "@/lib/state";

// API
import { DIRECTUS_URL, MODELS } from "@/lib/config";

// Utils
import { cn } from "@/lib/utils";

// Animation
import { motion } from "framer-motion";

// UI
import Spinner from "@/components/ui/spinner";
```

### Directus API Endpoints
```
GET    /items/[collection]           # Fetch all
GET    /items/[collection]/[id]      # Fetch one
POST   /items/[collection]           # Create
PATCH  /items/[collection]/[id]      # Update
DELETE /items/[collection]/[id]      # Delete
POST   /auth/login                   # Login
```

### File Path Patterns
```
Pages:      /app/[route]/page.tsx
Components: /components/[category]/[name].tsx
Utils:      /lib/[utility].ts
Types:      /types/[model].d.ts
Styles:     /app/globals.css
Config:     /[config-name].config.[js|mjs|ts]
```

---

## Development Checklist

When making changes, ensure:
- [ ] TypeScript types are defined
- [ ] Error handling is implemented
- [ ] Loading states are shown
- [ ] Toast notifications provide feedback
- [ ] Authentication is checked (if protected route)
- [ ] Code is formatted with Prettier
- [ ] Tailwind utilities are used (no custom CSS)
- [ ] Mobile responsiveness is maintained
- [ ] German language is used for UI text
- [ ] Changes are tested in development mode

---

## Resources

### Official Documentation
- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Framer Motion](https://www.framer.com/motion/)
- [Directus Docs](https://docs.directus.io)

### Project-Specific
- **Directus API:** https://directus-1.nekozdevteam.eu
- **Local Dev:** http://localhost:3000
- **Production Port:** 3000 (Docker)

---

## Version Information

- **Next.js:** 14.2.5
- **React:** 18
- **TypeScript:** 5
- **Node.js:** 18 (Alpine for Docker)
- **Tailwind CSS:** 3.4.1
- **Framer Motion:** 11.3.19

Last updated: 2025-12-08
