# 🚀 Installation Guide - Redline Systems AI

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Build for Production

```bash
npm run build
```

### 4. Start Production Server

```bash
npm start
```

## Troubleshooting

### Error: Module not found

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json .next
npm install
```

### Error: Port 3000 already in use

```bash
# Use different port
npm run dev -- -p 3001
```

### Error: TypeScript errors

```bash
# Check TypeScript
npm run lint
```

### Build Errors

If you get CSS or Tailwind errors:

```bash
# Clear Next.js cache
rm -rf .next
npm run build
```

## Deploy to Vercel

### Option 1: Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel

# Deploy to production
vercel --prod
```

### Option 2: GitHub + Vercel

1. Push to GitHub:
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin YOUR_REPO_URL
git push -u origin main
```

2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Click "Deploy"

## Environment Setup

No environment variables required for basic setup.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## System Requirements

- Node.js 18.x or higher
- npm 9.x or higher
- 2GB RAM minimum
- Modern web browser

## Development Tips

### Hot Reload
Changes are automatically reflected in the browser.

### Theme Toggle
Click the sun/moon icon in the header to switch themes.

### Responsive Testing
Use browser DevTools to test different screen sizes.

## Common Issues

### Issue: "Cannot find module"
**Solution**: Run `npm install`

### Issue: "Port already in use"
**Solution**: Kill the process or use different port

### Issue: "Build fails"
**Solution**: Clear `.next` folder and rebuild

### Issue: "Styles not loading"
**Solution**: Check `tailwind.config.ts` and `globals.css`

## Next Steps

1. ✅ Install dependencies
2. ✅ Run dev server
3. ✅ Test in browser
4. ✅ Build for production
5. ✅ Deploy to Vercel

## Support

- **Documentation**: See README_NEW.md
- **Deployment**: See DEPLOYMENT.md
- **Issues**: Check error messages carefully

---

**Installation Time**: ~2 minutes ⚡
