# 🔨 Build Instructions

## Clean Build Process

### Step 1: Clean Everything
```bash
# Windows (PowerShell)
Remove-Item -Recurse -Force .next, node_modules
Remove-Item package-lock.json

# Linux/Mac
rm -rf .next node_modules package-lock.json
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Build
```bash
npm run build
```

### Step 4: Test Production Build
```bash
npm start
```

## Quick Build (if no errors)
```bash
npm run build
```

## Development Mode
```bash
npm run dev
```

## Troubleshooting

### Error: "useTheme must be used within a ThemeProvider"
✅ **FIXED** - Theme is now handled locally in Header component

### Error: "ESLint must be installed"
✅ **FIXED** - ESLint added to devDependencies

### Error: "border-border class does not exist"
✅ **FIXED** - Removed invalid Tailwind class

### Build Still Fails?

1. **Clear cache completely**:
```bash
rm -rf .next node_modules package-lock.json
npm install
npm run build
```

2. **Check Node version**:
```bash
node --version  # Should be 18.x or higher
```

3. **Update dependencies**:
```bash
npm update
npm run build
```

## Expected Output

When build succeeds, you should see:
```
✓ Creating an optimized production build
✓ Compiled successfully
✓ Linting and checking validity of types
✓ Collecting page data
✓ Generating static pages (4/4)
✓ Finalizing page optimization

Route (app)                              Size     First Load JS
┌ ○ /                                    5.2 kB         87.3 kB
└ ○ /_not-found                          871 B          83.0 kB
```

## Deploy to Vercel

After successful build:
```bash
vercel --prod
```

## Common Issues

### Issue: Module not found
```bash
npm install
```

### Issue: TypeScript errors
```bash
npm run lint
```

### Issue: Port in use
```bash
# Use different port
npm run dev -- -p 3001
```

## Files Changed

✅ `components/Header.tsx` - Theme logic moved here
✅ `app/layout.tsx` - Removed ThemeProvider
✅ `app/page.tsx` - Removed 'use client'
✅ `app/globals.css` - Fixed border classes
✅ `package.json` - Added ESLint
✅ All components - Removed unnecessary 'use client'

## Build Time

- **Clean build**: ~30-60 seconds
- **Incremental build**: ~5-10 seconds

## Next Steps

1. ✅ Build succeeds
2. ✅ Test locally (`npm start`)
3. ✅ Deploy to Vercel
4. ✅ Test live site

---

**All errors fixed! Build should work now. 🎉**
