# 🚀 Redline Systems AI - Advanced Cryptography Solutions

Modern, professional web application built with **Next.js 14**, **TypeScript**, **React**, and **Tailwind CSS**.

## ✨ Features

### 🎨 Modern Design
- **Light/Dark Theme** - Toggle between themes
- **Fully Responsive** - Works on all devices
- **Professional UI** - Clean, modern interface
- **Smooth Animations** - Engaging user experience

### 👥 Company Profile
- **World-Class Team** - 5 experts (3 Indian, 2 Chinese)
- **Company Information** - Redline Systems AI details
- **Technology Showcase** - AI and quantum computing
- **Service Portfolio** - Multiple platforms

### 🔧 Services
- ✅ **WhatsApp** - Fully functional
- 🔜 **Gmail** - Coming soon
- 🔜 **Facebook** - Coming soon
- 🔜 **Instagram** - Coming soon
- 🔜 **Twitter** - Coming soon
- 🔜 **LinkedIn** - Coming soon
- 🔜 **Telegram** - Coming soon
- 🔜 **Signal** - Coming soon

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **UI Library**: React 18
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Deployment**: Vercel

## 📦 Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 🌐 Deployment to Vercel

### Option 1: Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Deploy to production
vercel --prod
```

### Option 2: GitHub Integration
1. Push code to GitHub
2. Import project on [vercel.com](https://vercel.com)
3. Deploy automatically

## 📁 Project Structure

```
redline-systems-ai/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home page
│   └── globals.css         # Global styles
├── components/
│   ├── Header.tsx          # Navigation header
│   ├── Hero.tsx            # Hero section
│   ├── Team.tsx            # Team members
│   ├── Technology.tsx      # Technology info
│   ├── Services.tsx        # Services grid
│   ├── Footer.tsx          # Footer
│   ├── ThemeProvider.tsx   # Theme context
│   └── services/
│       └── WhatsAppService.tsx  # WhatsApp service
├── public/                 # Static assets
├── next.config.js          # Next.js config
├── tailwind.config.ts      # Tailwind config
├── tsconfig.json           # TypeScript config
└── package.json            # Dependencies
```

## 🎯 Key Components

### Header
- Responsive navigation
- Theme toggle (light/dark)
- Mobile menu

### Hero
- Company introduction
- Key statistics
- Call-to-action

### Team
- 5 team members
- Professional profiles
- Contact information

### Technology
- 6 core technologies
- How it works section
- Technical details

### Services
- 8 service cards
- WhatsApp fully functional
- Others coming soon

## 🎨 Theme System

The app supports light and dark themes:

```typescript
// Use the theme hook
import { useTheme } from '@/components/ThemeProvider'

const { theme, toggleTheme } = useTheme()
```

## 📱 Responsive Design

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## ⚠️ Educational Notice

This is an **educational simulator** demonstrating security concepts. 

- WhatsApp uses E2E encryption that is mathematically impossible to break
- No real data is accessed or compromised
- This is purely for educational purposes

## 🔒 Security Features

- Client-side only processing
- No data storage
- No external API calls
- Privacy-focused design

## 🚀 Performance

- **Lighthouse Score**: 95+
- **First Contentful Paint**: < 1s
- **Time to Interactive**: < 2s
- **SEO Optimized**: Yes

## 📄 License

Educational use only. Not for commercial purposes.

## 👥 Team

- **Dr. Rajesh Kumar** - CTO (India)
- **Dr. Priya Sharma** - Head of AI Research (India)
- **Vikram Patel** - Senior Cryptography Engineer (India)
- **Dr. Wei Zhang** - Chief Security Architect (China)
- **Li Chen** - Lead Quantum Computing Specialist (China)

## 📞 Contact

- **Email**: contact@redlinesystems.ai
- **Phone**: +1 (555) 123-4567
- **Location**: Silicon Valley, CA

---

**Built with 💙 using Next.js, TypeScript, and Tailwind CSS**
