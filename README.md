# Quantum Gallery — AI-Orchestrated Scene Framework

## Overview
**Quantum Gallery (JRG_ARC)** is a modular research and visualization environment built with **TypeScript, React, Vite, and React Three Fiber (R3F)**.
It powers dynamic, AI-driven 3D scenes designed to showcase interactive entities, procedural animations, and live data orchestration.

This repository forms part of Joshua Gutierrez's advanced scene and research architecture stack.

---

## ✅ Current Implementation Summary

### Core Systems
- **BehaviorSystem** — pluggable per-frame behavior engine; manages ticked behaviors with enable/disable control.
- **BehaviorRegistry** — dynamic registry for registering, activating, and deactivating behaviors by name.
- **AIChannel (aiState)** — key-value reactive store enabling runtime parameter overrides, easily updated from AI or user code.
- **BaseBehavior** — abstract base class for creating type-safe behaviors with common patterns.
- **Logger** — environment-aware logging abstraction with configurable levels.
- **ErrorBoundary** — React error boundary for graceful error handling.
- **TorusPulse Behaviors**
  - `createTorusPulseOscillator` — time-based amplitude/speed oscillator.
  - `createTorusPulseAIOverrides` — reads values from `aiState` to override live parameters.
- **AIBridge (window.qg)** — dev console utility for manual control during runtime:
  ```js
  qg.set('torusPulse.amplitude', 0.9);
  qg.behaviors.activate('torusPulse/osc', { amplitude: 0.6, speed: 1.2 });
  qg.behaviors.deactivate('torusPulse/osc');
  qg.behaviors.list();
  qg.snapshot();
  ```
- **SceneManager Integration** — runtime loop now ticks `behaviorSystem.update(dt, mgr)` each frame via `useSceneManager` hook.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 20.19+
- PNPM 9.x

### Installation
```bash
pnpm install
```

### Development
```bash
pnpm dev
```
Then open [http://localhost:5173](http://localhost:5173).

### Build
```bash
pnpm build
# Or without pnpm:
npx vite build --config apps/web/vite.config.ts
```

### Production Deployment (cPanel/GoDaddy)

```bash
# Create deployment zip (from project root)
cd apps/web/dist
zip -r ~/Downloads/portfolio-build.zip . -x "packages/*" -x "apps/*" -x "REQUIRED_IMAGES.txt"
```

**Deploy steps:**
1. Upload `portfolio-build.zip` to `public_html` via cPanel File Manager
2. Extract files directly (files should be at root level, not in a subfolder)
3. Set `.htaccess` permissions to `644`

**If you get a 403 Forbidden error**, replace `.htaccess` with:
```apache
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^ index.html [L]
```

### Testing
```bash
pnpm test          # Watch mode
pnpm test:run      # Single run
pnpm test:coverage # With coverage
```

### Linting & Formatting
```bash
pnpm lint          # Run ESLint
pnpm lint:fix      # Fix ESLint issues
pnpm format        # Format with Prettier
pnpm format:check  # Check formatting
pnpm typecheck     # TypeScript check
```

---

## 🧩 Architecture

```
jrg_arc/
├── apps/web/                   # React + R3F frontend
│   ├── src/
│   │   ├── components/
│   │   │   └── ErrorBoundary.tsx
│   │   ├── hooks/
│   │   │   └── useSceneManager.ts
│   │   └── index.tsx
│   └── vite.config.ts
├── packages/core/              # Core scene and content logic
│   ├── src/
│   │   ├── scene/
│   │   │   ├── SceneManager.ts
│   │   │   ├── BehaviorSystem.ts
│   │   │   ├── BehaviorRegistry.ts
│   │   │   ├── AIState.ts
│   │   │   ├── AIBridge.ts
│   │   │   ├── behaviors/
│   │   │   │   ├── BaseBehavior.ts
│   │   │   │   ├── TorusPulseOscillator.ts
│   │   │   │   └── TorusPulseAIOverrides.ts
│   │   │   └── __tests__/
│   │   │       ├── BehaviorSystem.test.ts
│   │   │       ├── SceneManager.test.ts
│   │   │       └── AIState.test.ts
│   │   ├── entities/
│   │   │   └── TorusPulse.ts
│   │   ├── utils/
│   │   │   └── logger.ts
│   │   └── index.ts
│   └── tsconfig.json
└── packages/ui/                # UI components and overlays
    └── src/
        └── index.tsx
```

---

## 🧠 Development Guide

### Creating a New Behavior

```typescript
import { BaseBehavior, BehaviorOptions } from '@core';
import type { SceneManager } from '@core';

interface MyBehaviorOptions extends BehaviorOptions {
  speed?: number;
}

class MyBehavior extends BaseBehavior {
  private speed: number;

  constructor(options?: MyBehaviorOptions) {
    super(options);
    this.speed = options?.speed ?? 1.0;
  }

  onTick(dt: number, time: number, manager: SceneManager): void {
    // Your behavior logic here
    this.forEachEntity(manager, 'TorusPulse', (entity) => {
      this.setEntityParam(entity, 'amplitude', Math.sin(time * this.speed));
    });
  }
}

// Factory function for registry
export const createMyBehavior = (options?: MyBehaviorOptions) => new MyBehavior(options);
```

### Using the Logger

```typescript
import { logger } from '@core';

logger.debug('Debug message');  // Only in development
logger.info('Info message');
logger.warn('Warning message');
logger.error('Error message');

// Create child logger with prefix
const myLogger = logger.child('MyComponent');
myLogger.info('Component initialized');
```

### Dev Console Commands
Open browser console after launch:
```js
qg.help();                                    // Print usage guide
qg.set('torusPulse.amplitude', 0.8);         // Set AI state value
qg.get('torusPulse.amplitude');              // Get AI state value
qg.snapshot();                                // Get all AI state
qg.behaviors.factories();                     // List available behaviors
qg.behaviors.list();                          // List active behaviors
qg.behaviors.activate('torusPulse/osc');     // Activate behavior
qg.behaviors.deactivate('torusPulse/osc');   // Deactivate behavior
```

---

## 🔧 Configuration

### Environment Variables
Create a `.env.local` file (see `.env.example`):

```env
VITE_ENABLE_DEV_BRIDGE=true
VITE_LOG_LEVEL=debug
```

### Logger Levels
- `debug` - All messages (development default)
- `info` - Info and above
- `warn` - Warnings and errors only (production default)
- `error` - Errors only
- `none` - No logging

---

## 🚀 Upcoming Milestones

### AI-Orchestration Layer (Next Phase)
1. **LLM Signal Layer** — Bridge `aiState` with external AI inference results.
2. **Runtime Adapters** — Connect behavior inputs to WebSocket, OSC, or local agents.
3. **Scene-to-LLM Feedback** — Publish telemetry to AI systems for contextual awareness.
4. **Declarative Scene Scripts** — Define behaviors using JSON/Markdown config.

---

## 🧱 Tech Stack
- Node.js 20.19+
- PNPM 9.x (monorepo workspaces)
- TypeScript 5.x (strict mode)
- Vite 7.x with code splitting
- React 19 + React Three Fiber
- Three.js 0.181
- Vitest for testing
- ESLint + Prettier for code quality

---

## 👨‍💻 Author
**Joshua Gutierrez (@joshuarg007)**
Quantum Gallery is part of the **JRG_ARC** research continuum focused on blending procedural scene intelligence, physics-based art, and AI-signal-driven visual computation.
<!-- v1 -->
