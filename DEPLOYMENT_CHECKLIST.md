# Deployment Checklist - React Router SPA on Render

## ✅ Code Changes Completed

- [x] **backend/server.js** - Added SPA routing with wildcard catch-all
- [x] **backend/.env** - Organized environment variables
- [x] **render.yaml** - Infrastructure as code (optional but recommended)
- [x] **Guides created** - RENDER_DEPLOYMENT_GUIDE.md & CHANGES_SUMMARY.md

---

## 📋 Pre-Deployment Checklist

### Local Testing (MUST DO FIRST!)

- [ ] Frontend build created:
  ```bash
  cd frontend
  npm install
  npm run build
  # Check: ls build/index.html exists
  ```

- [ ] Backend starts with frontend:
  ```bash
  cd backend
  npm install
  npm start
  ```

- [ ] Test route refresh (refresh should NOT show 404):
  - [ ] Visit http://localhost:5000 - ✅ Should show app
  - [ ] Visit http://localhost:5000/app - ✅ Should show app
  - [ ] **Refresh** http://localhost:5000/app - ✅ Should STILL show app (not 404!)
  - [ ] Visit http://localhost:5000/dashboard - ✅ Should show app  
  - [ ] **Refresh** http://localhost:5000/dashboard - ✅ Should STILL show app (not 404!)

- [ ] Test API still works:
  - [ ] Visit http://localhost:5000/api/health - ✅ Returns JSON
  - [ ] Visit http://localhost:5000/api/invalid - ✅ Returns 404 JSON (not HTML)

- [ ] Check server logs show:
  ```
  📁 Serving frontend from: /path/to/frontend/build
  ✅ React SPA routing configured (wildcard catch-all enabled)
  ```

---

## 🚀 Render Deployment

### Option A: Web Service Dashboard (Easiest)

- [ ] Push all code to GitHub:
  ```bash
  git add backend/server.js backend/.env render.yaml RENDER_DEPLOYMENT_GUIDE.md CHANGES_SUMMARY.md
  git commit -m "Fix: Configure Express for React Router SPA routing"
  git push
  ```

- [ ] In Render Dashboard → Create New Web Service

- [ ] Configure settings:
  - [ ] Service name: `business-backend` (or your choice)
  - [ ] Root directory: `backend`
  - [ ] Build command:
    ```
    cd ../frontend && npm install && npm run build && cd ../backend && npm install
    ```
  - [ ] Start command:
    ```
    npm start
    ```
  - [ ] Environment: Node
  - [ ] Region: Select closest to users

- [ ] Add Environment Variables:
  ```
  NODE_ENV = production
  FRONTEND_URL = https://your-service.onrender.com
  BACKEND_URL = https://your-service.onrender.com
  MONGODB_URI = (your MongoDB connection string)
  JWT_SECRET = (your secret)
  PAYSTACK_SECRET_KEY = (your key)
  PAYSTACK_PUBLIC_KEY = (your key)
  EMAIL_USER = (your email)
  EMAIL_PASSWORD = (your app password)
  ```

- [ ] Click "Create Web Service"
- [ ] Wait for deployment (2-5 minutes)

---

### Option B: Using render.yaml (Infrastructure as Code)

- [ ] Push code with render.yaml:
  ```bash
  git add render.yaml
  git push
  ```

- [ ] In Render Dashboard → New → Blueprint
  - [ ] Select your Git repo
  - [ ] Click "Apply Blueprint"

- [ ] Add sensitive environment variables in Render:
  - [ ] MONGODB_URI
  - [ ] JWT_SECRET
  - [ ] PAYSTACK_SECRET_KEY
  - [ ] PAYSTACK_PUBLIC_KEY
  - [ ] EMAIL_PASSWORD

- [ ] Deploy starts automatically

---

## ✔️ Post-Deployment Verification

- [ ] Check deployment status:
  - [ ] Render Dashboard shows "Live"
  - [ ] Logs show: `✅ React SPA routing configured`

- [ ] Test in browser:
  - [ ] Visit `https://your-service.onrender.com`
  - [ ] App loads ✅
  - [ ] Navigate to `/app` or `/dashboard`
  - [ ] **Refresh the page** (Ctrl+R)
  - [ ] Should NOT see "Not Found" error ✅
  - [ ] Should see your app ✅

- [ ] Test API:
  - [ ] Visit `https://your-service.onrender.com/api/health`
  - [ ] Should return JSON ✅

- [ ] Test authentication flow:
  - [ ] Login attempt
  - [ ] Tokens stored in localStorage
  - [ ] Refresh protected route
  - [ ] Should still be logged in ✅

---

## 🐛 If Something Goes Wrong

### Option 1: Check Logs
1. Render Dashboard → Your Service → Logs tab
2. Scroll through logs
3. **Look for:** `✅ React SPA routing configured`
   - If NOT present → Frontend build folder not found
   - If present → Routing configured, problem elsewhere

### Option 2: Force Rebuild
1. Render Dashboard → Deploys
2. Click "Trigger Redeploy"
3. **Uncheck** "Use build cache"
4. Click "Deploy"
5. Wait for fresh build

### Option 3: Verify Build Command
1. Check build command in Render settings:
   ```
   cd ../frontend && npm install && npm run build && cd ../backend && npm install
   ```
2. If different, update and redeploy

### Option 4: Check Frontend Build
```bash
# Local machine
cd frontend
npm run build
ls -la build/

# Should show:
# - index.html
# - static/ folder
# - favicon.ico (maybe)
# - manifest.json (maybe)

# If empty or missing files → frontend build failed
```

### Option 5: Test with Curl
```bash
curl https://your-service.onrender.com/api/health
# Should return JSON

curl https://your-service.onrender.com/
# Should return HTML (index.html)

curl https://your-service.onrender.com/invalid-route
# Should return HTML (index.html)
```

---

## 📝 Environment Variable Reference

| Variable | Where to Set | Example |
|----------|-------------|---------|
| `NODE_ENV` | Render Dashboard | `production` |
| `PORT` | Render assigns (don't set) | (auto) |
| `FRONTEND_URL` | Render Dashboard | `https://app.onrender.com` |
| `BACKEND_URL` | Render Dashboard | `https://app.onrender.com` |
| `MONGODB_URI` | Render Dashboard | `mongodb+srv://...` |
| `JWT_SECRET` | Render Dashboard | (generate secure) |
| `PAYSTACK_SECRET_KEY` | Render Dashboard | `sk_live_...` |
| `PAYSTACK_PUBLIC_KEY` | Render Dashboard | `pk_live_...` |
| `EMAIL_USER` | Render Dashboard | Your email |
| `EMAIL_PASSWORD` | Render Dashboard | Gmail app password |

---

## 🎯 Common Pitfalls (Avoid These!)

❌ **WRONG:** Frontend URL in .env is `http://localhost:3000` (won't work on Render)
✅ **RIGHT:** Set `FRONTEND_URL` to `https://your-service.onrender.com`

❌ **WRONG:** Build command only runs `npm install` in backend
✅ **RIGHT:** Build command includes: `cd ../frontend && npm run build`

❌ **WRONG:** Start command is `npm run dev`
✅ **RIGHT:** Start command is `npm start`

❌ **WRONG:** Adding `/api/` in the wildcard catch-all check
✅ **RIGHT:** Checking `if (req.path.startsWith('/api/'))` BEFORE serving index.html

❌ **WRONG:** Deleting the frontend build before deploying
✅ **RIGHT:** Let Render rebuild it via build command

---

## 📞 Support Resources

If deployment still fails:

1. **Check this guide:** RENDER_DEPLOYMENT_GUIDE.md
2. **Review changes:** CHANGES_SUMMARY.md
3. **Render docs:** https://render.com/docs/deploy-node
4. **Express static:** https://expressjs.com/en/starter/static-files.html
5. **React Router:** https://reactrouter.com/docs

---

## ✨ Success! You're Done When:

- [x] Local tests pass (route refresh works)
- [x] Code pushed to GitHub
- [x] Render deployment "Live"
- [x] Browser: refresh `/dashboard` → works (not 404)
- [x] Browser: `/api/health` → returns JSON
- [x] App fully functional on production

**Estimated time: 15 minutes** ⏱️

---

## Next Steps

After deployment works:
- [ ] Set up custom domain (optional)
- [ ] Enable auto-deploy on git push
- [ ] Monitor Render dashboard for errors
- [ ] Plan database backups
- [ ] Test payment flow in production
- [ ] Share with team/users

🎉 **Your full-stack app is live on Render!**
