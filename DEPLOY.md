# 🚀 Guia de Deploy - Matrix Edition

## 📦 Opções de Deploy

### 1. Vercel (Recomendado) ⚡

#### Deploy Automático via GitHub
```bash
# 1. Crie um repositório no GitHub
git init
git add .
git commit -m "Matrix Edition - Initial commit"
git branch -M main
git remote add origin https://github.com/seu-usuario/seu-repo.git
git push -u origin main

# 2. Acesse vercel.com
# 3. Clique em "Import Project"
# 4. Selecione seu repositório
# 5. Deploy automático!
```

#### Deploy via CLI
```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Deploy para produção
vercel --prod
```

**Configuração**: O arquivo `vercel.json` já está configurado!

**URL**: Seu projeto estará em `https://seu-projeto.vercel.app`

---

### 2. Netlify 🌐

#### Deploy via Drag & Drop
1. Acesse [netlify.com](https://netlify.com)
2. Arraste a pasta do projeto
3. Pronto! Deploy instantâneo

#### Deploy via CLI
```bash
# Instalar Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy

# Deploy para produção
netlify deploy --prod
```

#### Configuração (netlify.toml)
```toml
[build]
  publish = "."
  
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    X-XSS-Protection = "1; mode=block"
```

---

### 3. GitHub Pages 📄

#### Configuração
```bash
# 1. Criar repositório no GitHub
# 2. Push do código

# 3. Ir em Settings > Pages
# 4. Source: Deploy from a branch
# 5. Branch: main / (root)
# 6. Save
```

**URL**: `https://seu-usuario.github.io/seu-repo`

---

### 4. Firebase Hosting 🔥

```bash
# Instalar Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Inicializar
firebase init hosting

# Configurar:
# - Public directory: .
# - Single-page app: Yes
# - GitHub integration: Optional

# Deploy
firebase deploy
```

#### firebase.json
```json
{
  "hosting": {
    "public": ".",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ],
    "headers": [
      {
        "source": "**",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "public, max-age=31536000"
          }
        ]
      }
    ]
  }
}
```

---

### 5. Cloudflare Pages ☁️

#### Deploy via Dashboard
1. Acesse [pages.cloudflare.com](https://pages.cloudflare.com)
2. Conecte seu repositório GitHub
3. Configure:
   - Build command: (deixe vazio)
   - Build output directory: .
4. Deploy!

#### Deploy via CLI
```bash
# Instalar Wrangler
npm install -g wrangler

# Login
wrangler login

# Deploy
wrangler pages publish .
```

---

### 6. Surge.sh ⚡

```bash
# Instalar Surge
npm install -g surge

# Deploy
surge .

# Deploy com domínio customizado
surge . seu-dominio.surge.sh
```

---

### 7. Render 🎨

1. Acesse [render.com](https://render.com)
2. New > Static Site
3. Conecte repositório GitHub
4. Configure:
   - Build Command: (vazio)
   - Publish Directory: .
5. Deploy!

---

## 🔧 Configurações Importantes

### Headers de Segurança
```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
```

### Cache
```
CSS/JS: max-age=31536000 (1 ano)
HTML: no-cache
```

### Compressão
- Habilite Gzip/Brotli
- Minifique CSS/JS (opcional)

---

## 🌍 Domínio Customizado

### Vercel
```bash
# Via CLI
vercel domains add seu-dominio.com

# Via Dashboard
# Settings > Domains > Add
```

### Netlify
```bash
# Via CLI
netlify domains:add seu-dominio.com

# Via Dashboard
# Domain settings > Add custom domain
```

### Cloudflare
```
# Dashboard > Pages > Custom domains
# Adicione seu domínio
```

---

## 📊 Monitoramento

### Analytics (Opcional)

#### Google Analytics
```html
<!-- Adicione no <head> do index.html -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

#### Vercel Analytics
```bash
# Habilite no dashboard
# Settings > Analytics > Enable
```

---

## 🔒 Variáveis de Ambiente

### Vercel
```bash
# Via CLI
vercel env add NODE_ENV production

# Via Dashboard
# Settings > Environment Variables
```

### Netlify
```bash
# Via CLI
netlify env:set NODE_ENV production

# Via Dashboard
# Site settings > Environment variables
```

---

## ✅ Checklist Pré-Deploy

- [ ] Testar localmente
- [ ] Verificar responsividade
- [ ] Testar em diferentes navegadores
- [ ] Verificar console (sem erros)
- [ ] Otimizar imagens (se houver)
- [ ] Minificar CSS/JS (opcional)
- [ ] Configurar headers de segurança
- [ ] Testar performance (Lighthouse)
- [ ] Verificar SEO básico
- [ ] Adicionar favicon (opcional)

---

## 🎯 Performance

### Lighthouse Score Esperado
- Performance: 95-100
- Accessibility: 90-100
- Best Practices: 95-100
- SEO: 90-100

### Otimizações
```bash
# Minificar CSS
npx cssnano styles.css styles.min.css

# Minificar JS
npx terser script.js -o script.min.js

# Comprimir imagens (se houver)
npx imagemin *.{jpg,png} --out-dir=optimized
```

---

## 🐛 Troubleshooting

### Deploy falha
- Verifique logs do serviço
- Confirme estrutura de arquivos
- Teste localmente primeiro

### 404 em rotas
- Configure redirects/rewrites
- Verifique vercel.json ou netlify.toml

### CSS/JS não carrega
- Verifique caminhos relativos
- Confirme headers de cache
- Limpe cache do CDN

### Performance baixa
- Habilite compressão
- Configure cache adequadamente
- Minifique assets

---

## 📱 PWA (Opcional)

### manifest.json
```json
{
  "name": "AI WhatsApp Recovery - Matrix",
  "short_name": "WhatsApp Matrix",
  "description": "Simulador educacional estilo Matrix",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#000000",
  "theme_color": "#00ff41",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

### service-worker.js
```javascript
const CACHE_NAME = 'matrix-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/styles.css',
  '/script.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
```

---

## 🎉 Deploy Completo!

Após o deploy, seu projeto estará disponível em:
- **Vercel**: `https://seu-projeto.vercel.app`
- **Netlify**: `https://seu-projeto.netlify.app`
- **GitHub Pages**: `https://usuario.github.io/repo`
- **Firebase**: `https://projeto.web.app`
- **Cloudflare**: `https://projeto.pages.dev`

---

**Boa sorte com o deploy! 🚀💚**
