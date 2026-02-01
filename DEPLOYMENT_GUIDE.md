# Quick Deployment Guide

## 🚀 Deploy to Streamlit Cloud (Easiest - Free)

### Step 1: Prepare Your Files
✅ Make sure you have these files in your project folder:
- `segmentation.py`
- `requirements.txt`
- `kmeans_model.pkl`
- `scaler_model.pkl`
- `README.md`

### Step 2: Create GitHub Repository

1. Go to https://github.com and sign in (or create account)
2. Click the **"+"** icon → **"New repository"**
3. Repository name: `customer-segmentation-app` (or any name)
4. Make it **Public** (required for free Streamlit Cloud)
5. **Don't** check "Initialize with README"
6. Click **"Create repository"**

### Step 3: Upload Files to GitHub

**Option A: Using GitHub Web Interface**
1. In your new repository, click **"uploading an existing file"**
2. Drag and drop all your files:
   - segmentation.py
   - requirements.txt
   - kmeans_model.pkl
   - scaler_model.pkl
   - README.md
   - .gitignore
   - .streamlit/config.toml (if you created it)
3. Scroll down, add commit message: "Initial commit"
4. Click **"Commit changes"**

**Option B: Using Git Command Line**
```bash
cd "c:\Users\jay likhar\OneDrive\Desktop\Amazon Customer Segmentation"
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

### Step 4: Deploy to Streamlit Cloud

1. Go to https://share.streamlit.io
2. Click **"Sign in"** → Sign in with GitHub
3. Click **"New app"**
4. Fill in the form:
   - **Repository**: Select your repository
   - **Branch**: `main` (or `master`)
   - **Main file path**: `segmentation.py`
   - **App URL**: Choose a custom name (e.g., `customer-segmentation`)
5. Click **"Deploy"**

### Step 5: Wait for Deployment
- First deployment takes 2-3 minutes
- You'll see build logs in real-time
- Once complete, your app will be live!

### Your App URL
Your app will be available at:
```
https://YOUR_APP_NAME.streamlit.app
```

## 📝 Important Notes

1. **Model Files Size**: Make sure `.pkl` files are under 100MB (Streamlit Cloud limit)
2. **Public Repository**: Free tier requires public repos (your code will be visible)
3. **Updates**: Push changes to GitHub, Streamlit Cloud auto-updates
4. **Secrets**: Use Streamlit Cloud's secrets management for API keys (if needed)

## 🔧 Troubleshooting

**Build fails?**
- Check `requirements.txt` has all dependencies
- Ensure Python version compatibility
- Check build logs for specific errors

**Model files not found?**
- Verify `.pkl` files are in the repository
- Check file paths in `segmentation.py` are correct

**App runs but shows errors?**
- Check Streamlit Cloud logs
- Verify all dependencies are in `requirements.txt`
- Ensure model files are uploaded correctly

## 🎉 Success!

Once deployed, you can:
- Share the URL with others
- Embed it in websites
- Use it for presentations
- Access it from anywhere

## Alternative: Local Deployment

If you want to run it locally and share via ngrok:

```bash
# Install ngrok
# Run your app
streamlit run segmentation.py

# In another terminal
ngrok http 8501
```

This gives you a public URL without deploying to cloud.
