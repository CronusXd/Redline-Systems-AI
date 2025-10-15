# 🚀 Deployment Guide - Redline Systems AI

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Vercel account (free)

## Quick Deploy to Vercel

### Method 1: Vercel CLI (Fastest)

```bash
# 1. Install Vercel CLI globally
npm install -g vercel

# 2. Login to Vercel
vercel login

# 3. Deploy (from project root)
vercel

# 4. Deploy to production
vercel --prod
```

### Method 2: GitHub + Vercel (Recommended)

1. **Push to GitHub**
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/redline-systems-ai.git
git push -u origin main
```

2. **Import to Vercel**
- Go to [vercel.com](https://vercel.com)
- Click "New Project"
- Import your GitHub repository
- Click "Deploy"

### Method 3: Vercel Dashboard

1. Go to [vercel.com/new](https://vercel.com/new)
2. Drag and drop your project folder
3. Click "Deploy"

## Environment Variables

No environment variables required for basic deployment.

## Build Configuration

Vercel automatically detects Next.js and uses these settings:

```json
{
  "buildCommand": "next build",
  "outputDirectory": ".next",
  "installCommand": "npm install",
  "devCommand": "next dev"
}
```

## Custom Domain

1. Go to your project on Vercel
2. Settings → Domains
3. Add your custom domain
4. Follow DNS configuration instructions

## Performance Optimization

The app is already optimized with:

- ✅ Static generation where possible
- ✅ Image optimization
- ✅ Code splitting
- ✅ CSS optimization
- ✅ Font optimization

## Monitoring

After deployment, monitor your app:

- **Analytics**: Vercel Analytics (automatic)
- **Logs**: Vercel Dashboard → Logs
- **Performance**: Lighthouse CI

## Troubleshooting

### Build Fails

```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

### TypeScript Errors

```bash
# Check TypeScript
npm run lint
```

### Missing Dependencies

```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

## Production Checklist

- [ ] All dependencies installed
- [ ] Build succeeds locally
- [ ] No TypeScript errors
- [ ] No console errors
- [ ] Responsive on all devices
- [ ] Theme toggle works
- [ ] All links functional
- [ ] Images load correctly

## Post-Deployment

1. **Test the live site**
   - Check all pages
   - Test theme toggle
   - Verify responsiveness
   - Test WhatsApp service

2. **Share the URL**
   - Your app will be at: `https://your-project.vercel.app`

3. **Monitor performance**
   - Check Vercel Analytics
   - Review Lighthouse scores

## Support

- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
- **Next.js Docs**: [nextjs.org/docs](https://nextjs.org/docs)

---

**Deployment Time**: ~2 minutes ⚡
