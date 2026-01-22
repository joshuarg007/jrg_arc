// apps/web/src/index.tsx
/// <reference types="vite/client" />
import React, { useState, useEffect, useRef, useCallback, CSSProperties, Suspense, lazy } from 'react';
import { createRoot } from 'react-dom/client';
import { Canvas } from '@react-three/fiber';
import { ErrorBoundary } from './components/ErrorBoundary';
import { GalaxyScene, CameraController, BackgroundEffects } from './components/scene';
import { getProjectById, projects } from './data/projects';
import type { ProjectNode } from '@core/types/project';

// Lazy load panels for better initial performance
const ProjectPanel = lazy(() => import('./components/showcase/ProjectPanel'));
const ContactPanel = lazy(() => import('./components/showcase/ContactPanel'));
const AboutPanel = lazy(() => import('./components/showcase/AboutPanel'));
const HobbiesPanel = lazy(() => import('./components/showcase/HobbiesPanel'));
const ResumePage = lazy(() => import('./pages/ResumePage'));

// Mobile breakpoint
const MOBILE_BREAKPOINT = 768;

// === ACCESSIBILITY & PERFORMANCE HOOKS ===

// Hook to detect prefers-reduced-motion
function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return prefersReducedMotion;
}

// Hook to prevent body scroll when panels are open
function useBodyScrollLock(isLocked: boolean) {
  useEffect(() => {
    if (isLocked) {
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        window.scrollTo(0, scrollY);
      };
    }
  }, [isLocked]);
}

// === ANALYTICS ===
interface AnalyticsEvent {
  type: 'project_view' | 'panel_open' | 'contact_submit' | 'navigation';
  projectId?: string;
  panel?: string;
  timestamp: number;
}

const analyticsQueue: AnalyticsEvent[] = [];

function trackEvent(event: Omit<AnalyticsEvent, 'timestamp'>) {
  const fullEvent = { ...event, timestamp: Date.now() };
  analyticsQueue.push(fullEvent);

  // Log to console in dev, could send to analytics service in production
  if (import.meta.env.DEV) {
    console.log('[Analytics]', fullEvent);
  }

  // Store in localStorage for persistence
  try {
    const stored = JSON.parse(localStorage.getItem('portfolio_analytics') || '[]');
    stored.push(fullEvent);
    // Keep only last 100 events
    if (stored.length > 100) stored.shift();
    localStorage.setItem('portfolio_analytics', JSON.stringify(stored));
  } catch (e) {
    // Ignore storage errors
  }
}

// Get analytics summary
function getAnalyticsSummary() {
  try {
    const stored = JSON.parse(localStorage.getItem('portfolio_analytics') || '[]') as AnalyticsEvent[];
    const projectViews: Record<string, number> = {};

    stored.forEach(event => {
      if (event.type === 'project_view' && event.projectId) {
        projectViews[event.projectId] = (projectViews[event.projectId] || 0) + 1;
      }
    });

    return { totalEvents: stored.length, projectViews };
  } catch (e) {
    return { totalEvents: 0, projectViews: {} };
  }
}

// === ROUTING & DEEP LINKING ===
type AppRoute = 'home' | 'resume' | { project: string };

function getCurrentRoute(): AppRoute {
  const path = window.location.pathname;
  const hash = window.location.hash;

  // Check for /resume path
  if (path === '/resume' || path === '/resume/') {
    return 'resume';
  }

  // Check for project hash
  if (hash.startsWith('#/project/')) {
    return { project: hash.replace('#/project/', '') };
  }

  return 'home';
}

function getProjectFromHash(): string | null {
  const route = getCurrentRoute();
  if (typeof route === 'object' && 'project' in route) {
    return route.project;
  }
  return null;
}

function setProjectHash(projectId: string | null) {
  if (projectId) {
    window.history.replaceState(null, '', `#/project/${projectId}`);
  } else {
    window.history.replaceState(null, '', window.location.pathname);
  }
}

function navigateToResume() {
  window.history.pushState(null, '', '/resume');
}

function navigateToHome() {
  window.history.pushState(null, '', '/');
}

// Hook to detect mobile/small screens
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < MOBILE_BREAKPOINT);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return isMobile;
}

// Global responsive styles
const GlobalStyles = () => (
  <style>{`
    @media (max-width: 768px) {
      /* Panels take full width on mobile */
      .panel-overlay {
        width: 100% !important;
        max-width: 100vw !important;
      }

      /* TopNav adjustments for mobile */
      .top-nav-container {
        padding: 8px 12px !important;
      }
      .top-nav-pill {
        gap: 8px !important;
        padding: 6px 10px !important;
      }
      .top-nav-pill .nav-link {
        font-size: 11px !important;
        padding: 6px 10px !important;
      }
      .top-nav-logo {
        font-size: 14px !important;
      }

      /* Celestial grid on mobile */
      .celestial-expanded {
        width: 100% !important;
      }
      .celestial-grid {
        transform: scale(0.85);
        transform-origin: bottom left;
      }

      /* Hide watermark on very small screens */
      .brand-watermark {
        display: none !important;
      }

      /* Adjust navigation hint */
      .nav-hint {
        font-size: 11px !important;
        padding: 8px 16px !important;
      }
    }

    @media (max-width: 480px) {
      /* Extra small screens */
      .top-nav-pill {
        gap: 4px !important;
        padding: 4px 8px !important;
      }
      .top-nav-pill .nav-link {
        font-size: 10px !important;
        padding: 4px 6px !important;
      }
      .top-nav-logo {
        font-size: 12px !important;
      }
      .celestial-grid {
        transform: scale(0.75);
      }
    }
  `}</style>
);

// === LOADING COMPONENTS ===

// Loading overlay for 3D canvas initialization
function CanvasLoader({ visible }: { visible: boolean }) {
  if (!visible) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 200,
        background: '#000',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'system-ui, sans-serif',
        transition: 'opacity 0.5s',
      }}
    >
      {/* Animated hexagon loader */}
      <div style={{ position: 'relative', width: 80, height: 80 }}>
        <svg width="80" height="80" viewBox="0 0 80 80">
          <polygon
            points="40,5 70,22.5 70,57.5 40,75 10,57.5 10,22.5"
            fill="none"
            stroke="rgba(0,240,255,0.3)"
            strokeWidth="2"
          />
          <polygon
            points="40,5 70,22.5 70,57.5 40,75 10,57.5 10,22.5"
            fill="none"
            stroke="#00f0ff"
            strokeWidth="2"
            strokeDasharray="200"
            strokeDashoffset="200"
            style={{
              animation: 'hexLoad 1.5s ease-in-out infinite',
            }}
          />
        </svg>
      </div>
      <p style={{
        marginTop: 24,
        color: 'rgba(255,255,255,0.6)',
        fontSize: 12,
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
      }}>
        Initializing...
      </p>
      <style>{`
        @keyframes hexLoad {
          0% { stroke-dashoffset: 200; }
          50% { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: -200; }
        }
      `}</style>
    </div>
  );
}

// Fallback for lazy-loaded panels
function PanelFallback() {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        right: 0,
        bottom: 0,
        width: 380,
        maxWidth: '100vw',
        background: 'rgba(10, 10, 15, 0.95)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
      }}
    >
      <div
        style={{
          width: 24,
          height: 24,
          border: '2px solid rgba(0,240,255,0.3)',
          borderTopColor: '#00f0ff',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }}
      />
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

// === NEBULA PARTICLES ===
function NebulaParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Nebula area bounds (lower-right of top-left quadrant)
    const areaX = window.innerWidth * 0.05;
    const areaY = window.innerHeight * 0.1;
    const areaW = window.innerWidth * 0.45;
    const areaH = window.innerHeight * 0.45;
    const centerX = areaX + areaW * 0.6;
    const centerY = areaY + areaH * 0.6;
    const maxDist = Math.max(areaW, areaH) * 0.5;

    // Color palette
    const colors = [
      [88, 28, 135],   // purple
      [139, 92, 246],  // violet
      [59, 130, 246],  // blue
      [236, 72, 153],  // pink
      [6, 182, 212],   // cyan
      [168, 85, 247],  // purple-400
    ];

    // Generate particles
    interface Particle {
      angle: number;        // orbital angle around center
      dist: number;         // distance from center
      size: number;
      color: number[];
      rotation: number;     // self rotation
      rotationSpeed: number;
      orbitSpeed: number;   // speed of orbit around center
      baseOpacity: number;
    }

    const particles: Particle[] = [];
    for (let i = 0; i < 300; i++) {
      // Distribute more toward center using gaussian-ish distribution
      const angle = Math.random() * Math.PI * 2;
      const dist = Math.random() * Math.random() * maxDist; // squared for center bias

      // Pick base color and add 10% random variation
      const baseColor = colors[Math.floor(Math.random() * colors.length)] ?? [0, 240, 255];
      const colorVariation = () => Math.floor((Math.random() - 0.5) * 51); // +/- 25 (~10% of 255)
      const variedColor = [
        Math.max(0, Math.min(255, (baseColor[0] ?? 0) + colorVariation())),
        Math.max(0, Math.min(255, (baseColor[1] ?? 240) + colorVariation())),
        Math.max(0, Math.min(255, (baseColor[2] ?? 255) + colorVariation())),
      ];

      // Calculate orbit speed - nucleus (very center) rotates, slower overall
      const distFromCenter = dist / maxDist;
      const orbitFactor = Math.pow(1 - distFromCenter, 4); // quartic falloff - only very center orbits
      const orbitSpeed = orbitFactor * 0.008; // slower, all same direction

      particles.push({
        angle,
        dist,
        size: 1 + Math.random() * 4,
        color: variedColor,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.08,
        orbitSpeed,
        baseOpacity: 0.1 + Math.random() * 0.5,
      });
    }

    // Set canvas size
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Animation
    let animId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        // Update orbital angle (nucleus orbits around center)
        p.angle += p.orbitSpeed;

        // Update self rotation
        p.rotation += p.rotationSpeed;

        // Calculate current position - horizontal rotation with tilt (elliptical orbit)
        const tilt = 0.35; // vertical squash for 3D tilt effect
        const x = centerX + Math.cos(p.angle) * p.dist;
        const y = centerY + Math.sin(p.angle) * p.dist * tilt;

        // Calculate opacity based on distance from center
        const distFactor = 1 - Math.min(p.dist / maxDist, 1);
        const opacity = p.baseOpacity * (0.3 + distFactor * 0.7);

        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(p.rotation);

        // Draw particle (small rotated rectangle/diamond)
        ctx.beginPath();
        const s = p.size;
        ctx.moveTo(0, -s);
        ctx.lineTo(s * 0.6, 0);
        ctx.lineTo(0, s);
        ctx.lineTo(-s * 0.6, 0);
        ctx.closePath();

        ctx.fillStyle = `rgba(${p.color[0]}, ${p.color[1]}, ${p.color[2]}, ${opacity})`;
        ctx.fill();

        ctx.restore();
      });

      animId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 1,
      }}
    />
  );
}

// === BLACK HOLE PARTICLES (clone of nebula with opposite spin) ===
function BlackHoleParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Black hole area bounds (middle-right, slightly below center)
    const areaX = window.innerWidth * 0.50;
    const areaY = window.innerHeight * 0.35;
    const areaW = window.innerWidth * 0.45;
    const areaH = window.innerHeight * 0.50;
    const centerX = areaX + areaW * 0.5;
    const centerY = areaY + areaH * 0.55; // slightly lower than center
    const maxDist = Math.max(areaW, areaH) * 0.45;

    // Dark color palette for black hole
    const colors = [
      [20, 10, 40],    // very dark purple
      [40, 20, 60],    // dark violet
      [15, 30, 50],    // dark blue
      [50, 15, 35],    // dark magenta
      [10, 35, 45],    // dark cyan
      [30, 15, 50],    // dark purple
    ];

    // Generate particles
    interface Particle {
      angle: number;
      dist: number;
      size: number;
      color: number[];
      rotation: number;
      rotationSpeed: number;
      orbitSpeed: number;
      baseOpacity: number;
    }

    const particles: Particle[] = [];
    for (let i = 0; i < 250; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = Math.random() * Math.random() * maxDist;

      const baseColor = colors[Math.floor(Math.random() * colors.length)] ?? [139, 92, 246];
      const colorVariation = () => Math.floor((Math.random() - 0.5) * 30);
      const variedColor = [
        Math.max(0, Math.min(255, (baseColor[0] ?? 139) + colorVariation())),
        Math.max(0, Math.min(255, (baseColor[1] ?? 92) + colorVariation())),
        Math.max(0, Math.min(255, (baseColor[2] ?? 246) + colorVariation())),
      ];

      // OPPOSITE spin direction (negative orbit speed)
      const distFromCenter = dist / maxDist;
      const orbitFactor = Math.pow(1 - distFromCenter, 4);
      const orbitSpeed = -orbitFactor * 0.010; // negative = opposite direction, slightly faster

      particles.push({
        angle,
        dist,
        size: 1 + Math.random() * 3.5,
        color: variedColor,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.10, // opposite rotation tendency
        orbitSpeed,
        baseOpacity: 0.08 + Math.random() * 0.35, // slightly more transparent
      });
    }

    // Set canvas size
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Animation
    let animId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        p.angle += p.orbitSpeed;
        p.rotation += p.rotationSpeed;

        const tilt = 0.35;
        const x = centerX + Math.cos(p.angle) * p.dist;
        const y = centerY + Math.sin(p.angle) * p.dist * tilt;

        const distFactor = 1 - Math.min(p.dist / maxDist, 1);
        const opacity = p.baseOpacity * (0.2 + distFactor * 0.8);

        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(p.rotation);

        ctx.beginPath();
        const s = p.size;
        ctx.moveTo(0, -s);
        ctx.lineTo(s * 0.6, 0);
        ctx.lineTo(0, s);
        ctx.lineTo(-s * 0.6, 0);
        ctx.closePath();

        ctx.fillStyle = `rgba(${p.color[0]}, ${p.color[1]}, ${p.color[2]}, ${opacity})`;
        ctx.fill();

        ctx.restore();
      });

      animId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 1,
      }}
    />
  );
}

// HSL to RGB helper for color cycling
function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
  let r, g, b;
  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }
  return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
}

// === PARTICLE TENDRIL CURSOR ===
interface TendrilParticle {
  angle: number;        // Base angle from center
  baseRadius: number;   // How far it wants to escape
  currentRadius: number;// Current distance from center
  radiusVel: number;    // Velocity of escape/return
  size: number;
  phase: number;        // Animation phase offset
  escapeForce: number;  // How strongly it tries to escape
  color: { r: number; g: number; b: number };
}

function HelixCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mousePos = useRef({ x: -100, y: -100 });
  const particles = useRef<TendrilParticle[]>([]);
  const isInitialized = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Initialize particles - tiny dots trying to escape
    if (!isInitialized.current) {
      const colors = [
        { r: 0, g: 240, b: 255 },
        { r: 100, g: 200, b: 255 },
        { r: 139, g: 92, b: 246 },
        { r: 180, g: 140, b: 255 },
      ];

      for (let i = 0; i < 40; i++) {
        particles.current.push({
          angle: (i / 40) * Math.PI * 2 + Math.random() * 0.3,
          baseRadius: 2 + Math.random() * 23,
          currentRadius: 1 + Math.random() * 2,
          radiusVel: 0,
          size: 0.4 + Math.random() * 0.7,
          phase: Math.random() * Math.PI * 2,
          escapeForce: 0.2 + Math.random() * 0.6,
          color: colors[Math.floor(Math.random() * colors.length)] ?? { r: 0, g: 240, b: 255 },
        });
      }
      isInitialized.current = true;
    }

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', handleMouseMove);

    document.body.style.cursor = 'none';
    document.documentElement.style.cursor = 'none';

    const style = document.createElement('style');
    style.id = 'helix-cursor-style';
    style.textContent = '* { cursor: none !important; }';
    document.head.appendChild(style);

    let animId: number;
    let time = 0;

    const animate = () => {
      time += 0.016;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const { x, y } = mousePos.current;

      ctx.globalCompositeOperation = 'lighter';

      // Update and draw particles
      particles.current.forEach((p, idx) => {
        // Rotate around center
        p.angle += 0.022 + Math.sin(time + p.phase) * 0.008;

        // Escape/return spring physics - glued to center, dramatic escape
        // Use a sine wave that spends more time near 0 (center) and briefly spikes out
        const escapeWave = Math.pow(Math.sin(time * 3 + p.phase * 2), 3); // Cubic makes it snap out/back
        const escapeTarget = p.baseRadius * Math.max(0, escapeWave) * p.escapeForce;

        // Strong pull to center when not escaping
        const centerPull = 2; // How close to center when "glued"
        const targetRadius = centerPull + escapeTarget;
        const springForce = (targetRadius - p.currentRadius) * 0.12;
        const damping = 0.88;

        p.radiusVel += springForce;
        p.radiusVel *= damping;
        p.currentRadius += p.radiusVel;

        // Keep within bounds
        p.currentRadius = Math.max(1.5, Math.min(p.currentRadius, 30));

        // Slight vertical wobble for organic feel
        const wobbleX = Math.sin(time * 4 + p.phase) * 0.5;
        const wobbleY = Math.cos(time * 3.5 + p.phase * 1.3) * 0.5;

        const px = x + Math.cos(p.angle) * p.currentRadius + wobbleX;
        const py = y + Math.sin(p.angle) * p.currentRadius + wobbleY;

        // Draw tendril line from center to particle
        const lineAlpha = 0.1 + (p.currentRadius / 30) * 0.15;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(px, py);
        ctx.strokeStyle = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${lineAlpha})`;
        ctx.lineWidth = 0.3;
        ctx.stroke();

        // Particle glow
        const glowSize = p.size * 3;
        const glow = ctx.createRadialGradient(px, py, 0, px, py, glowSize);
        glow.addColorStop(0, `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, 0.8)`);
        glow.addColorStop(0.5, `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, 0.3)`);
        glow.addColorStop(1, `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, 0)`);

        ctx.beginPath();
        ctx.arc(px, py, glowSize, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();

        // Bright particle core
        ctx.beginPath();
        ctx.arc(px, py, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, 0.9)`;
        ctx.fill();
      });

      // Center core - slow methodical pulse with RGB color cycling
      ctx.globalCompositeOperation = 'source-over';

      // Slow methodical pulse - matches color cycling rhythm
      const slowPulse = (Math.sin(time * 0.8) + 1) / 2; // 0 to 1, slow cycle

      // RGB color cycling like an RGB fan - synced with size pulse
      const hue = (time * 12) % 360; // Rotate through hues slowly
      const rgb = hslToRgb(hue / 360, 1, 0.5);

      // Dramatic pulse from tiny to full size
      const coreSize = 1 + slowPulse * 7; // 1 to 8
      const innerSize = 0.3 + slowPulse * 2.2; // 0.3 to 2.5

      // Outer glow ring
      ctx.beginPath();
      ctx.arc(x, y, coreSize, 0, Math.PI * 2);
      const coreGlow = ctx.createRadialGradient(x, y, 0, x, y, coreSize);
      coreGlow.addColorStop(0, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.9)`);
      coreGlow.addColorStop(0.5, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.4)`);
      coreGlow.addColorStop(1, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0)`);
      ctx.fillStyle = coreGlow;
      ctx.fill();

      // Bright white inner core
      ctx.beginPath();
      ctx.arc(x, y, innerSize, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();

      animId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.body.style.cursor = 'auto';
      document.documentElement.style.cursor = 'auto';
      const styleEl = document.getElementById('helix-cursor-style');
      if (styleEl) styleEl.remove();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 9999,
      }}
    />
  );
}

// === RIFT OVERLAY (Intro Animation) ===
interface RiftOverlayProps {
  onDone: () => void;
}

function RiftOverlay({ onDone }: RiftOverlayProps) {
  const elRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = elRef.current;
    if (!el) return;

    let rafFlicker = 0;
    const flicker = (t0: number) => {
      const now = performance.now();
      const t = (now - t0) / 1000;
      const n =
        Math.sin(t * 3.1) +
        Math.sin(t * 2.27 + 1.3) * 0.5 +
        Math.cos(t * 1.73 + 0.7) * 0.25;
      const alpha = 0.18 + (n * 0.5 + 0.5) * 0.1;
      const jitter = (Math.sin(t * 0.6) + Math.sin(t * 0.13 + 2)) * 0.35;
      el.style.setProperty('--rimA', alpha.toFixed(3));
      el.style.setProperty('--rimJ', jitter.toFixed(3));
      rafFlicker = requestAnimationFrame(() => flicker(t0));
    };
    rafFlicker = requestAnimationFrame(() => flicker(performance.now()));

    const move = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const cx = ((e.clientX - r.left) / r.width) * 100;
      const cy = ((e.clientY - r.top) / r.height) * 100;
      el.style.setProperty('--cx', `${cx}%`);
      el.style.setProperty('--cy', `${cy}%`);
    };
    window.addEventListener('mousemove', move);

    const onClick = () => {
      let raf = 0;
      const start = performance.now();
      const dur = 900;
      const end = 140;
      const ease = (t: number) =>
        t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / dur);
        const r = ease(t) * end;
        el.style.setProperty('--r', `${r}vmin`);
        if (t < 1) {
          raf = requestAnimationFrame(tick);
        } else {
          onDone();
        }
      };
      raf = requestAnimationFrame(tick);
    };

    el.addEventListener('click', onClick, { once: true });
    el.addEventListener('keydown', onClick, { once: true });

    return () => {
      cancelAnimationFrame(rafFlicker);
      window.removeEventListener('mousemove', move);
      el.removeEventListener('click', onClick);
      el.removeEventListener('keydown', onClick);
    };
  }, [onDone]);

  const overlayStyle = {
    position: 'fixed' as const,
    inset: 0,
    zIndex: 100,
    display: 'grid',
    placeItems: 'center',
    fontFamily: 'system-ui, sans-serif',
    color: '#e0d0ff',
    cursor: 'pointer',
    userSelect: 'none' as const,
    letterSpacing: '0.04em',
    '--r': '0vmin',
    '--cx': '50%',
    '--cy': '50%',
    '--rimA': '0.22',
    '--rimJ': '0.0',
    background: `
      radial-gradient(circle at var(--cx) var(--cy),
        rgba(0,0,0,0) 0,
        rgba(0,0,0,0) calc(var(--r) - 2vmin),
        rgba(147,51,234,var(--rimA)) calc(var(--r) - 0.5vmin),
        rgba(236,72,153,var(--rimA)) calc(var(--r) + calc(var(--rimJ) * 1vmin)),
        rgba(59,130,246,calc(var(--rimA) * 0.8)) calc(var(--r) + 1vmin),
        rgba(0,0,0,0.98) calc(var(--r) + 2.5vmin)
      ),
      radial-gradient(circle at var(--cx) var(--cy),
        rgba(139,92,246,calc(var(--rimA) * 0.7)) calc(var(--r) - 1vmin),
        rgba(236,72,153,calc(var(--rimA) * 0.5)) calc(var(--r) + 0.5vmin),
        rgba(0,0,0,0) calc(var(--r) + 4vmin)
      ),
      radial-gradient(circle at var(--cx) var(--cy),
        rgba(6,182,212,calc(var(--rimA) * 0.3)) calc(var(--r) + 1vmin),
        rgba(0,0,0,0) calc(var(--r) + 5vmin)
      )
    `,
  } satisfies CSSProperties & Record<string, string | number>;

  return (
    <div ref={elRef} tabIndex={0} style={overlayStyle}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 14, opacity: 0.35, marginBottom: 10 }}>
          JOSHUA GUTIERREZ
        </div>
        <div style={{ fontSize: 32, marginBottom: 12, fontWeight: 300, opacity: 0.5 }}>
          <span style={{ opacity: 0.6 }}>—</span> Quantum Gallery{' '}
          <span style={{ opacity: 0.6 }}>—</span>
        </div>
        <div style={{ fontSize: 14, opacity: 0.3 }}>Click to enter</div>
      </div>
    </div>
  );
}

// === TOP NAVIGATION ===
function NavLink({ href, children, external, onClick }: { href: string; children: React.ReactNode; external?: boolean; onClick?: () => void }) {
  const [hovered, setHovered] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <a
      href={href}
      className="nav-link"
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      onClick={handleClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        color: hovered ? '#00f0ff' : 'rgba(255, 255, 255, 0.7)',
        textDecoration: 'none',
        fontSize: 12,
        fontWeight: 500,
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        padding: '8px 16px',
        position: 'relative',
        transition: 'all 0.3s ease',
        textShadow: hovered ? '0 0 20px rgba(0, 240, 255, 0.8)' : 'none',
      }}
    >
      {/* Corner accents */}
      <span style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: 6,
        height: 6,
        borderTop: `1px solid ${hovered ? '#00f0ff' : 'rgba(255,255,255,0.2)'}`,
        borderLeft: `1px solid ${hovered ? '#00f0ff' : 'rgba(255,255,255,0.2)'}`,
        transition: 'border-color 0.3s',
      }} />
      <span style={{
        position: 'absolute',
        top: 0,
        right: 0,
        width: 6,
        height: 6,
        borderTop: `1px solid ${hovered ? '#00f0ff' : 'rgba(255,255,255,0.2)'}`,
        borderRight: `1px solid ${hovered ? '#00f0ff' : 'rgba(255,255,255,0.2)'}`,
        transition: 'border-color 0.3s',
      }} />
      <span style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: 6,
        height: 6,
        borderBottom: `1px solid ${hovered ? '#00f0ff' : 'rgba(255,255,255,0.2)'}`,
        borderLeft: `1px solid ${hovered ? '#00f0ff' : 'rgba(255,255,255,0.2)'}`,
        transition: 'border-color 0.3s',
      }} />
      <span style={{
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 6,
        height: 6,
        borderBottom: `1px solid ${hovered ? '#00f0ff' : 'rgba(255,255,255,0.2)'}`,
        borderRight: `1px solid ${hovered ? '#00f0ff' : 'rgba(255,255,255,0.2)'}`,
        transition: 'border-color 0.3s',
      }} />
      {/* Glow background on hover */}
      {hovered && (
        <span style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at center, rgba(0,240,255,0.15) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
      )}
      {children}
    </a>
  );
}

// === CELESTIAL GRID - Quick Project Links (Draggable & Expandable) ===
interface CelestialGridProps {
  visible: boolean;
  onProjectClick: (projectId: string) => void;
}

const GRID_PROJECTS = [
  { id: 'axiondeep', icon: '◆', label: 'Axion Deep', color: '#00f0ff', glow: '#00f0ff', desc: 'AI-powered solutions' },
  { id: 'slms', icon: '▼', label: 'SLMS', color: '#10b981', glow: '#34d399', desc: 'Learning management' },
  { id: 'scivista', icon: '◈', label: 'SciVista', color: '#f59e0b', glow: '#fbbf24', desc: 'Scientific visualization' },
  { id: 'ai-ml', icon: '◎', label: 'AI/ML', color: '#8b5cf6', glow: '#a78bfa', desc: 'Machine learning projects' },
  { id: 'cloud', icon: '☁', label: 'Cloud', color: '#3b82f6', glow: '#60a5fa', desc: 'Cloud infrastructure' },
  { id: 'vr-ar', icon: '◐', label: 'VR/AR', color: '#ec4899', glow: '#f472b6', desc: 'Immersive experiences' },
];

function CelestialGrid({ visible, onProjectClick }: CelestialGridProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [pulsePhase, setPulsePhase] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [position, setPosition] = useState({ x: 16, y: window.innerHeight - 220 });
  const [isDragging, setIsDragging] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const dragOffset = useRef({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setPulsePhase(p => (p + 1) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // Keyboard navigation for accessibility
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    const gridCols = 3;
    const totalItems = GRID_PROJECTS.length;

    switch (e.key) {
      case 'ArrowRight':
        e.preventDefault();
        setFocusedIndex(prev => (prev + 1) % totalItems);
        break;
      case 'ArrowLeft':
        e.preventDefault();
        setFocusedIndex(prev => (prev - 1 + totalItems) % totalItems);
        break;
      case 'ArrowDown':
        e.preventDefault();
        setFocusedIndex(prev => Math.min(prev + gridCols, totalItems - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setFocusedIndex(prev => Math.max(prev - gridCols, 0));
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (focusedIndex >= 0 && focusedIndex < totalItems && GRID_PROJECTS[focusedIndex]) {
          onProjectClick(GRID_PROJECTS[focusedIndex].id);
        }
        break;
      case 'Escape':
        if (expanded) {
          e.preventDefault();
          setExpanded(false);
        }
        break;
    }
  }, [focusedIndex, expanded, onProjectClick]);

  // Drag handlers (mouse + touch)
  const handleDragStart = (clientX: number, clientY: number) => {
    setIsDragging(true);
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      dragOffset.current = { x: clientX - rect.left, y: clientY - rect.top };
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button')) return;
    handleDragStart(e.clientX, e.clientY);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if ((e.target as HTMLElement).closest('button')) return;
    const touch = e.touches[0];
    if (touch) handleDragStart(touch.clientX, touch.clientY);
  };

  useEffect(() => {
    const handleMove = (clientX: number, clientY: number) => {
      if (!isDragging || expanded) return;
      const newX = Math.max(0, Math.min(window.innerWidth - 200, clientX - dragOffset.current.x));
      const newY = Math.max(60, Math.min(window.innerHeight - 100, clientY - dragOffset.current.y));
      setPosition({ x: newX, y: newY });
    };

    const handleMouseMove = (e: MouseEvent) => handleMove(e.clientX, e.clientY);
    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const touch = e.touches[0];
      if (touch) handleMove(touch.clientX, touch.clientY);
    };

    const handleEnd = () => setIsDragging(false);

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleEnd);
      window.addEventListener('touchmove', handleTouchMove, { passive: false });
      window.addEventListener('touchend', handleEnd);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleEnd);
    };
  }, [isDragging, expanded]);

  if (!visible) return null;

  // Expanded sidebar mode (LEFT side to coexist with right-side modals)
  if (expanded) {
    return (
      <div
        className="celestial-expanded"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          bottom: 0,
          width: 280,
          zIndex: 90,
          background: 'linear-gradient(135deg, rgba(5, 5, 10, 0.98) 0%, rgba(15, 15, 25, 0.95) 100%)',
          backdropFilter: 'blur(20px)',
          borderRight: '1px solid rgba(255, 255, 255, 0.1)',
          fontFamily: 'system-ui, sans-serif',
          display: 'flex',
          flexDirection: 'column',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        {/* Header */}
        <div style={{
          padding: '20px 16px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{
              fontSize: 11,
              color: 'rgba(255,255,255,0.5)',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
            }}>
              Projects
            </span>
            <div style={{
              width: 6, height: 6, borderRadius: '50%',
              background: `conic-gradient(from ${pulsePhase}deg, #00f0ff, #8b5cf6, #ec4899, #f59e0b, #10b981, #3b82f6, #00f0ff)`,
            }} />
          </div>
          <button
            onClick={() => setExpanded(false)}
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 6,
              padding: '6px 10px',
              cursor: 'pointer',
              color: 'rgba(255,255,255,0.6)',
              fontSize: 10,
              display: 'flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            Collapse <span>◀</span>
          </button>
        </div>

        {/* Project list */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 12 }}>
          {GRID_PROJECTS.map((project, index) => {
            const isHovered = hoveredId === project.id;
            const individualPulse = Math.sin((pulsePhase + index * 60) * Math.PI / 180);

            return (
              <button
                key={project.id}
                onClick={() => onProjectClick(project.id)}
                onMouseEnter={() => setHoveredId(project.id)}
                onMouseLeave={() => setHoveredId(null)}
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  marginBottom: 8,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  background: isHovered
                    ? `linear-gradient(135deg, ${project.color}20 0%, transparent 100%)`
                    : 'rgba(255, 255, 255, 0.02)',
                  border: `1px solid ${isHovered ? project.color + '60' : 'rgba(255, 255, 255, 0.05)'}`,
                  borderRadius: 10,
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  transform: isHovered ? 'translateX(4px)' : 'translateX(0)',
                  boxShadow: isHovered
                    ? `0 0 20px ${project.glow}30, inset 0 0 20px ${project.glow}10`
                    : 'none',
                  textAlign: 'left',
                }}
              >
                {/* Icon */}
                <div style={{
                  width: 40,
                  height: 40,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: `${project.color}15`,
                  borderRadius: 8,
                  border: `1px solid ${project.color}30`,
                }}>
                  <span style={{
                    fontSize: 20,
                    color: project.color,
                    textShadow: `0 0 ${6 + individualPulse * 3}px ${project.glow}`,
                  }}>
                    {project.icon}
                  </span>
                </div>

                {/* Text */}
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: isHovered ? '#fff' : 'rgba(255,255,255,0.9)',
                    marginBottom: 2,
                  }}>
                    {project.label}
                  </div>
                  <div style={{
                    fontSize: 10,
                    color: 'rgba(255,255,255,0.4)',
                  }}>
                    {project.desc}
                  </div>
                </div>

                {/* Arrow */}
                <span style={{
                  color: isHovered ? project.color : 'rgba(255,255,255,0.2)',
                  transition: 'all 0.3s',
                  transform: isHovered ? 'translateX(2px)' : 'translateX(0)',
                }}>
                  →
                </span>
              </button>
            );
          })}
        </div>

        {/* Animated border on right edge */}
        <div style={{
          position: 'absolute',
          top: 0,
          right: -1,
          bottom: 0,
          width: 2,
          background: `linear-gradient(to bottom,
            transparent,
            rgba(0,240,255,0.5) 20%,
            rgba(139,92,246,0.5) 40%,
            rgba(236,72,153,0.5) 60%,
            rgba(245,158,11,0.5) 80%,
            transparent)`,
          opacity: 0.6,
        }} />
      </div>
    );
  }

  // Compact draggable grid mode
  return (
    <div
      ref={containerRef}
      className="celestial-grid"
      tabIndex={0}
      role="grid"
      aria-label="Project quick navigation"
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      onKeyDown={handleKeyDown}
      onFocus={() => focusedIndex === -1 && setFocusedIndex(0)}
      style={{
        position: 'fixed',
        left: position.x,
        top: position.y,
        zIndex: 55,
        background: 'rgba(0, 0, 0, 0.5)',
        borderRadius: 16,
        border: '1px solid rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(16px)',
        fontFamily: 'system-ui, sans-serif',
        cursor: isDragging ? 'grabbing' : 'grab',
        userSelect: 'none',
        transition: isDragging ? 'none' : 'box-shadow 0.3s',
        boxShadow: isDragging ? '0 10px 40px rgba(0,0,0,0.5)' : '0 4px 20px rgba(0,0,0,0.3)',
        outline: 'none',
      }}
    >
      {/* Drag handle / header */}
      <div style={{
        padding: '8px 12px',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 8,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{
            fontSize: 9,
            color: 'rgba(255,255,255,0.4)',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
          }}>
            Projects
          </span>
          <div style={{
            width: 5, height: 5, borderRadius: '50%',
            background: `conic-gradient(from ${pulsePhase}deg, #00f0ff, #8b5cf6, #ec4899, #00f0ff)`,
          }} />
        </div>
        <button
          onClick={() => setExpanded(true)}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'rgba(255,255,255,0.4)',
            fontSize: 12,
            padding: '2px 4px',
            display: 'flex',
            alignItems: 'center',
          }}
          title="Expand sidebar"
        >
          ▶
        </button>
      </div>

      {/* Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 10,
        padding: 12,
      }}>
        {/* Animated border glow */}
        <div
          style={{
            position: 'absolute',
            inset: -1,
            borderRadius: 16,
            background: `conic-gradient(from ${pulsePhase}deg,
              rgba(0,240,255,0.3),
              rgba(139,92,246,0.3),
              rgba(236,72,153,0.3),
              rgba(245,158,11,0.3),
              rgba(16,185,129,0.3),
              rgba(59,130,246,0.3),
              rgba(0,240,255,0.3))`,
            mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            maskComposite: 'xor',
            WebkitMaskComposite: 'xor',
            padding: 1,
            pointerEvents: 'none',
          }}
        />

        {GRID_PROJECTS.map((project, index) => {
          const isHovered = hoveredId === project.id;
          const isFocused = focusedIndex === index;
          const isActive = isHovered || isFocused;
          const individualPulse = Math.sin((pulsePhase + index * 60) * Math.PI / 180);

          return (
            <button
              key={project.id}
              role="gridcell"
              aria-label={`${project.label}: ${project.desc}`}
              tabIndex={-1}
              onClick={() => onProjectClick(project.id)}
              onMouseEnter={() => setHoveredId(project.id)}
              onMouseLeave={() => setHoveredId(null)}
              style={{
                width: 56,
                height: 56,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 4,
                background: isActive
                  ? `radial-gradient(circle, ${project.color}35 0%, transparent 70%)`
                  : 'rgba(255, 255, 255, 0.03)',
                border: `1px solid ${isActive ? project.color : 'rgba(255, 255, 255, 0.1)'}`,
                borderRadius: 10,
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                transform: isActive ? 'scale(1.12) translateY(-2px)' : 'scale(1)',
                boxShadow: isActive
                  ? `0 0 25px ${project.glow}50, 0 0 50px ${project.glow}25, inset 0 0 20px ${project.glow}15`
                  : `0 0 ${5 + individualPulse * 3}px ${project.color}25`,
                position: 'relative',
                overflow: 'hidden',
                outline: isFocused ? `2px solid ${project.color}` : 'none',
                outlineOffset: 2,
              }}
            >
              {/* Shimmer effect */}
              {isActive && (
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: `linear-gradient(135deg, transparent 30%, ${project.glow}40 50%, transparent 70%)`,
                    animation: 'shimmer 1.5s infinite',
                    pointerEvents: 'none',
                  }}
                />
              )}

              {/* Icon */}
              <span
                style={{
                  fontSize: 20,
                  color: isHovered ? project.glow : project.color,
                  textShadow: isHovered
                    ? `0 0 12px ${project.glow}, 0 0 24px ${project.glow}, 0 0 36px ${project.glow}`
                    : `0 0 ${4 + individualPulse * 2}px ${project.color}`,
                  transition: 'all 0.3s',
                  filter: isHovered ? 'brightness(1.3)' : 'brightness(1)',
                }}
              >
                {project.icon}
              </span>

              {/* Label */}
              <span
                style={{
                  fontSize: 8,
                  color: isHovered ? '#fff' : 'rgba(255, 255, 255, 0.5)',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  transition: 'color 0.3s',
                  textShadow: isHovered ? `0 0 8px ${project.glow}` : 'none',
                }}
              >
                {project.label.split(' ')[0]}
              </span>

              {/* Corner accents */}
              {isHovered && (
                <>
                  <span style={{
                    position: 'absolute', top: 3, left: 3,
                    width: 5, height: 5,
                    borderTop: `1px solid ${project.glow}`,
                    borderLeft: `1px solid ${project.glow}`,
                  }} />
                  <span style={{
                    position: 'absolute', top: 3, right: 3,
                    width: 5, height: 5,
                    borderTop: `1px solid ${project.glow}`,
                    borderRight: `1px solid ${project.glow}`,
                  }} />
                  <span style={{
                    position: 'absolute', bottom: 3, left: 3,
                    width: 5, height: 5,
                    borderBottom: `1px solid ${project.glow}`,
                    borderLeft: `1px solid ${project.glow}`,
                  }} />
                  <span style={{
                    position: 'absolute', bottom: 3, right: 3,
                    width: 5, height: 5,
                    borderBottom: `1px solid ${project.glow}`,
                    borderRight: `1px solid ${project.glow}`,
                  }} />
                </>
              )}
            </button>
          );
        })}
      </div>

      {/* Shimmer animation keyframes */}
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%) rotate(45deg); }
          100% { transform: translateX(200%) rotate(45deg); }
        }
      `}</style>
    </div>
  );
}

interface TopNavProps {
  visible: boolean;
  compact?: boolean;
  onHomeClick: () => void;
  onAboutClick: () => void;
  onHobbiesClick: () => void;
  onContactClick: () => void;
  onResumeClick: () => void;
}

function TopNav({ visible, compact, onHomeClick, onAboutClick, onHobbiesClick, onContactClick, onResumeClick }: TopNavProps) {
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setPulse(p => !p);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  if (!visible) return null;

  // Compact mode - just logo in top-left corner of modal
  if (compact) {
    return (
      <div
        onClick={onHomeClick}
        style={{
          position: 'fixed',
          top: 16,
          left: 16,
          zIndex: 1001,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          cursor: 'pointer',
          padding: '8px 12px',
          background: 'rgba(0,0,0,0.6)',
          borderRadius: 8,
          border: '1px solid rgba(0,240,255,0.2)',
          backdropFilter: 'blur(8px)',
          transition: 'all 0.2s',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(0,240,255,0.1)';
          e.currentTarget.style.borderColor = 'rgba(0,240,255,0.4)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(0,0,0,0.6)';
          e.currentTarget.style.borderColor = 'rgba(0,240,255,0.2)';
        }}
      >
        {/* Hexagon icon - smaller */}
        <div style={{
          width: 24,
          height: 24,
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <svg width="24" height="24" viewBox="0 0 32 32" style={{ position: 'absolute' }}>
            <polygon
              points="16,2 28,9 28,23 16,30 4,23 4,9"
              fill="none"
              stroke={pulse ? '#00f0ff' : 'rgba(0,240,255,0.5)'}
              strokeWidth="1.5"
            />
            <polygon
              points="16,6 24,11 24,21 16,26 8,21 8,11"
              fill="rgba(0,240,255,0.15)"
              stroke="rgba(0,240,255,0.3)"
              strokeWidth="0.5"
            />
          </svg>
          <span style={{
            fontSize: 8,
            fontWeight: 700,
            color: '#00f0ff',
            textShadow: '0 0 5px rgba(0,240,255,0.5)',
            zIndex: 1,
          }}>
            JRG
          </span>
        </div>
        <span style={{
          fontSize: 10,
          color: 'rgba(255,255,255,0.6)',
          letterSpacing: '0.05em',
        }}>
          Back
        </span>
      </div>
    );
  }

  return (
    <nav
      className="top-nav-container"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 60,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '12px 24px',
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      {/* Scan line effect */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '100%',
        background: 'linear-gradient(to bottom, rgba(0,240,255,0.03) 0%, transparent 50%, rgba(0,0,0,0.4) 100%)',
        pointerEvents: 'none',
      }} />

      {/* Bottom border with glow */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 24,
        right: 24,
        height: 1,
        background: 'linear-gradient(90deg, transparent 0%, rgba(0,240,255,0.3) 20%, rgba(0,240,255,0.3) 80%, transparent 100%)',
      }} />

      {/* Centered nav container */}
      <div
        className="top-nav-pill"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 24,
          position: 'relative',
          zIndex: 1,
          background: 'rgba(0,0,0,0.3)',
          backdropFilter: 'blur(8px)',
          padding: '8px 20px',
          borderRadius: 24,
          border: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        {/* Logo - clickable to return home */}
        <div
          onClick={onHomeClick}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            cursor: 'pointer',
            paddingRight: 16,
            borderRight: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          {/* Hexagon icon */}
          <div style={{
            width: 28,
            height: 28,
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <svg width="28" height="28" viewBox="0 0 32 32" style={{ position: 'absolute' }}>
              <polygon
                points="16,2 28,9 28,23 16,30 4,23 4,9"
                fill="none"
                stroke={pulse ? '#00f0ff' : 'rgba(0,240,255,0.5)'}
                strokeWidth="1"
                style={{ transition: 'stroke 0.5s' }}
              />
              <polygon
                points="16,6 24,11 24,21 16,26 8,21 8,11"
                fill="rgba(0,240,255,0.1)"
                stroke="rgba(0,240,255,0.3)"
                strokeWidth="0.5"
              />
            </svg>
            <span style={{
              fontSize: 9,
              fontWeight: 700,
              color: '#00f0ff',
              textShadow: pulse ? '0 0 10px rgba(0,240,255,0.8)' : '0 0 5px rgba(0,240,255,0.4)',
              transition: 'text-shadow 0.5s',
              zIndex: 1,
            }}>
              JRG
            </span>
          </div>

          {/* Status indicator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <div style={{
              width: 5,
              height: 5,
              borderRadius: '50%',
              background: '#00ff88',
              boxShadow: pulse ? '0 0 8px #00ff88' : '0 0 4px #00ff88',
              transition: 'box-shadow 0.5s',
            }} />
            <span style={{
              fontSize: 8,
              color: 'rgba(255,255,255,0.4)',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}>
              Online
            </span>
          </div>
        </div>

        {/* Nav links */}
        <div style={{ display: 'flex', gap: 6 }}>
          <NavLink href="#" onClick={onAboutClick}>About</NavLink>
          <NavLink href="#" onClick={onHobbiesClick}>Hobbies</NavLink>
          <NavLink href="#" onClick={onResumeClick}>Resume</NavLink>
          <NavLink href="#" onClick={onContactClick}>Contact</NavLink>
        </div>
      </div>
    </nav>
  );
}

// === NAVIGATION HINT ===
function NavigationHint({ visible }: { visible: boolean }) {
  if (!visible) return null;

  return (
    <div
      className="nav-hint"
      style={{
        position: 'fixed',
        bottom: 32,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 50,
        textAlign: 'center',
        fontFamily: 'system-ui, sans-serif',
        color: 'rgba(255, 255, 255, 0.5)',
        fontSize: 13,
        pointerEvents: 'none',
      }}
    >
      <div>Click a node to explore</div>
      <div style={{ marginTop: 4, opacity: 0.6, fontSize: 11 }}>
        Drag to spin • Scroll to zoom
      </div>
    </div>
  );
}

// === MAIN APP ===
function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeProject, setActiveProject] = useState<ProjectNode | null>(null);
  const [showHint, setShowHint] = useState(true);
  const [contactOpen, setContactOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [hobbiesOpen, setHobbiesOpen] = useState(false);
  const [resumeOpen, setResumeOpen] = useState(false);
  const [resetZoomCounter, setResetZoomCounter] = useState(0);
  const [canvasLoading, setCanvasLoading] = useState(true);
  const nodeClickedRef = useRef(false);

  // Focus management refs
  const lastFocusedElement = useRef<HTMLElement | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Accessibility hooks
  const isMobile = useIsMobile();
  const prefersReducedMotion = usePrefersReducedMotion();

  // Check if any panel is open
  const anyPanelOpen = !!(activeProject || contactOpen || aboutOpen || hobbiesOpen);

  // Lock body scroll on mobile when panels are open
  useBodyScrollLock(isMobile && anyPanelOpen);

  // Canvas loading - hide after a short delay to ensure 3D is ready
  useEffect(() => {
    const timer = setTimeout(() => setCanvasLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  // Routing - check URL on mount
  useEffect(() => {
    const route = getCurrentRoute();

    if (route === 'resume') {
      setResumeOpen(true);
      setIsOpen(true);
      trackEvent({ type: 'panel_open', panel: 'resume' });
    } else if (typeof route === 'object' && 'project' in route) {
      const project = getProjectById(route.project);
      if (project) {
        setActiveProject(project);
        setIsOpen(true);
        setShowHint(false);
        trackEvent({ type: 'project_view', projectId: route.project });
      }
    }

    // Listen for popstate (back/forward navigation)
    const handlePopState = () => {
      const newRoute = getCurrentRoute();

      if (newRoute === 'resume') {
        setResumeOpen(true);
        setActiveProject(null);
        setContactOpen(false);
        setAboutOpen(false);
        setHobbiesOpen(false);
      } else if (newRoute === 'home') {
        setResumeOpen(false);
        setActiveProject(null);
      } else if (typeof newRoute === 'object' && 'project' in newRoute) {
        const project = getProjectById(newRoute.project);
        if (project) {
          setActiveProject(project);
          setResumeOpen(false);
          trackEvent({ type: 'project_view', projectId: newRoute.project });
        }
      }
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
  }, []);

  // Update URL when project changes
  useEffect(() => {
    setProjectHash(activeProject?.id ?? null);
  }, [activeProject]);

  // Focus management - move focus to panel when opened
  useEffect(() => {
    if (anyPanelOpen) {
      // Save current focus
      lastFocusedElement.current = document.activeElement as HTMLElement;
      // Focus the panel (will be caught by the panel's close button)
      setTimeout(() => {
        const closeButton = document.querySelector('.panel-overlay button') as HTMLElement;
        closeButton?.focus();
      }, 100);
    } else if (lastFocusedElement.current) {
      // Restore focus when panel closes
      lastFocusedElement.current.focus();
      lastFocusedElement.current = null;
    }
  }, [anyPanelOpen]);

  // Close all panels helper and reset zoom
  const closeAllPanels = useCallback(() => {
    const hadPanel = activeProject || contactOpen || aboutOpen || hobbiesOpen || resumeOpen;
    setActiveProject(null);
    setContactOpen(false);
    setAboutOpen(false);
    setHobbiesOpen(false);
    setResumeOpen(false);
    // Reset zoom when closing panels
    if (hadPanel) {
      setResetZoomCounter(c => c + 1);
    }
    // Navigate back to home if on resume page
    if (resumeOpen) {
      navigateToHome();
    }
  }, [activeProject, contactOpen, aboutOpen, hobbiesOpen, resumeOpen]);

  // Handle node selection
  const handleNodeSelect = useCallback((project: ProjectNode | null) => {
    if (project) {
      // Mark that a node was clicked (to prevent canvas click from closing panels)
      nodeClickedRef.current = true;
      setTimeout(() => { nodeClickedRef.current = false; }, 50);
      // Track analytics
      trackEvent({ type: 'project_view', projectId: project.id });
    }
    setActiveProject(project);
    if (project) {
      setShowHint(false);
      setContactOpen(false);
      setAboutOpen(false);
      setHobbiesOpen(false);
    }
  }, []);

  // Handle panel close
  const handleClosePanel = useCallback(() => {
    setActiveProject(null);
    setResetZoomCounter(c => c + 1);
  }, []);

  // Handle celestial grid project click
  const handleCelestialClick = useCallback((projectId: string) => {
    const project = getProjectById(projectId);
    if (project) {
      nodeClickedRef.current = true;
      setTimeout(() => { nodeClickedRef.current = false; }, 50);
      setActiveProject(project);
      setShowHint(false);
      setContactOpen(false);
      setAboutOpen(false);
      setHobbiesOpen(false);
      // Track analytics
      trackEvent({ type: 'project_view', projectId });
    }
  }, []);

  // Handle contact panel
  const handleOpenContact = useCallback(() => {
    closeAllPanels();
    setContactOpen(true);
    trackEvent({ type: 'panel_open', panel: 'contact' });
  }, [closeAllPanels]);

  const handleCloseContact = useCallback(() => {
    setContactOpen(false);
    setResetZoomCounter(c => c + 1);
  }, []);

  // Handle about panel
  const handleOpenAbout = useCallback(() => {
    closeAllPanels();
    setAboutOpen(true);
    trackEvent({ type: 'panel_open', panel: 'about' });
  }, [closeAllPanels]);

  const handleCloseAbout = useCallback(() => {
    setAboutOpen(false);
    setResetZoomCounter(c => c + 1);
  }, []);

  // Handle hobbies panel
  const handleOpenHobbies = useCallback(() => {
    closeAllPanels();
    setHobbiesOpen(true);
    trackEvent({ type: 'panel_open', panel: 'hobbies' });
  }, [closeAllPanels]);

  const handleCloseHobbies = useCallback(() => {
    setHobbiesOpen(false);
    setResetZoomCounter(c => c + 1);
  }, []);

  // Handle resume page
  const handleOpenResume = useCallback(() => {
    closeAllPanels();
    setResumeOpen(true);
    navigateToResume();
    trackEvent({ type: 'panel_open', panel: 'resume' });
  }, [closeAllPanels]);

  const handleCloseResume = useCallback(() => {
    setResumeOpen(false);
    navigateToHome();
    setResetZoomCounter(c => c + 1);
  }, []);

  // Handle home (return to intro)
  const handleGoHome = useCallback(() => {
    closeAllPanels();
    setIsOpen(false);
    setShowHint(true);
    trackEvent({ type: 'navigation', panel: 'home' });
  }, [closeAllPanels]);

  // Handle canvas click - close panels when clicking outside (but not on nodes)
  const handleCanvasClick = useCallback(() => {
    // Don't close if a node was just clicked
    if (nodeClickedRef.current) return;
    if (anyPanelOpen) {
      closeAllPanels();
    }
  }, [anyPanelOpen, closeAllPanels]);

  // ESC key to close panels
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeAllPanels();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [closeAllPanels]);

  // Hide hint after a few seconds
  useEffect(() => {
    if (isOpen && showHint) {
      const timer = setTimeout(() => setShowHint(false), 8000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, showHint]);

  return (
    <main
      style={{
        height: '100vh',
        width: '100vw',
        background: '#000',
        margin: 0,
        overflow: 'hidden',
      }}
    >
      {/* Global responsive styles */}
      <GlobalStyles />

      {/* Canvas loading overlay */}
      <CanvasLoader visible={canvasLoading && !isOpen} />

      {/* Nebula particle background - reduced on prefersReducedMotion */}
      {!prefersReducedMotion && <NebulaParticles />}

      {/* Black hole (opposite spin nebula) - reduced on prefersReducedMotion */}
      {!prefersReducedMotion && <BlackHoleParticles />}

      {/* Custom cursor - always rendered on desktop, hidden on mobile */}
      {!isMobile && <HelixCursor />}

      {/* Intro overlay */}
      {!isOpen && <RiftOverlay onDone={() => setIsOpen(true)} />}

      {/* 3D Canvas - click to close panels */}
      <div
        onClick={handleCanvasClick}
        style={{ position: 'absolute', inset: 0 }}
      >
        <ErrorBoundary>
          <Canvas
            camera={{ position: [0, 2, 8], fov: 60 }}
            style={{ background: '#000' }}
            gl={{ antialias: true, alpha: false }}
          >
            <BackgroundEffects />
            <GalaxyScene
              onNodeSelect={handleNodeSelect}
              activeProjectId={activeProject?.id ?? null}
            />
            <CameraController
              activeProject={activeProject}
              orbitEnabled={!activeProject}
              controlsEnabled={!anyPanelOpen}
              resetZoomKey={resetZoomCounter}
            />
          </Canvas>
        </ErrorBoundary>
      </div>

      {/* UI Overlays */}
      <TopNav
        visible={isOpen && !resumeOpen}
        compact={false}
        onHomeClick={handleGoHome}
        onAboutClick={handleOpenAbout}
        onHobbiesClick={handleOpenHobbies}
        onContactClick={handleOpenContact}
        onResumeClick={handleOpenResume}
      />
      <NavigationHint visible={isOpen && showHint && !anyPanelOpen} />

      {/* Celestial Grid - Quick Project Links (persists when modals open) */}
      <CelestialGrid
        visible={isOpen}
        onProjectClick={handleCelestialClick}
      />

      {/* Panels - Lazy loaded with Suspense */}
      <Suspense fallback={activeProject ? <PanelFallback /> : null}>
        {activeProject && <ProjectPanel project={activeProject} onClose={handleClosePanel} />}
      </Suspense>
      <Suspense fallback={contactOpen ? <PanelFallback /> : null}>
        {contactOpen && <ContactPanel isOpen={contactOpen} onClose={handleCloseContact} />}
      </Suspense>
      <Suspense fallback={aboutOpen ? <PanelFallback /> : null}>
        {aboutOpen && <AboutPanel isOpen={aboutOpen} onClose={handleCloseAbout} />}
      </Suspense>
      <Suspense fallback={hobbiesOpen ? <PanelFallback /> : null}>
        {hobbiesOpen && <HobbiesPanel isOpen={hobbiesOpen} onClose={handleCloseHobbies} />}
      </Suspense>

      {/* Resume Page - Full screen standalone */}
      <Suspense fallback={null}>
        {resumeOpen && <ResumePage onExit={handleCloseResume} />}
      </Suspense>

      {/* Brand watermark */}
      <div
        className="brand-watermark"
        style={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          zIndex: 40,
          fontFamily: 'system-ui, sans-serif',
          fontSize: 11,
          color: 'rgba(255, 255, 255, 0.3)',
          letterSpacing: '0.05em',
        }}
      >
        AXION DEEP LABS
      </div>
    </main>
  );
}

// === MOUNT ===
const container = document.getElementById('root');
if (container) {
  createRoot(container).render(
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  );
}
