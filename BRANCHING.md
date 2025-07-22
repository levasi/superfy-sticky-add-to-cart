# Git Branching Strategy

## 🌿 **Branch Structure**

### **Main Branches:**
- `main` - Production-ready code (deployed to Railway)
- `develop` - Integration branch for features

### **Development Branches:**
- `feature/feature-name` - New features
- `bugfix/bug-description` - Bug fixes
- `hotfix/urgent-fix` - Critical production fixes

## 🚀 **Workflow**

### **Starting New Work:**

1. **Create feature branch from develop:**
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/your-feature-name
   ```

2. **Work on your feature:**
   ```bash
   # Make changes
   git add .
   git commit -m "feat: add new feature"
   git push origin feature/your-feature-name
   ```

3. **Merge back to develop:**
   ```bash
   # Create Pull Request on GitHub
   # Or merge locally:
   git checkout develop
   git merge feature/your-feature-name
   git push origin develop
   ```

### **Deploying to Production:**

1. **Merge develop to main:**
   ```bash
   git checkout main
   git merge develop
   git push origin main
   ```

2. **Railway auto-deploys** from main branch

## 📋 **Branch Naming Conventions**

### **Feature Branches:**
```bash
feature/add-sticky-cart-animation
feature/improve-settings-ui
feature/add-analytics-tracking
```

### **Bug Fix Branches:**
```bash
bugfix/fix-migration-error
bugfix/resolve-asset-loading-issue
bugfix/fix-database-connection
```

### **Hotfix Branches:**
```bash
hotfix/fix-critical-security-issue
hotfix/fix-production-crash
hotfix/urgent-database-fix
```

## 🔄 **Development Workflow Example**

### **Scenario: Adding a new setting**

1. **Start from develop:**
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/add-custom-color-setting
   ```

2. **Make changes:**
   ```bash
   # Edit files
   git add .
   git commit -m "feat: add custom color setting for sticky cart"
   git push origin feature/add-custom-color-setting
   ```

3. **Test locally:**
   ```bash
   npm run dev
   # Test the new feature
   ```

4. **Merge to develop:**
   ```bash
   git checkout develop
   git merge feature/add-custom-color-setting
   git push origin develop
   ```

5. **Deploy to production:**
   ```bash
   git checkout main
   git merge develop
   git push origin main
   # Railway auto-deploys
   ```

## 🛡️ **Best Practices**

### **Before Starting Work:**
- Always pull latest changes: `git pull origin develop`
- Create descriptive branch names
- Keep branches focused on single features

### **During Development:**
- Commit frequently with clear messages
- Use conventional commit messages:
  - `feat:` for new features
  - `fix:` for bug fixes
  - `docs:` for documentation
  - `refactor:` for code improvements

### **Before Merging:**
- Test your changes locally
- Ensure all tests pass
- Update documentation if needed
- Create descriptive pull requests

## 🚨 **Emergency Hotfixes**

For critical production issues:

1. **Create hotfix from main:**
   ```bash
   git checkout main
   git checkout -b hotfix/critical-database-fix
   ```

2. **Fix the issue:**
   ```bash
   # Make urgent changes
   git add .
   git commit -m "hotfix: fix critical database connection issue"
   ```

3. **Deploy immediately:**
   ```bash
   git checkout main
   git merge hotfix/critical-database-fix
   git push origin main
   # Railway auto-deploys
   ```

4. **Merge back to develop:**
   ```bash
   git checkout develop
   git merge hotfix/critical-database-fix
   git push origin develop
   ```

## 📊 **Current Branch Status**

- ✅ `main` - Production branch (deployed to Railway)
- ✅ `develop` - Development integration branch
- 🔄 `feature/*` - Feature branches (create as needed)
- 🔄 `bugfix/*` - Bug fix branches (create as needed)

## 🎯 **Benefits of This Strategy**

- ✅ **Safe development** - Never break production
- ✅ **Parallel work** - Multiple features simultaneously
- ✅ **Easy rollbacks** - Can revert specific features
- ✅ **Clear history** - Organized commit history
- ✅ **Team collaboration** - Clear workflow for multiple developers 