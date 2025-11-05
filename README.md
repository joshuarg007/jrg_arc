# Quantum Gallery — AI-Orchestrated Scene Framework

## Overview
**Quantum Gallery (JRG_ARC)** is a modular research and visualization environment built with **TypeScript, React, Vite, and React Three Fiber (R3F)**.  
It powers dynamic, AI-driven 3D scenes designed to showcase interactive entities, procedural animations, and live data orchestration.

This repository forms part of Joshua Gutierrez’s advanced scene and research architecture stack.

---

## ✅ Current Implementation Summary

### Core Systems
- **BehaviorSystem** — pluggable per-frame behavior engine; manages ticked behaviors with enable/disable control.
- **BehaviorRegistry** — dynamic registry for registering, activating, and deactivating behaviors by name.
- **AIChannel (aiState)** — key-value reactive store enabling runtime parameter overrides, easily updated from AI or user code.
- **TorusPulse Behaviors**
  - `createTorusPulseOscillator` — time-based amplitude/speed oscillator.
  - `createTorusPulseAIOverrides` — reads values from `aiState` to override live parameters.
- **AIBridge (window.qg)** — dev console utility for manual control during runtime:
  ```js
  qg.set('torusPulse.amplitude', 0.9);
  qg.behaviors.activate('torusPulse/osc', { amplitude: 0.6, speed: 1.2 });
  qg.behaviors.list();
  qg.snapshot();
  ```
- **SceneManager Integration** — runtime loop now ticks `behaviorSystem.update(dt, mgr)` each frame via `useSceneManager` hook.

---

## 🚀 Upcoming Milestones

### AI-Orchestration Layer (Next Phase)
The next engineering session will focus on extending scene intelligence with real-time AI orchestration and signal routing:

1. **LLM Signal Layer**
   - Bridge `aiState` with external AI inference results or local models.
   - Automatic conversion of semantic AI responses into behavior activations.
2. **Runtime Adapters**
   - Connect behavior inputs to external data streams (WebSocket, OSC, or local agent).
3. **Scene-to-LLM Feedback**
   - Allow SceneManager or entities to publish telemetry to AI systems for contextual awareness.
4. **Declarative Scene Scripts**
   - Define interactive behaviors and scene events using simple JSON or Markdown-driven config.

---

## 🧩 Architecture
```
jrg_arc/
├── apps/web/               # React + R3F frontend
│   ├── src/hooks/useSceneManager.ts
│   ├── src/hooks/useSceneRuntime.ts
│   └── src/index.tsx
├── packages/core/          # Core scene and content logic
│   ├── scene/BehaviorSystem.ts
│   ├── scene/BehaviorRegistry.ts
│   ├── scene/AIState.ts
│   ├── scene/AIBridge.ts
│   └── scene/behaviors/
│       ├── TorusPulseOscillator.ts
│       └── TorusPulseAIOverrides.ts
└── packages/ui/            # UI components and overlays
```

---

## 🧠 Dev Usage
### Running Locally
```bash
pnpm install
pnpm dev
```
Then open [http://localhost:5173](http://localhost:5173).

### Development Bridge Commands
Open browser console after launch:
```js
qg.help(); // prints usage guide
qg.set('torusPulse.amplitude', 0.8);
qg.behaviors.factories();
qg.behaviors.activate('torusPulse/ai');
qg.behaviors.deactivateAll();
```

---

## 🧱 Tech Stack
- Node.js 20.19+
- PNPM 9.x
- TypeScript 5.x
- Vite + @vitejs/plugin-react
- React + React Three Fiber (Three.js)
- Modular monorepo with packages/core + packages/ui

---

## 👨‍💻 Author
**Joshua Gutierrez (@joshuarg007)**  
Quantum Gallery is part of the **JRG_ARC** research continuum focused on blending procedural scene intelligence, physics-based art, and AI-signal-driven visual computation.

