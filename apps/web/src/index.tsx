// @ts-nocheck

import React from "react";
import { createRoot } from "react-dom/client";
import { Canvas, useFrame } from "@react-three/fiber";

function SpinningTorus() {
  const ref = React.useRef<any>(null);
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (ref.current) {
      ref.current.rotation.x = t * 0.3;
      ref.current.rotation.y = t * 0.5;
      ref.current.position.z = -1 + Math.sin(t * 0.6) * 0.15; // subtle breathing
    }
  });
  return (
    <mesh ref={ref}>
      <torusKnotGeometry args={[1, 0.3, 128, 32]} />
      <meshStandardMaterial metalness={0.85} roughness={0.2} color={"#9ae8ff"} />
    </mesh>
  );
}

/** CSS Rift Overlay (no WebGL) */
function RiftOverlay({ onDone }: { onDone: () => void }) {
  const elRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const el = elRef.current;
    if (!el) return;

    // Rim flicker: animate CSS variables for opacity and slight radius jitter
    let rafFlicker = 0;
    const flicker = (t0: number) => {
      const now = performance.now();
      const t = (now - t0) / 1000;
      // lightweight pseudo-noise via incommensurate sin/cos waves
      const n =
        Math.sin(t * 3.1) +
        Math.sin(t * 2.27 + 1.3) * 0.5 +
        Math.cos(t * 1.73 + 0.7) * 0.25;
      // opacity range ~0.18–0.28
      const alpha = 0.18 + (n * 0.5 + 0.5) * 0.1;
      // radius jitter in vmin scale, small and smooth
      const jitter = (Math.sin(t * 0.6) + Math.sin(t * 0.13 + 2)) * 0.35;
      el.style.setProperty("--rimA", alpha.toFixed(3));
      el.style.setProperty("--rimJ", jitter.toFixed(3));
      rafFlicker = requestAnimationFrame(() => flicker(t0));
    };
    rafFlicker = requestAnimationFrame(() => flicker(performance.now()));

    // Track cursor so the hole opens where the user clicks
    const move = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const cx = ((e.clientX - r.left) / r.width) * 100;
      const cy = ((e.clientY - r.top) / r.height) * 100;
      el.style.setProperty("--cx", `${cx}%`);
      el.style.setProperty("--cy", `${cy}%`);
    };
    window.addEventListener("mousemove", move);

    // Click → animate radius via RAF, then remove
    const onClick = () => {
      let raf = 0;
      const start = performance.now();
      const dur = 900;
      const end = 140; // how wide the hole gets
      const ease = (t: number) =>
        t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / dur);
        const r = ease(t) * end;
        el.style.setProperty("--r", `${r}vmin`);
        if (t < 1) {
          raf = requestAnimationFrame(tick);
        } else {
          onDone();
        }
      };
      raf = requestAnimationFrame(tick);
      const cleanup = () => cancelAnimationFrame(raf);
      window.addEventListener("beforeunload", cleanup, { once: true });
    };

    el.addEventListener("click", onClick, { once: true });
    el.addEventListener("keydown", onClick, { once: true });

    return () => {
      cancelAnimationFrame(rafFlicker);
      window.removeEventListener("mousemove", move);
      el.removeEventListener("click", onClick);
      el.removeEventListener("keydown", onClick);
    };
  }, [onDone]);

  return (
    <div
      ref={elRef}
      tabIndex={0}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 10,
        display: "grid",
        placeItems: "center",
        fontFamily: "system-ui, sans-serif",
        color: "#d9fbff",
        cursor: "pointer",
        userSelect: "none",
        letterSpacing: "0.04em",
        ["--r" as any]: "0vmin",
        ["--cx" as any]: "50%",
        ["--cy" as any]: "50%",
        ["--rimA" as any]: 0.22, // rim base alpha
        ["--rimJ" as any]: 0.0, // rim radius jitter (vmin multiplier)
        // Two-layer radial: primary mask ring + faint halo with animated alpha/jitter
        background: `
          radial-gradient(circle at var(--cx) var(--cy),
            rgba(0,0,0,0) 0,
            rgba(0,0,0,0) calc(var(--r) - 1.5vmin),
            rgba(46,255,255,var(--rimA)) calc(var(--r) + calc(var(--rimJ) * 1vmin)),
            rgba(0,0,0,0.98) calc(var(--r) + 2vmin)
          ),
          radial-gradient(circle at var(--cx) var(--cy),
            rgba(46,255,255, calc(var(--rimA) * 0.6)) calc(var(--r) - 0.5vmin),
            rgba(0,0,0,0) calc(var(--r) + 3.5vmin)
          )
        `,
      }}
    >
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 14, opacity: 0.7, marginBottom: 10 }}>
          JOSHUA GUTIERREZ
        </div>
        <div style={{ fontSize: 28, marginBottom: 12 }}>
          <span style={{ opacity: 0.75 }}>—</span> Quantum Gallery{" "}
          <span style={{ opacity: 0.75 }}>—</span>
        </div>
        <div style={{ fontSize: 14, opacity: 0.7 }}>Click to breach</div>
      </div>
    </div>
  );
}

function App() {
  const [open, setOpen] = React.useState(false);

  return (
    <main style={{ height: "100vh", background: "#000", margin: 0 }}>
      {!open && <RiftOverlay onDone={() => setOpen(true)} />}
      <Canvas camera={{ position: [0, 0, 3.2], fov: 55 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[3, 3, 3]} intensity={1.2} />
        <SpinningTorus />
      </Canvas>
    </main>
  );
}

const container = document.getElementById("root");
if (container) createRoot(container).render(<App />);
