# 🔐 Vercel Environment Variables - Step-by-Step Guide

## ⚠️ Important: Add Variables in Vercel Dashboard, NOT in vercel.json

Environment variables should be added through the Vercel Dashboard UI, not in the `vercel.json` file.

---

## 📍 How to Add Environment Variables in Vercel

### Step 1: Access Environment Variables Settings

1. Go to your Vercel Dashboard: https://vercel.com/dashboard
2. Click on your project
3. Click on **"Settings"** tab (top navigation)
4. Click on **"Environment Variables"** in the left sidebar

### Step 2: Add Each Variable

For **each** of the 4 variables below, repeat these steps:

1. Click **"Add New"** button
2. Enter the **Name** (exactly as shown below)
3. Enter the **Value** (copy-paste from below)
4. Select **all 3 environments**: ✅ Production ✅ Preview ✅ Development
5. Click **"Save"**

---

## 🔑 The 4 Environment Variables You Need

### Variable 1: Backend URL

```
Name: REACT_APP_BACKEND_URL
Value: https://repo-setup-39.preview.emergentagent.com
Environments: ✅ Production ✅ Preview ✅ Development
```

**Purpose**: Tells the frontend where your backend API is hosted

---

### Variable 2: Google Drive API Key

```
Name: REACT_APP_GOOGLE_DRIVE_API_KEY
Value: AIzaSyCDcthLGNPlbMr4AFzuK5tl0CMTzsQI9EI
Environments: ✅ Production ✅ Preview ✅ Development
```

**Purpose**: Allows frontend to access Google Drive for Documents, Photos, Maps, Panorama modules

---

### Variable 3: Google Sheets API Key

```
Name: REACT_APP_GOOGLE_SHEETS_API_KEY
Value: AIzaSyBTZH_0wi2svXNNQX696bA2Knj_7VXZ4CM
Environments: ✅ Production ✅ Preview ✅ Development
```

**Purpose**: Allows frontend to access Google Sheets for Supply Inventory, Contacts, Calendar modules

---

### Variable 4: Google Sheet ID

```
Name: REACT_APP_GOOGLE_SHEET_ID
Value: 1UtT9t2LZ5NEc-wbGv44mDeDjWLxOLBQHA5yy6jiLc7E
Environments: ✅ Production ✅ Preview ✅ Development
```

**Purpose**: Specifies which Google Sheet contains your data

---

## 📸 Visual Guide

Your Environment Variables page should look like this:

```
┌─────────────────────────────────────────────────────────────┐
│  Environment Variables                        [Add New]      │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  REACT_APP_BACKEND_URL                                       │
│  https://repo-setup-39.preview.emergentagent.com             │
│  Production, Preview, Development                            │
│                                                     [Edit]    │
├─────────────────────────────────────────────────────────────┤
│  REACT_APP_GOOGLE_DRIVE_API_KEY                              │
│  AIzaSyCDcth... (hidden)                                     │
│  Production, Preview, Development                            │
│                                                     [Edit]    │
├─────────────────────────────────────────────────────────────┤
│  REACT_APP_GOOGLE_SHEETS_API_KEY                             │
│  AIzaSyBTZH_... (hidden)                                     │
│  Production, Preview, Development                            │
│                                                     [Edit]    │
├─────────────────────────────────────────────────────────────┤
│  REACT_APP_GOOGLE_SHEET_ID                                   │
│  1UtT9t2LZ5NEc-wbGv44mDeDjWLxOLBQHA5yy6jiLc7E               │
│  Production, Preview, Development                            │
│                                                     [Edit]    │
└─────────────────────────────────────────────────────────────┘
```

---

## ✅ Verification Checklist

After adding all variables, verify:

- [ ] **4 variables added** (not 3, not 5)
- [ ] All names start with `REACT_APP_` (case-sensitive)
- [ ] All values are exactly as shown above (no extra spaces)
- [ ] All variables have **all 3 environments** checked
- [ ] No typos in names or values

---

## 🔄 After Adding Variables

**Important**: Environment variables only apply to **new builds**.

### If you already deployed:

1. Go to **Deployments** tab
2. Click **"Redeploy"** on the latest deployment
3. Check **"Use existing Build Cache"** = NO (uncheck it)
4. Click **"Redeploy"**

### If this is your first deployment:

1. Just click **"Deploy"** normally
2. Variables will be included automatically

---

## 🚫 Common Mistakes to Avoid

### ❌ Wrong: Adding to vercel.json
```json
// DON'T DO THIS
{
  "env": {
    "REACT_APP_BACKEND_URL": "https://..."
  }
}
```

### ✅ Correct: Adding in Dashboard UI
Use the Vercel Dashboard → Settings → Environment Variables page

---

### ❌ Wrong: Forgetting the prefix
```
Name: BACKEND_URL  ← Missing REACT_APP_ prefix
```

### ✅ Correct: Using the full name
```
Name: REACT_APP_BACKEND_URL  ← Correct!
```

---

### ❌ Wrong: Not selecting all environments
```
Environments: ✅ Production  ← Only one selected
```

### ✅ Correct: Selecting all three
```
Environments: ✅ Production ✅ Preview ✅ Development
```

---

## 🐛 Troubleshooting

### "Environment variable references Secret which does not exist"

**Cause**: The `vercel.json` file tried to reference secrets using `@` syntax

**Solution**: ✅ Already fixed! I removed the secret references from `vercel.json`

**Action**: 
1. Make sure you have the latest `vercel.json` (without `env` section)
2. Push changes to GitHub
3. Redeploy in Vercel

---

### Variables not working after adding them

**Cause**: Environment variables only apply to new builds

**Solution**: 
1. Go to Deployments tab
2. Click "Redeploy" on latest deployment
3. Uncheck "Use existing Build Cache"
4. Deploy again

---

### "Cannot read property 'REACT_APP_BACKEND_URL' of undefined"

**Cause**: Variables not loaded or wrong prefix

**Solution**:
1. Verify all variable names start with `REACT_APP_`
2. Verify they're added to **all environments**
3. Redeploy after adding

---

## 🧪 How to Test Variables Are Working

### During Build (in Vercel logs):

You should see:
```
✓ Creating an optimized production build
✓ Compiled successfully
```

You should NOT see:
```
REACT_APP_BACKEND_URL is undefined
```

### After Deployment:

1. Open your deployed site
2. Open browser DevTools (F12)
3. In Console, type:
   ```javascript
   console.log(window.location.origin)
   ```
4. Open a module (e.g., Supply Inventory)
5. Check Network tab for API calls to Google Sheets

---

## 📝 Quick Copy-Paste Format

If you need to share these with someone, use this format:

```
REACT_APP_BACKEND_URL=https://repo-setup-39.preview.emergentagent.com
REACT_APP_GOOGLE_DRIVE_API_KEY=AIzaSyCDcthLGNPlbMr4AFzuK5tl0CMTzsQI9EI
REACT_APP_GOOGLE_SHEETS_API_KEY=AIzaSyBTZH_0wi2svXNNQX696bA2Knj_7VXZ4CM
REACT_APP_GOOGLE_SHEET_ID=1UtT9t2LZ5NEc-wbGv44mDeDjWLxOLBQHA5yy6jiLc7E
```

---

## 🎯 Summary

1. ✅ **Fixed**: Removed secret references from `vercel.json`
2. ✅ **Add**: 4 environment variables in Vercel Dashboard
3. ✅ **Deploy**: Push changes and deploy/redeploy
4. ✅ **Verify**: Check that modules load data correctly

---

**That's it!** Your deployment should now work perfectly. 🚀
