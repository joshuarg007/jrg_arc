import type { Behavior } from "../BehaviorSystem";
import type { SceneManager } from "../SceneManager";

/**
 * Factory: creates a behavior that oscillates TorusPulse visuals.
 * Usage (in app runtime):
 *   const unsub = behaviorSystem.register(createTorusPulseOscillator({ amplitude: 0.6, speed: 1.0 }));
 */
export function createTorusPulseOscillator(opts?: {
  amplitude?: number;   // max delta applied (0..1 typical)
  speed?: number;       // oscillation speed multiplier
  prop?: string;        // which numeric property to drive (default 'amplitude')
}): Behavior {
  const amplitude: number = opts?.amplitude ?? 0.4;
  const speed: number = opts?.speed ?? 1.2;
  const prop: string = opts?.prop ?? "amplitude";

  return {
    id: "bhv_torusPulseOsc",
    enabled: true,
    tick: (_dt: number, t: number, mgr: SceneManager) => {
      const phase = t * speed;
      const value = (Math.sin(phase) * 0.5 + 0.5) * amplitude;

      const anyMgr: any = mgr as any;
      const entities: any[] = anyMgr?.entities ?? anyMgr?.getEntities?.() ?? [];

      for (const e of entities) {
        const typeName = (e?.constructor && e.constructor.name) || "";
        if (typeName !== "TorusPulse") continue;

        // 1) Direct numeric property (preferred)
        if (typeof (e as any)[prop] === "number") {
          (e as any)[prop] = value;
          continue;
        }

        // 2) Param setter if available
        if (typeof (e as any).setParam === "function") {
          try { (e as any).setParam(prop, value); } catch { /* noop */ }
          continue;
        }

        // 3) Fallback: scale the object if present
        const obj = (e as any).object3D ?? (e as any).mesh ?? null;
        if (obj && obj.scale && typeof obj.scale.setScalar === "function") {
          // Keep it subtle: 1.0 ± amplitude
          const s = 1.0 + value * 0.25;
          try { obj.scale.setScalar(s); } catch { /* noop */ }
        }
      }
    }
  };
}
