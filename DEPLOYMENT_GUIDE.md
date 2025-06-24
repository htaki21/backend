# 🚀 VPS Deployment Guide - Local Image Storage

Your Strapi backend is now configured for **local image storage** and ready for deployment on Coolify VPS.

## ✅ Current Configuration

- 🎯 **Upload Provider**: Local storage (no Cloudinary dependency)
- 📁 **Images Location**: `public/uploads/`
- 🔄 **Git Tracking**: Enabled for uploads directory
- 🌐 **Static Serving**: Automatic via Strapi middlewares
- 💾 **File Size Limit**: 200MB (configurable)

## 🚀 Deployment Steps

### 1. **Deploy to Coolify VPS**

```bash
git add .
git commit -m "Ready for VPS deployment with local uploads"
git push origin main
```

### 2. **After Deployment**

1. Access Strapi admin: `https://yourdomain.com/admin`
2. Login with your admin credentials
3. Go to **Media Library** in the admin panel
4. Upload your 500+ images through the interface

### 3. **Image URLs on VPS**

Your images will be accessible as:

```
https://yourdomain.com/uploads/filename.jpg
```

## 🔄 VPS Migration & Persistence

### **When you redeploy:**

✅ Images persist automatically (tracked in Git)
✅ Database connections maintained
✅ No manual intervention needed

### **When you migrate to new VPS/domain:**

✅ Images migrate automatically (in Git repository)
✅ Export/import database normally
✅ Change domain in environment variables
✅ No external dependencies to reconfigure

## 🛠️ Available Commands

```bash
# Verify deployment readiness
npm run verify:deployment

# Database backup/restore (if needed)
npm run backup:database
npm run restore:database backup-file.sql

# Normal Strapi commands
npm run develop    # Local development
npm run build      # Production build
npm run start      # Production start
```

## 📁 Directory Structure

```
public/
├── uploads/           # Your images will be stored here
│   ├── .gitkeep      # Ensures Git tracking
│   └── [images...]   # Uploaded images
└── robots.txt
```

## 🔒 Security & Performance

- ✅ **File Size**: Limited to 200MB per file
- ✅ **Static Serving**: Direct file serving (fast)
- ✅ **No External APIs**: No Cloudinary dependency
- ✅ **Git Backup**: Images backed up in repository
- ✅ **Domain Independent**: Works on any domain

## 🎯 Post-Deployment Checklist

After deploying to your VPS:

- [ ] Strapi admin accessible at `https://yourdomain.com/admin`
- [ ] Media Library loads correctly
- [ ] Upload test image works
- [ ] Test image accessible at `https://yourdomain.com/uploads/testimage.jpg`
- [ ] Products/Events can select uploaded images
- [ ] Images display correctly on frontend

## 📞 Need Help?

If anything doesn't work as expected:

1. **Check the logs** in Coolify dashboard
2. **Verify permissions** on uploads directory
3. **Run verification**: `npm run verify:deployment`
4. **Test image upload** through admin panel

---

**✨ Your Strapi is now fully independent and ready for production!**
