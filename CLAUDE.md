# Quantum Gallery - Portfolio Website

Personal portfolio website featuring an interactive 3D galaxy scene built with React Three Fiber.

## Project Structure

```
jrg_arc/
├── apps/web/           # Main web application
│   ├── src/
│   │   ├── components/ # React components
│   │   │   ├── nodes/  # 3D node visualizations
│   │   │   ├── scene/  # Scene management
│   │   │   └── showcase/ # Panel components
│   │   ├── data/       # Project data
│   │   ├── pages/      # Page components
│   │   └── index.tsx   # Entry point + custom cursor
│   ├── public/         # Static assets
│   └── dist/           # Build output
├── packages/
│   ├── core/           # Shared logic
│   └── ui/             # Shared UI components
└── vite.config.ts      # Vite configuration
```

## Tech Stack

- React 19 + TypeScript
- React Three Fiber (Three.js)
- Vite 7
- Custom particle cursor system

## Development

```bash
# Install dependencies (from root)
npm install

# Run dev server
npx vite --config apps/web/vite.config.ts

# Type check
npm run build   # in apps/web/
```

## Production Build & Deployment (cPanel/GoDaddy)

### Build

```bash
# From project root
npx vite build --config apps/web/vite.config.ts

# Create deployment zip (files at root level, exclude dev artifacts)
cd apps/web/dist
zip -r ~/Downloads/portfolio-build.zip . -x "packages/*" -x "apps/*" -x "REQUIRED_IMAGES.txt"
```

### Deploy to cPanel/GoDaddy

1. **Upload** `portfolio-build.zip` to your domain's `public_html` folder via cPanel File Manager
2. **Extract** the zip directly in `public_html` (files should be at root, not in a subfolder)
3. **Set .htaccess permissions** to `644` (right-click → Change Permissions)
4. **If 403 error persists**, replace `.htaccess` content with:
   ```apache
   RewriteEngine On
   RewriteCond %{REQUEST_FILENAME} !-f
   RewriteCond %{REQUEST_FILENAME} !-d
   RewriteRule ^ index.html [L]
   ```

### .htaccess (SPA Routing)

The `.htaccess` file enables client-side routing. Without it, direct URLs like `/resume` will 404.

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

## Custom Cursor

The site features a custom particle tendril cursor with:
- RGB color cycling center core
- Particles that "escape" and spring back to center
- Disabled on touch devices

CSS in `index.html` hides the default cursor immediately on load:
```css
@media (pointer: fine) {
  * { cursor: none !important; }
}
```

## Notes

- Build output goes to `apps/web/dist/`
- Three.js vendor chunk is ~870KB (expected for 3D)
- Touch events have null guards for TypeScript strict mode
