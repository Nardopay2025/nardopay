# Lovable Repository Scan Report
**Generated:** 2025-10-07  
**Repository:** NardoPay (Vite + React + TypeScript + Tailwind + shadcn-ui)

---

## 1. Project Structure & Root

**Project Root:** `/` (repository root)  
**Framework:** Vite 5.4.1 + React 18.3.1 + TypeScript 5.5.3 + Tailwind CSS 3.4.11 + shadcn-ui

**Key Files Detected:**
- `package.json` ✅
- `vite.config.ts` ✅
- `tsconfig.json` ✅
- `tailwind.config.ts` ✅
- `index.html` ✅
- `netlify.toml` ✅
- `src/` directory ✅
- `public/` directory ✅
- `supabase/` directory (edge functions) ✅

**Top 15 Tracked Files:**
1. `src/App.tsx` - Main routing and providers
2. `src/main.tsx` - React entry point
3. `src/index.css` - Global styles & design tokens
4. `src/pages/Index.tsx` - Landing page
5. `src/pages/Dashboard.tsx` - User dashboard
6. `src/pages/admin/Dashboard.tsx` - Admin panel
7. `src/contexts/AuthContext.tsx` - Authentication context
8. `src/hooks/useAdminAuth.tsx` - Admin auth hook
9. `src/integrations/supabase/client.ts` - Supabase client
10. `vite.config.ts` - Vite configuration
11. `netlify.toml` - Netlify deployment config
12. `tailwind.config.ts` - Tailwind design system
13. `package.json` - Dependencies & scripts
14. `.env` - Environment variables (contains Supabase keys)
15. `supabase/functions/` - Edge functions directory

---

## 2. Build Configuration

**Package.json Scripts:**
```json
{
  "dev": "vite",
  "build": "vite build",
  "build:dev": "vite build --mode development",
  "lint": "eslint .",
  "preview": "vite preview"
}
```

**✅ Lovable Dev Command:** `vite` (mapped to `npm run dev`)

**Vite Config Status:**
- ✅ Port: 8080
- ✅ Host: `::`
- ✅ React SWC plugin enabled
- ✅ Path alias: `@` → `./src`
- ✅ Code splitting configured (vendor, router, ui chunks)
- ✅ Source maps: disabled in production

**TypeScript Config Status:**
- ⚠️ Strict mode: DISABLED (`strictNullChecks: false`, `noImplicitAny: false`)
- ✅ Path mapping configured
- ⚠️ Unused parameters/locals checks: DISABLED

---

## 3. Environment Variables & Secrets

**Environment Variables Detected:**
```
VITE_SUPABASE_PROJECT_ID="mczqwqsvumfsneoknlep"
VITE_SUPABASE_PUBLISHABLE_KEY="eyJhbGci..."
VITE_SUPABASE_URL="https://mczqwqsvumfsneoknlep.supabase.co"
```

**⚠️ CRITICAL ISSUE:**
- **Hard-coded Supabase credentials** in:
  - `.env` (should NOT be committed to git)
  - `src/integrations/supabase/client.ts` (hardcoded, NOT using env vars)

**Required Env Vars Checklist for Lovable:**
- [ ] `VITE_SUPABASE_URL` (currently hardcoded)
- [ ] `VITE_SUPABASE_PUBLISHABLE_KEY` (currently hardcoded)

---

## 4. Deployment Configuration

**Netlify Config (netlify.toml):**
- ✅ Build command: `npm run build`
- ✅ Publish directory: `dist`
- ✅ SPA redirects configured (`/* → /index.html`)
- ✅ Security headers configured
- ⚠️ **Missing:** Environment variables in Netlify dashboard

**Public Folder:**
- ✅ `_redirects` configured for SPA routing
- ✅ Favicons present
- ✅ `robots.txt` configured

---

## 5. TypeScript Errors & Issues

### ❌ CRITICAL ERROR #1: Admin Auth Hook Type Error
**File:** `src/hooks/useAdminAuth.tsx:33`  
**Error:** Type assertion `(profile as any).role` bypasses type safety  
**Diagnosis:** The `profiles` table schema doesn't define a `role` field in TypeScript types, causing unsafe type casting.  
**Impact:** Runtime errors if profile structure changes; admin auth may fail silently.

### ⚠️ WARNING #2: Hardcoded Supabase Credentials
**File:** `src/integrations/supabase/client.ts:5-6`  
**Issue:** Credentials are hardcoded instead of using env variables  
**Diagnosis:** Should use `import.meta.env.VITE_SUPABASE_URL` pattern  
**Impact:** Cannot change credentials without code changes; security risk if repo is public.

### ⚠️ WARNING #3: Missing `/admin` Route
**File:** `src/App.tsx`  
**Issue:** Admin dashboard exists at `src/pages/admin/Dashboard.tsx` but no `/admin` route configured  
**Current Access:** Direct navigation to `/admin` returns 404  
**Impact:** Admin panel not accessible via standard routing.

### ⚠️ WARNING #4: Unsafe Type Casting
**Files:** Multiple files use `as any` casting  
**Impact:** Bypasses TypeScript safety, potential runtime errors

---

## 6. Git & Version Control

**Current Branch:** (not detectable from static scan)  
**Recommended Branch for Lovable:** `main`

**Git Status:**
- ✅ `.gitignore` configured
- ⚠️ `.env` file likely committed (SECURITY RISK)

---

## 7. Lovable Preview Status

### Issue: Slow Preview Link + Shows Dummy Page

**Root Cause Analysis:**

1. **Build Cache Issue:** 
   - Lovable may be serving a cached version of the old dummy build
   - The live preview link rebuilds asynchronously and may lag behind code changes

2. **Environment Variables:**
   - Hardcoded Supabase URLs in `client.ts` mean env vars aren't being used
   - If Lovable env vars are different, app may fail to load properly

3. **Missing Route Configuration:**
   - No `/admin` route means admin panel is inaccessible
   - May cause routing errors that slow down initial load

4. **Potential Build Issues:**
   - TypeScript errors may cause build warnings
   - Supabase client initialization might fail if env context differs

**Recommendation:**
- Force a clean rebuild by adding a minimal commit (`.lovable-reindex` file)
- Fix hardcoded credentials to use env variables
- Add `/admin` route to App.tsx
- Verify Lovable Project Settings → Environment Variables are set

---

## 8. Supabase Integration Status

**Edge Functions Detected:**
- `supabase/functions/get-exchange-rate/`
- `supabase/functions/pesapal-ipn/`
- `supabase/functions/pesapal-register-ipn/`
- `supabase/functions/pesapal-submit-order/`
- `supabase/functions/send-auth-email/`
- `supabase/functions/send-payment-emails/`

**Database Tables Referenced:**
- `profiles` (user profiles with role field)
- Payment-related tables (referenced in edge functions)

**Auth Configuration:**
- ✅ Email/password auth configured
- ✅ Google OAuth configured
- ⚠️ Redirect URLs may need updating in Supabase dashboard

---

## 9. Repository Health Summary

**Overall Status:** ⚠️ **FUNCTIONAL BUT NEEDS FIXES**

**Strengths:**
- ✅ Proper Vite + React + TypeScript setup
- ✅ Build configuration is correct
- ✅ Routing is comprehensive
- ✅ Supabase integration is active
- ✅ Design system (Tailwind + shadcn) properly configured

**Critical Issues:**
- ❌ Hardcoded Supabase credentials (security & flexibility)
- ❌ Type-unsafe admin auth hook
- ❌ Missing `/admin` route
- ⚠️ `.env` file likely in git (security risk)

**Can Lovable Preview the Real App As-Is?**  
**Answer:** YES, but with caveats:
- The inbuilt Lovable preview works correctly
- The external preview link is slow and may show cached dummy content due to build/cache issues
- Once fixes are applied and rebuild is triggered, preview should work perfectly

---

## 10. Recommended Lovable Configuration

**Project Root:** `/` (repository root - DO NOT CHANGE)

**Build Command:** `npm run build`

**Dev Command:** `npm run dev` (runs `vite`)

**Environment Variables to Set in Lovable:**
```
VITE_SUPABASE_URL=https://mczqwqsvumfsneoknlep.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGci...
```

---

## Next Steps

See `LOVABLE_TASKS.md` for prioritized action items.
