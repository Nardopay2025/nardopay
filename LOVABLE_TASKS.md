# Lovable Onboarding Task List
**Priority Order:** Complete tasks in sequence for safest onboarding.

---

## 🔴 CRITICAL PRIORITY (Do First)

### ✅ Task 1: Fix Hardcoded Supabase Credentials
**File:** `src/integrations/supabase/client.ts`
**Current Issue:** Lines 5-6 have hardcoded Supabase URL and key
**Fix:**
```typescript
// Replace lines 5-6 with:
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
```
**Then:** Add env vars to Lovable Project > Settings > Environment Variables:
- `VITE_SUPABASE_URL` = `https://mczqwqsvumfsneoknlep.supabase.co`
- `VITE_SUPABASE_PUBLISHABLE_KEY` = `eyJhbGci...` (full key from .env)

---

### ✅ Task 2: Fix Admin Auth Hook TypeScript Error
**File:** `src/hooks/useAdminAuth.tsx:33`
**Current Issue:** Unsafe type assertion `(profile as any).role`
**Fix:** Define proper interface for profile:
```typescript
interface Profile {
  id: string;
  role: string;
  // ... other fields
}

// Then replace line 33:
if (error || !profile || profile.role !== "admin") {
```
**Alternative Quick Fix:** Cast to specific type instead of `any`:
```typescript
if (error || !profile || (profile as { role: string }).role !== "admin") {
```

---

### ✅ Task 3: Add Missing `/admin` Route
**File:** `src/App.tsx`
**Current Issue:** Admin dashboard component exists but no route configured
**Fix:** Add this route after line 69 (after `/dashboard` route):
```typescript
<Route path="/admin" element={<AdminDashboard />} />
```
**Note:** AdminDashboard is already imported (line 26), just needs route.

---

## 🟡 HIGH PRIORITY (Do Next)

### ✅ Task 4: Remove `.env` from Git (Security)
**Issue:** `.env` file should NEVER be committed to git
**Fix:**
```bash
# Remove from git tracking (keeps local file)
git rm --cached .env
git commit -m "Remove .env from version control"
git push origin main
```
**Verify:** Check `.gitignore` contains `.env` (should already be there)

---

### ✅ Task 5: Verify Lovable Build Configuration
**Current:**
- ✅ Dev script exists: `"dev": "vite"`
- ✅ Build script exists: `"build": "vite build"`
- ✅ Vite config is correct

**Action:** No changes needed, but **verify in Lovable UI:**
- Project > Settings > Build Command = `npm run build`
- Project > Settings > Dev Command = `npm run dev`
- Project > Settings > Project Root = `/` (repo root)

---

### ✅ Task 6: Force Lovable Reindex (Fix Preview Link)
**Issue:** Preview link showing old dummy page
**Fix:** Create trigger commit to force rebuild:
```bash
# Create empty reindex file
echo "Lovable scan complete - $(date)" > .lovable-scan-complete
git add .lovable-scan-complete
git commit -m "Trigger Lovable rebuild"
git push origin main
```
**Expected Result:** Lovable detects new commit and triggers fresh build.

---

## 🟢 MEDIUM PRIORITY (Quality Improvements)

### ✅ Task 7: Update Supabase Auth Redirect URLs
**Location:** Supabase Dashboard > Authentication > URL Configuration
**Required URLs:**
- Site URL: `https://[your-netlify-url].netlify.app` OR `https://nardopay.com`
- Redirect URLs:
  - `https://[your-netlify-url].netlify.app/dashboard`
  - `http://localhost:8080/dashboard` (for local dev)
  - Add custom domain when available

---

### ✅ Task 8: Add Netlify Environment Variables
**Location:** Netlify Dashboard > Site Settings > Environment Variables
**Required Vars:**
- `VITE_SUPABASE_URL` = `https://mczqwqsvumfsneoknlep.supabase.co`
- `VITE_SUPABASE_PUBLISHABLE_KEY` = `eyJhbGci...` (full key)

---

### ✅ Task 9: Enable TypeScript Strict Mode (Optional)
**File:** `tsconfig.json`
**Current:** Strict checks disabled for rapid prototyping
**For Production:** Consider enabling:
```json
{
  "compilerOptions": {
    "strictNullChecks": true,
    "noImplicitAny": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  }
}
```
**Warning:** Will require fixing ~50+ type errors across codebase.

---

## 🔵 LOW PRIORITY (Polish)

### ✅ Task 10: Admin Panel UI Enhancement (Future)
**Context:** Admin requested dark, glassy aesthetic
**Status:** Deferred until core functionality is stable
**File:** `src/pages/admin/Dashboard.tsx`
**Notes:** Current admin panel is functional but uses default styling.

---

### ✅ Task 11: Add TypeScript Types for Supabase Tables
**File:** `src/integrations/supabase/types.ts` (read-only, auto-generated)
**Action:** Regenerate types from Supabase schema:
```bash
npx supabase gen types typescript --project-id mczqwqsvumfsneoknlep > src/integrations/supabase/types.ts
```
**Benefit:** Proper type safety for database queries.

---

## 📋 Completion Checklist

- [ ] Task 1: Fix hardcoded Supabase credentials
- [ ] Task 2: Fix admin auth hook type error
- [ ] Task 3: Add `/admin` route to App.tsx
- [ ] Task 4: Remove `.env` from git
- [ ] Task 5: Verify Lovable build config
- [ ] Task 6: Create `.lovable-scan-complete` trigger commit
- [ ] Task 7: Update Supabase auth redirect URLs
- [ ] Task 8: Add Netlify environment variables
- [ ] Task 9: (Optional) Enable TypeScript strict mode
- [ ] Task 10: (Future) Enhance admin panel UI
- [ ] Task 11: (Optional) Regenerate Supabase types

---

## 🚀 Quick Start: Minimum Required Tasks

**To get preview link working NOW:**
1. Complete Task 1 (fix credentials)
2. Complete Task 3 (add `/admin` route)
3. Complete Task 6 (force reindex)

**Estimated Time:** 10 minutes

---

**Branch for Safe Testing:** `lovable/scan-summary` (created separately)
**Final Deployment:** Merge to `main` after testing
