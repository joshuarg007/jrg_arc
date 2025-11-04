// packages/core/src/entities/TorusPulse.ts
import BaseEntity from "../scene/BaseEntity";
import type { SceneContext } from "../scene/SceneManager";

/**
 * TorusPulse publishes rotation and breathing offsets each frame into the SceneManager store.
 * Web layer can read: 'torus.rotX', 'torus.rotY', 'torus.breathZ'.
 */
export class TorusPulse extends BaseEntity {
  private lastLog = 0;

  constructor(id = "torus-pulse") {
    super(id);
  }

  override tick(ctx: SceneContext): void {
    const t = ctx.state.time;
    const rotX = t * 0.3;
    const rotY = t * 0.5;
    const breathZ = -1 + Math.sin(t * 0.6) * 0.15;

    ctx.set("torus.rotX", rotX);
    ctx.set("torus.rotY", rotY);
    ctx.set("torus.breathZ", breathZ);

    // Throttled smoke log (~1/s) to confirm runtime flow
    if (t - this.lastLog >= 1) {
      // eslint-disable-next-line no-console
      console.log(
        "[TorusPulse]",
        "rotX", rotX.toFixed(2),
        "rotY", rotY.toFixed(2),
        "z", breathZ.toFixed(2)
      );
      this.lastLog = t;
    }
  }
}

export default TorusPulse;
