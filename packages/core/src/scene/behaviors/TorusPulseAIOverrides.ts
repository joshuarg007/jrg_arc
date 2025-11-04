import type { Behavior } from "../BehaviorSystem";
import type { SceneManager } from "../SceneManager";
import { aiState } from "../AIState";

/**
 * Behavior: applies AI-provided overrides to TorusPulse.
 * Reads keys:
 *   - 'torusPulse.amplitude': number
 *   - 'torusPulse.speed': number
 */
export function createTorusPulseAIOverrides(): Behavior {
  return {
    id: "bhv_torusPulseAIOverrides",
    enabled: true,
    tick: (_dt: number, _t: number, mgr: SceneManager) => {
      const amp = aiState.get<number>("torusPulse.amplitude");
      const spd = aiState.get<number>("torusPulse.speed");

      if (amp === undefined && spd === undefined) return;

      const anyMgr: any = mgr as any;
      const entities: any[] = anyMgr?.entities ?? anyMgr?.getEntities?.() ?? [];

      for (const e of entities) {
        const typeName = (e?.constructor && e.constructor.name) || "";
        if (typeName !== "TorusPulse") continue;

        // Apply amplitude if present
        if (typeof amp === "number") {
          if (typeof (e as any).amplitude === "number") {
            (e as any).amplitude = amp;
          } else if (typeof (e as any).setParam === "function") {
            try { (e as any).setParam("amplitude", amp); } catch { /* noop */ }
          }
        }

        // Apply speed if present
        if (typeof spd === "number") {
          if (typeof (e as any).speed === "number") {
            (e as any).speed = spd;
          } else if (typeof (e as any).setParam === "function") {
            try { (e as any).setParam("speed", spd); } catch { /* noop */ }
          }
        }
      }
    }
  };
}
