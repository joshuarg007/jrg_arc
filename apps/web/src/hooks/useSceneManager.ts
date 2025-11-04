import { createTorusPulseAIOverrides } from "@core/scene/behaviors/TorusPulseAIOverrides";
// apps/web/src/hooks/useSceneManager.ts
import { useRef, useEffect } from "react";
import SceneManager, { SceneState } from "@core/scene/SceneManager";
import { behaviorSystem } from "@core/scene/BehaviorSystem";
import { behaviorRegistry } from "@core/scene/BehaviorRegistry";
import { createTorusPulseOscillator } from "@core/scene/behaviors/TorusPulseOscillator";

/**
 * React hook: provides a persistent SceneManager instance and
 * automatically steps it each frame using requestAnimationFrame.
 */
export function useSceneManager() {
  const managerRef = useRef<SceneManager | null>(null);
  const lastRef = useRef(performance.now());
  const frameRef = useRef(0);

  if (!managerRef.current) {
    managerRef.current = new SceneManager();
  }

  useEffect(() => {
    // Register the TorusPulse oscillator behavior
    behaviorRegistry.registerFactory("torusPulse/osc", createTorusPulseOscillator);
    behaviorRegistry.registerFactory("torusPulse/ai", createTorusPulseAIOverrides);
    const unsubscribe = behaviorRegistry.activate("torusPulse/osc", { amplitude: 0.6, speed: 1.0 });
    const unsubscribeAI = behaviorRegistry.activate("torusPulse/ai");

    let raf = 0;
    const loop = (time: number) => {
      const last = lastRef.current;
      const dt = (time - last) / 1000;
      frameRef.current++;
      lastRef.current = time;

      const mgr = managerRef.current!;
      mgr?.step({
        time: time / 1000,
        dt,
        frame: frameRef.current,
      } as SceneState);

      // Tick all registered behaviors once per frame
      behaviorSystem.update(dt, mgr);

      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    // Cleanup: cancel RAF + unregister behavior
    return () => {
      cancelAnimationFrame(raf);
      unsubscribe();
      if (typeof unsubscribeAI === "function") unsubscribeAI();
    };
  }, []);

  return managerRef.current!;
}

export default useSceneManager;


