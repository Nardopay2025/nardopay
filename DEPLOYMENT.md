# Netlify Deployment Guide

## Issues Fixed

1. **Malformed URI in favicon** - Fixed the data URI in index.html that was causing build failures
2. **Missing SPA routing** - Added `netlify.toml` and `public/_redirects` for proper client-side routing
3. **Build optimization** - Added manual chunk splitting to reduce bundle size
4. **Hardcoded localhost URLs** - Replaced all hardcoded localhost URLs with dynamic base URL detection

## Deployment Steps

1. **Push your changes to GitHub:**
   ```bash
   git add .
   git commit -m "Fix Netlify deployment issues"
   git push origin main
   ```

2. **Deploy to Netlify:**
   - Connect your GitHub repository to Netlify
   - Set build command: `npm run build`
   - Set publish directory: `dist`
   - Deploy!

## Configuration Files Added

### netlify.toml
- Specifies build command and output directory
- Handles SPA routing with redirects
- Adds security headers

### public/_redirects
- Alternative method for SPA routing
- Redirects all routes to index.html

### src/lib/utils.ts
- Added `getBaseUrl()` function for dynamic URL generation
- Automatically detects development vs production environment
- Uses current domain in production, localhost in development

## Build Optimization

The Vite config now includes:
- Manual chunk splitting for better caching
- Disabled sourcemaps for production
- Optimized bundle structure

## Troubleshooting

If deployment still fails:
1. Check Netlify build logs for specific errors
2. Ensure all dependencies are in `package.json`
3. Verify Node.js version compatibility (set to 18 in netlify.toml) 