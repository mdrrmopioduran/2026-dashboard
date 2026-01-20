# ⚡ Quick Vercel Setup - Copy These Settings

## 🎯 In Vercel Dashboard → Project Settings

### Build & Development Settings

```
Framework Preset: Create React App
Root Directory: . (leave as root, do NOT set to "frontend")
Build Command: cd frontend && yarn install && yarn build
Output Directory: frontend/build
Install Command: cd frontend && yarn install
```

### Environment Variables (Add ALL of these)

Click "Add" for each variable and check ALL environment boxes (Production, Preview, Development):

```
Name: REACT_APP_BACKEND_URL
Value: https://repo-setup-39.preview.emergentagent.com
```

```
Name: REACT_APP_GOOGLE_DRIVE_API_KEY
Value: AIzaSyCDcthLGNPlbMr4AFzuK5tl0CMTzsQI9EI
```

```
Name: REACT_APP_GOOGLE_SHEETS_API_KEY
Value: AIzaSyBTZH_0wi2svXNNQX696bA2Knj_7VXZ4CM
```

```
Name: REACT_APP_GOOGLE_SHEET_ID
Value: 1UtT9t2LZ5NEc-wbGv44mDeDjWLxOLBQHA5yy6jiLc7E
```

---

## 🚀 Deploy Steps

1. **Push to GitHub** (if not already done)
2. **Import to Vercel**: vercel.com/new
3. **Paste settings above** in Project Settings
4. **Add all 4 environment variables**
5. **Click Deploy**

---

## ✅ What I Fixed

✅ Created `vercel.json` - Tells Vercel how to build
✅ Created `.vercelignore` - Excludes backend files
✅ Updated `package.json` - Removed backend install from default script
✅ Verified CORS is enabled in backend

---

## 🎉 After Deployment

Your app will be live at: `https://your-project-name.vercel.app`

All features will work:
- ✅ Dashboard with 8 modules
- ✅ Google Sheets integration (Supply, Contacts, Calendar)
- ✅ Google Drive integration (Documents, Photos, Maps, Panorama)
- ✅ Interactive map with Leaflet
- ✅ 360° panoramic viewer
- ✅ Dark mode
- ✅ Print reports

---

## 📱 Test After Deploy

1. Open your Vercel URL
2. Check dashboard loads
3. Click a module (e.g., Supply Inventory)
4. Verify data loads from Google Sheets
5. Check browser console for errors

---

**Need help?** Check the full guide: `/app/VERCEL_DEPLOYMENT_GUIDE.md`
