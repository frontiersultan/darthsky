# Deployment Guide

Darth Sky Weather is a static site that can be deployed to any static hosting provider.

## Build for Production

```bash
npm run build
```

This creates a `dist/` folder with optimized static files.

## Deployment Options

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project at [vercel.com/new](https://vercel.com/new)
3. Vercel auto-detects Vite and configures build settings
4. Deploy!

**Configuration** (optional `vercel.json`):
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite"
}
```

### Netlify

1. Push your code to GitHub
2. New site from Git at [app.netlify.com](https://app.netlify.com)
3. Configure:
   - Build command: `npm run build`
   - Publish directory: `dist`

**Configuration** (`netlify.toml`):
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### GitHub Pages

1. Install gh-pages: `npm install -D gh-pages`
2. Add to `package.json`:
   ```json
   {
     "scripts": {
       "deploy": "npm run build && gh-pages -d dist"
     },
     "homepage": "https://yourusername.github.io/darthsky"
   }
   ```
3. Update `vite.config.ts`:
   ```typescript
   export default defineConfig({
     base: '/darthsky/',
     // ... other config
   });
   ```
4. Run `npm run deploy`

### Cloudflare Pages

1. Connect GitHub repo at [pages.cloudflare.com](https://pages.cloudflare.com)
2. Configure:
   - Build command: `npm run build`
   - Build output directory: `dist`

### Self-Hosted (nginx)

```nginx
server {
    listen 80;
    server_name weather.example.com;
    root /var/www/darthsky/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

## PWA Considerations

### HTTPS Required
Service workers require HTTPS. All recommended platforms provide automatic HTTPS.

### Service Worker Caching
The build includes a service worker for offline support. On deployment:
- First visit: Assets cached
- Subsequent visits: Served from cache
- Updates: New service worker installed in background

### Cache Invalidation
Vite includes content hashes in filenames, so new deployments automatically bust caches.

## Environment-Specific Configuration

For different environments, you can use Vite's environment modes:

```bash
# Development
npm run dev

# Production build
npm run build

# Preview production locally
npm run preview
```

## Post-Deployment Checklist

- [ ] Verify HTTPS is working
- [ ] Test PWA installation
- [ ] Check offline functionality
- [ ] Verify all API calls work (CORS)
- [ ] Test on mobile devices
- [ ] Run Lighthouse audit
