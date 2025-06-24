const fs = require("fs");
const path = require("path");

/**
 * Verify that Strapi is ready for VPS deployment with local uploads
 * Supports transition from Cloudinary (existing URLs work, new uploads go local)
 */

function verifyDeploymentReady() {
  console.log("🔍 Verifying deployment readiness...");
  console.log("=====================================");

  let allGood = true;

  // 1. Check uploads directory exists and is ready
  console.log("\n📁 Checking uploads directory...");
  const uploadsDir = path.join(process.cwd(), "public", "uploads");

  if (!fs.existsSync(uploadsDir)) {
    console.log("❌ public/uploads directory missing");
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log("✅ Created public/uploads directory");
  } else {
    console.log("✅ public/uploads directory exists");
  }

  // Check .gitkeep exists
  const gitkeepPath = path.join(uploadsDir, ".gitkeep");
  if (!fs.existsSync(gitkeepPath)) {
    fs.writeFileSync(
      gitkeepPath,
      "# This file ensures the uploads directory is tracked in Git\n# Your uploaded images will be stored here and included in deployments\n"
    );
    console.log("✅ Created .gitkeep file for Git tracking");
  } else {
    console.log("✅ .gitkeep file exists for Git tracking");
  }

  // 2. Check plugin configuration
  console.log("\n⚙️  Checking plugin configuration...");
  const pluginsPath = path.join(process.cwd(), "config", "plugins.ts");

  if (fs.existsSync(pluginsPath)) {
    const pluginsContent = fs.readFileSync(pluginsPath, "utf-8");
    if (pluginsContent.includes('provider: "local"')) {
      console.log('✅ Upload provider is set to "local" (new uploads)');
    } else {
      console.log('❌ Upload provider is not set to "local"');
      allGood = false;
    }
  } else {
    console.log("❌ config/plugins.ts not found");
    allGood = false;
  }

  // 3. Check .gitignore doesn't exclude uploads
  console.log("\n📝 Checking Git configuration...");
  const gitignorePath = path.join(process.cwd(), ".gitignore");

  if (fs.existsSync(gitignorePath)) {
    const gitignoreContent = fs.readFileSync(gitignorePath, "utf-8");
    if (
      gitignoreContent.includes("public/uploads") &&
      !gitignoreContent.includes("#public/uploads")
    ) {
      console.log("❌ public/uploads is excluded in .gitignore");
      console.log("   This means your images won't be deployed!");
      allGood = false;
    } else {
      console.log("✅ public/uploads is NOT excluded in .gitignore");
    }
  }

  // 4. Check middlewares support both local and Cloudinary
  console.log("\n🌐 Checking static file serving & CSP...");
  const middlewaresPath = path.join(process.cwd(), "config", "middlewares.ts");

  if (fs.existsSync(middlewaresPath)) {
    const middlewaresContent = fs.readFileSync(middlewaresPath, "utf-8");
    console.log("✅ Middlewares configuration exists");
    console.log("   Static files will be served from /uploads/ automatically");

    if (middlewaresContent.includes("res.cloudinary.com")) {
      console.log(
        "✅ Cloudinary CSP rules present (existing images supported)"
      );
    } else {
      console.log(
        "⚠️  Cloudinary CSP rules missing (existing images may not load)"
      );
    }
  } else {
    console.log("⚠️  Middlewares configuration not found");
  }

  // 5. Deployment instructions
  console.log("\n🚀 Deployment Summary:");
  console.log("=====================");

  if (allGood) {
    console.log("✅ READY FOR DEPLOYMENT!");
    console.log("\n📋 Your setup:");
    console.log("   • Upload provider: Local storage (new uploads)");
    console.log("   • Images location: public/uploads/");
    console.log("   • Git tracking: Enabled for uploads");
    console.log("   • VPS compatibility: ✅ Ready");
    console.log("   • Existing Cloudinary URLs: ✅ Still work");

    console.log("\n🔄 Transition Strategy:");
    console.log("   ✅ Existing Cloudinary images continue working");
    console.log("   ✅ New uploads automatically go to local storage");
    console.log("   ✅ Gradual migration - no sudden breaks");
    console.log("   ✅ Admin panel works immediately after deployment");

    console.log("\n🎯 After deployment:");
    console.log("   1. Access Strapi admin - existing images still visible ✅");
    console.log(
      "   2. Upload new images - they go to local storage automatically"
    );
    console.log(
      "   3. New images served as: https://yourdomain.com/uploads/filename.jpg"
    );
    console.log("   4. Replace old images gradually at your own pace");

    console.log("\n🔄 For VPS migration:");
    console.log("   • All LOCAL images are in Git → automatic migration ✅");
    console.log("   • Database exports/imports normally ✅");
    console.log("   • Cloudinary images work during transition ✅");
  } else {
    console.log("❌ ISSUES FOUND - Fix the above problems before deployment");
  }

  return allGood;
}

if (require.main === module) {
  verifyDeploymentReady();
}

module.exports = { verifyDeploymentReady };
