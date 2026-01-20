# 🚀 Vercel Deployment Guide for MDRRMO Pio Duran System

This guide will help you deploy the **frontend only** to Vercel while keeping the backend in the current environment.

## 📋 Prerequisites

- Vercel account (free tier works)
- GitHub repository connected to Vercel
- Backend running on current server (https://repo-setup-39.preview.emergentagent.com)

---

## 🔧 Vercel Project Configuration

### Step 1: Framework & Build Settings

In your Vercel project settings, configure:

```
Framework Preset: Create React App
Build Command: cd frontend && yarn install && yarn build
Output Directory: frontend/build
Install Command: cd frontend && yarn install
```

### Step 2: Root Directory

**IMPORTANT**: Set the root directory to **`.`** (root of repo), NOT `frontend`.

The build command already includes `cd frontend`, so Vercel needs to start from the root.

### Step 3: Environment Variables

Add these environment variables in Vercel Dashboard → Project Settings → Environment Variables:

| Variable Name | Value | Environment |
|--------------|-------|-------------|
| `REACT_APP_BACKEND_URL` | `https://repo-setup-39.preview.emergentagent.com` | Production, Preview, Development |
| `REACT_APP_GOOGLE_DRIVE_API_KEY` | `AIzaSyCDcthLGNPlbMr4AFzuK5tl0CMTzsQI9EI` | Production, Preview, Development |
| `REACT_APP_GOOGLE_SHEETS_API_KEY` | `AIzaSyBTZH_0wi2svXNNQX696bA2Knj_7VXZ4CM` | Production, Preview, Development |
| `REACT_APP_GOOGLE_SHEET_ID` | `1UtT9t2LZ5NEc-wbGv44mDeDjWLxOLBQHA5yy6jiLc7E` | Production, Preview, Development |

**Note**: Make sure to add these to ALL environments (Production, Preview, Development).

---

## 📁 Files Created for Vercel

I've created the following files to optimize Vercel deployment:

### 1. `vercel.json`
Configuration file that tells Vercel:
- Where to find the frontend code
- How to build it
- How to handle routing (SPA support)
- Environment variables

### 2. `.vercelignore`
Tells Vercel what files to ignore (backend code, scripts, etc.)

### 3. Updated `package.json`
Modified install script to avoid backend dependencies during Vercel build.

---

## 🚀 Deployment Steps

### Option A: Deploy from Vercel Dashboard

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Configure settings as shown in Step 1-3 above
5. Click "Deploy"

### Option B: Deploy from CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

---

## ✅ Verification

After deployment, verify:

1. ✅ Frontend loads at your Vercel URL (e.g., `your-app.vercel.app`)
2. ✅ Dashboard displays all 8 module cards
3. ✅ Modules connect to Google Sheets/Drive (check connection banners)
4. ✅ Backend API calls work (check browser console for errors)
5. ✅ Dark mode toggle works
6. ✅ Interactive features respond

---

## 🔍 Troubleshooting

### Build Fails with "install_backend_fixed.sh not found"

**Solution**: Make sure you're using the updated `package.json` where `install` script points to `install:frontend` only.

### Frontend loads but can't connect to backend

**Solution**: Check that `REACT_APP_BACKEND_URL` is correctly set in Vercel environment variables and includes the full URL with `https://`.

### CORS errors when calling backend

**Solution**: Your backend needs to allow CORS from the Vercel domain. Add this to backend:

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://your-app.vercel.app", "https://repo-setup-39.preview.emergentagent.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Environment variables not working

**Solution**: 
- Ensure all env vars start with `REACT_APP_`
- Redeploy after adding env vars (they're only applied on new builds)
- Check that you added them to ALL environments

---

## 🏗️ Architecture After Deployment

```
┌─────────────────┐
│   Vercel CDN    │  ← React Frontend (Static)
│  your-app.vercel│
└────────┬────────┘
         │ API Calls
         ↓
┌─────────────────┐
│  Current Server │  ← FastAPI Backend + MongoDB
│  preview.em...  │
└─────────────────┘
         ↓
┌─────────────────┐
│  Google APIs    │  ← Direct frontend connections
│  Sheets & Drive │
└─────────────────┘
```

---

## 💡 Alternative Deployment Options

### Option 1: Frontend Only (Current Guide)
- ✅ Free on Vercel
- ✅ Fast global CDN
- ✅ Easy to deploy
- ❌ Backend still needs separate hosting

### Option 2: Split Full-Stack
- Frontend → Vercel
- Backend → Railway/Render/Fly.io
- Database → MongoDB Atlas
- ✅ Fully cloud-native
- ❌ More complex setup

### Option 3: All-in-One Platform
- Deploy to Render/Railway/Fly.io (both frontend + backend)
- ✅ Single deployment
- ❌ Not as fast as Vercel CDN for frontend

---

## 📞 Need Help?

If you encounter issues:

1. Check Vercel build logs for detailed error messages
2. Verify environment variables are set correctly
3. Check browser console for frontend errors
4. Verify backend is accessible from Vercel's deployment region
5. Test API endpoints directly with curl/Postman

---

## 📝 Notes

- The frontend is completely static (React SPA)
- All data fetching happens client-side via Google APIs
- Backend is used only for Maps/Panorama modules that haven't migrated yet
- MongoDB is used by backend only, not directly accessed by frontend

---

**Last Updated**: January 2025
**Version**: 1.0.0
