// apps/web/src/hooks/useSceneManager.ts
import { useRef, useEffect } from "react";
// Direct relative path to the current file location on disk
import SceneManager, { SceneState } from "@core/scene/SceneManager"

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
    let raf = 0;
    const loop = (time: number) => {
      const last = lastRef.current;
      const dt = (time - last) / 1000;
      frameRef.current++;
      lastRef.current = time;
      managerRef.current?.step({
        time: time / 1000,
        dt,
        frame: frameRef.current
      } as SceneState);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  return managerRef.current!;
}

export default useSceneManager;
