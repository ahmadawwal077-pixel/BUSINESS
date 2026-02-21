# Full-Stack Deployment Guide - Render Setup

## Problem Solved
✅ Fixed "Not Found" error on route refresh (e.g., `/app`, `/dashboard`)
✅ Properly configured Express to handle client-side routing
✅ API routes protected from being overridden by catch-all route

---

## What Changed in Backend

### 1. **Added Required Imports** (server.js top)
```javascript
const path = require('path');
const fs = require('fs');
```

### 2. **Added Static File Serving + SPA Routing** (after all API routes)
The new code:
- Detects frontend build directory (supports both `build` and `dist`)
- Serves static assets with 1-day cache for performance
- Handles React Router by serving `index.html` for all non-API routes
- Protects API routes from being caught by the wildcard

**Key Features:**
- ✅ API routes (`/api/*`) return 404 JSON if not found
- ✅ Non-API routes (`/app`, `/dashboard`, etc.) serve `index.html`
- ✅ React Router handles all client-side routing
- ✅ Static assets (JS, CSS) cached for performance

---

## Route Priority (Important!)

1. **API Routes** (highest priority)
   - `/api/*` - All API endpoints
   - These are registered first, so they match first

2. **Static Files** (medium priority)
   - `/css/*`, `/js/*`, `/images/*` - Automatically matched by `express.static()`

3. **Wildcard/SPA Route** (lowest priority)
   - `*` - Catches everything else and serves `index.html`
   - React Router then handles client-side routing

**Why This Order Matters:**
If wildcard came first, `/api/courses` might accidentally serve index.html instead of hitting your API route. By putting API routes first, they're guaranteed to match before the wildcard.

---

## Production Deployment on Render

### Option 1: Using Web Service Dashboard (Recommended)

1. **Connect your repo to Render**
   - Push to GitHub repo with both `frontend/` and `backend/` folders

2. **Create New Web Service**
   - Service name: `business-backend`
   - Root directory: `backend`
   - Build command:
     ```bash
     cd ../frontend && npm install && npm run build && cd ../backend && npm install
     ```
   - Start command:
     ```bash
     npm start
     ```

3. **Set Environment Variables**
   ```
   NODE_ENV = production
   PORT = 5000
   
   MONGODB_URI = (your MongoDB connection string)
   JWT_SECRET = (your secret key)
   
   PAYSTACK_SECRET_KEY = (your Paystack key)
   PAYSTACK_PUBLIC_KEY = (your Paystack key)
   
   FRONTEND_URL = https://your-render-domain.onrender.com
   BACKEND_URL = https://your-render-domain.onrender.com
   ```

4. **Deploy**
   - Render will automatically deploy on git push

### Option 2: Using render.yaml (Infrastructure as Code)

The `render.yaml` file in the root enables version-controlled infrastructure.

**Steps:**
1. Push `render.yaml` to your repo root
2. In Render Dashboard → Import Git repo
3. Select "Render.yaml" option
4. Add any sensitive environment variables (JWT_SECRET, PAYSTACK_KEY, etc.)
5. Deploy

---

## Local Testing

### Build and Test Before Deploying

```bash
# Backend directory
cd backend
npm install
npm start

# In another terminal - Frontend directory
cd frontend
npm install
npm run build

# Verify build exists
ls -la build/  # Should show index.html, static/ folders
```

The backend will serve:
- API: `http://localhost:5000/api/*`
- Frontend: `http://localhost:5000/*` (serves index.html → React Router handles it)

**Test Routes:**
- ✅ `http://localhost:5000/` - Should work (shows React app)
- ✅ `http://localhost:5000/app` - Should work (React Router handles)
- ✅ `http://localhost:5000/dashboard` - Should work (React Router handles)
- ✅ `http://localhost:5000/api/health` - Should return JSON
- ✅ `http://localhost:5000/api/invalid` - Should return 404 JSON (not HTML)

---

## Troubleshooting

### Issue: Still Getting "Not Found" After Refresh

**Solution 1:** Build frontend first
```bash
cd frontend
npm run build
cd ../backend
npm start
```

**Solution 2:** Check if build exists
```bash
# Linux/Mac
ls ../frontend/build/index.html

# Windows PowerShell
Test-Path ../frontend/build/index.html
```

**Solution 3:** Verify backend logs show "React SPA routing configured"
```
📁 Serving frontend from: /app/backend/../frontend/build
✅ React SPA routing configured (wildcard catch-all enabled)
```

### Issue: Render Says "Build Succeeded but App Won't Load"

**Likely Cause:** Frontend not built before deployment

**Fix:** Update build command in Render to:
```bash
cd frontend && npm install && npm run build && cd ../backend && npm install
```

Then redeploy.

### Issue: API Routes Return HTML Instead of JSON

**Likely Cause:** Misconfigured route order

**Fix:** Verify in server.js that:
1. API routes are registered BEFORE the `express.static()` call
2. API routes are registered BEFORE the `app.get('*', ...)` catch-all
3. The `app.get('*', ...)` checks if path starts with `/api/`

---

## Environment Variables for Render

Create these in Render Dashboard → Settings → Environment Variables:

| Key | Example Value | Notes |
|-----|---------------|-------|
| `NODE_ENV` | `production` | Must be production |
| `PORT` | `5000` | Render assigns dynamic port |
| `MONGODB_URI` | `mongodb+srv://...` | Full connection string |
| `JWT_SECRET` | `(secure random string)` | Generate a strong secret |
| `FRONTEND_URL` | `https://your-app.onrender.com` | Used for CORS |
| `BACKEND_URL` | `https://your-app.onrender.com` | Used by frontend API calls |
| `PAYSTACK_SECRET_KEY` | `sk_live_...` | Your Paystack key |
| `PAYSTACK_PUBLIC_KEY` | `pk_live_...` | Your Paystack key |

---

## How It Works (Technical)

```
User navigates to /dashboard
    ↓
Browser requests: GET /dashboard
    ↓
Express checks routes in order:
1. Is it an API route? (/api/*) → NO
2. Is it a static file? (/css, /js, etc.) → NO
3. Is it anything else? (*) → YES
    ↓
Serve index.html (contains React app)
    ↓
React app loads in browser
    ↓
React Router parses URL and renders /dashboard page
    ↓
User sees dashboard WITHOUT server-side routing needed
```

---

## Next Steps

1. ✅ **Update server.js** - Done (SPA routing configured)
2. ✅ **Update environment vars** - Update URL in `.env`
3. **Test locally:**
   ```bash
   npm run build && npm start
   # Test http://localhost:5000/dashboard (refresh should work)
   ```
4. **Push to GitHub** - All changes should be committed
5. **Render will auto-deploy** - On git push
6. **Verify on Render** - Test refresh on `/app` & `/dashboard`

---

## Still Having Issues?

**Check these in order:**

1. Log into Render Dashboard → Your Service → Logs
   - Look for: `✅ React SPA routing configured`
   - If not there: Frontend build folder not found

2. Manual deploy test:
   ```bash
   # In backend folder
   npm install
   npm start
   # Visit localhost:5000/api/health (should return JSON)
   # Visit localhost:5000 (should show app)
   # Refresh localhost:5000/app (should still show app)
   ```

3. Frontend build size:
   ```bash
   cd frontend
   npm run build
   du -sh build/  # Should be 200KB-500KB
   ```

4. Clear Render build cache:
   - Render Dashboard → Deploys → Trigger Redeploy
   - Uncheck "Use build cache"

---

**Need Support?**
- Check Render [SPA Routing Guide](https://render.com/docs)
- Check Express [Static Files Guide](https://expressjs.com/en/starter/static-files.html)
- Check React Router [Browser](https://reactrouter.com/docs/en/v6)
