# ✅ Vercel Deployment Checklist

Use this checklist to ensure successful deployment to Vercel.

---

## 📋 Pre-Deployment (Before Going to Vercel)

- [x] **Fixed package.json** - Removed backend install from default script ✅
- [x] **Created vercel.json** - Build configuration ready ✅
- [x] **Created .vercelignore** - Backend files excluded ✅
- [x] **Tested build locally** - `yarn build` works perfectly ✅
- [x] **Backend CORS enabled** - Accepts requests from any origin ✅

---

## 🚀 Deployment Steps (In Order)

### Step 1: Push to GitHub (If Not Already Done)

- [ ] Check your GitHub repository exists
- [ ] Ensure latest code is pushed:
  ```bash
  git status
  git add .
  git commit -m "Configure for Vercel deployment"
  git push origin main
  ```

---

### Step 2: Import Project to Vercel

- [ ] Go to: https://vercel.com/new
- [ ] Click "Import Project"
- [ ] Select "Import Git Repository"
- [ ] Choose your GitHub repo
- [ ] Click "Import"

---

### Step 3: Configure Build Settings

In the Vercel import screen, set:

- [ ] **Framework Preset**: `Create React App`
- [ ] **Root Directory**: `.` (leave blank or set to root)
- [ ] **Build Command**: `cd frontend && yarn install && yarn build`
- [ ] **Output Directory**: `frontend/build`
- [ ] **Install Command**: `cd frontend && yarn install`

> **Note**: Vercel might auto-detect some of these from `vercel.json`. Verify they match above.

---

### Step 4: Add Environment Variables

Click "Environment Variables" section and add ALL 4 variables:

- [ ] **Variable 1**: 
  - Name: `REACT_APP_BACKEND_URL`
  - Value: `https://repo-setup-39.preview.emergentagent.com`
  - Environments: ✅ Production ✅ Preview ✅ Development

- [ ] **Variable 2**: 
  - Name: `REACT_APP_GOOGLE_DRIVE_API_KEY`
  - Value: `AIzaSyCDcthLGNPlbMr4AFzuK5tl0CMTzsQI9EI`
  - Environments: ✅ Production ✅ Preview ✅ Development

- [ ] **Variable 3**: 
  - Name: `REACT_APP_GOOGLE_SHEETS_API_KEY`
  - Value: `AIzaSyBTZH_0wi2svXNNQX696bA2Knj_7VXZ4CM`
  - Environments: ✅ Production ✅ Preview ✅ Development

- [ ] **Variable 4**: 
  - Name: `REACT_APP_GOOGLE_SHEET_ID`
  - Value: `1UtT9t2LZ5NEc-wbGv44mDeDjWLxOLBQHA5yy6jiLc7E`
  - Environments: ✅ Production ✅ Preview ✅ Development

---

### Step 5: Deploy

- [ ] Review all settings one more time
- [ ] Click "Deploy" button
- [ ] Wait for build to complete (2-5 minutes)

---

## 🎯 Post-Deployment Verification

### Basic Functionality

- [ ] Site loads at your Vercel URL (e.g., `your-app.vercel.app`)
- [ ] No white screen or 404 errors
- [ ] Dashboard displays with animated background
- [ ] All 8 module cards are visible

### Module Cards

- [ ] Supply Inventory card
- [ ] Contact Directory card
- [ ] Calendar Management card
- [ ] Document Management card
- [ ] Photo Documentation card
- [ ] Maps card
- [ ] Panorama/650 card
- [ ] Interactive Map card

### Interactive Features

- [ ] Dark mode toggle works
- [ ] "OPEN MODULE" buttons respond
- [ ] Toast notifications appear when clicking buttons

### Module Functionality

- [ ] **Supply Inventory**: Opens and displays data from Google Sheets
- [ ] **Contact Directory**: Shows contacts with search working
- [ ] **Calendar Management**: Displays timeline with events
- [ ] **Document Management**: Shows folder structure (if API key set)
- [ ] **Photo Documentation**: Shows photo gallery (if API key set)
- [ ] **Maps**: Opens with Leaflet map
- [ ] **Panorama**: Opens gallery view
- [ ] **Interactive Map**: Shows full-page map with tools

### Connection Status

- [ ] Check connection banners in modules:
  - ✅ Green "Connected to Google Sheets" (Supply, Contacts, Calendar)
  - ✅ Green "Connected to Google Drive" (Documents, Photos, Maps, Panorama)
  - ⚠️ If amber/yellow: API keys may need reconfiguration

### Browser Console

- [ ] Open browser DevTools (F12)
- [ ] Check Console tab for errors:
  - [ ] No red errors related to Google APIs
  - [ ] No CORS errors
  - [ ] No 404 errors for assets
  - [ ] Minor warnings are OK (React warnings, etc.)

---

## 🐛 Troubleshooting

### ❌ Build Fails

**Check build logs for:**

| Error Message | Solution |
|---------------|----------|
| "install_backend_fixed.sh not found" | Make sure you pushed the updated `package.json` |
| "Module not found" | Check that all dependencies are in `frontend/package.json` |
| "Build command failed" | Verify build command in Vercel settings |
| Environment variable errors | Add all 4 env vars to Vercel |

**Action**: 
- [ ] Read build logs carefully
- [ ] Check VERCEL_DEPLOYMENT_GUIDE.md for detailed troubleshooting
- [ ] Redeploy after fixing issues

---

### ⚠️ Build Succeeds but Site Doesn't Work

**Check these:**

- [ ] Environment variables are set in Vercel (not just locally)
- [ ] All env var names start with `REACT_APP_`
- [ ] Backend URL is correct and accessible
- [ ] API keys are valid and not expired
- [ ] Browser console shows actual error messages

**Action**:
- [ ] Go to Vercel Dashboard → Project → Settings → Environment Variables
- [ ] Verify all 4 variables are there
- [ ] Redeploy to apply env vars

---

### 🔴 CORS Errors

**Error**: "Access to fetch at '...' from origin '...' has been blocked by CORS policy"

**Solution**:
- [ ] Backend already has CORS enabled with wildcard
- [ ] If you want specific origins, update `/app/backend/.env`:
  ```
  CORS_ORIGINS=https://your-app.vercel.app,https://repo-setup-39.preview.emergentagent.com
  ```
- [ ] Restart backend: `sudo supervisorctl restart backend`

---

### 📊 Data Not Loading

**Symptoms**: Modules open but show "No data" or loading forever

**Check**:
- [ ] API keys are correct in Vercel environment variables
- [ ] Google Sheet ID is correct
- [ ] Test API directly in browser:
  ```
  https://sheets.googleapis.com/v4/spreadsheets/1UtT9t2LZ5NEc-wbGv44mDeDjWLxOLBQHA5yy6jiLc7E?key=YOUR_API_KEY
  ```
- [ ] Check browser console for specific API errors

---

## 📊 Success Metrics

Your deployment is successful when:

- ✅ Build completes in Vercel (green checkmark)
- ✅ All modules are accessible
- ✅ Data loads from Google Sheets/Drive
- ✅ No console errors
- ✅ Dark mode works
- ✅ Mobile responsive
- ✅ Fast load time (< 3 seconds)

---

## 🎉 After Successful Deployment

### Share Your App

Your app is now live at:
- Production: `https://your-project-name.vercel.app`
- Each push creates a preview URL automatically

### Custom Domain (Optional)

- [ ] Go to Vercel Dashboard → Project → Settings → Domains
- [ ] Add your custom domain
- [ ] Follow DNS configuration instructions

### Monitoring

- [ ] Check Vercel Analytics (if enabled)
- [ ] Monitor error logs in Vercel Dashboard
- [ ] Set up alerts for failed deployments

---

## 📞 Need Help?

If you get stuck:

1. **Check the logs**:
   - Vercel build logs (in Vercel Dashboard)
   - Browser console (F12 → Console tab)
   - Network tab (F12 → Network)

2. **Review the guides**:
   - `VERCEL_QUICK_START.md` - Quick reference
   - `VERCEL_DEPLOYMENT_GUIDE.md` - Full guide
   - `VERCEL_ARCHITECTURE_GUIDE.md` - Technical details

3. **Common issues**:
   - 90% of issues are environment variables not set
   - 5% are CORS issues (already fixed)
   - 5% are build command misconfigurations

---

## 📝 Notes

- Vercel automatically redeploys on every git push
- Environment variables only apply to new builds (redeploy after changing)
- Free tier includes 100GB bandwidth/month (plenty for most uses)
- Frontend updates are instant (CDN cached)
- Backend stays on current server (not affected by Vercel deployments)

---

**Last Updated**: January 2025  
**Version**: 1.0.0  
**Status**: Ready to deploy 🚀

---

## Quick Command Reference

```bash
# Test build locally
cd /app && yarn build

# Deploy to Vercel (CLI)
vercel

# Deploy to production (CLI)
vercel --prod

# Check Vercel project status
vercel ls

# View deployment logs
vercel logs <deployment-url>
```

---

**Good luck with your deployment! 🎉**
