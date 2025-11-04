import type { SceneManager } from './SceneManager';

export type BehaviorFn = (dt: number, time: number, mgr: SceneManager) => void;

export interface Behavior {
  id?: string;
  enabled?: boolean;
  tick: BehaviorFn;
}

export class BehaviorSystem {
  private behaviors: Map<string, Behavior> = new Map<string, Behavior>();
  private startedAt: number = (typeof performance !== 'undefined' ? performance.now() : Date.now());
  private _time = 0;

  get time(): number {
    return this._time;
  }

  /**
   * Registers a behavior and returns an unsubscribe function.
   * If no id is provided, a unique one will be generated.
   */
  register(behavior: Behavior): () => void {
    const genId: () => string = () => {
      const base =
        (typeof crypto !== 'undefined' && 'randomUUID' in crypto)
          ? (crypto as any).randomUUID()
          : Math.random().toString(36).slice(2);
      return `bhv_${base}`;
    };

    const id: string = behavior.id ?? genId(); // <-- ensure genId() is CALLED

    this.behaviors.set(id, { enabled: true, ...behavior, id });

    const unsubscribe: () => void = () => {
      this.behaviors.delete(id);
    };
    return unsubscribe;
  }

  /**
   * One-frame advance. Safe to call from a RAF/useFrame site.
   */
  update(dt: number, mgr: SceneManager): void {
    const now: number = (typeof performance !== 'undefined' ? performance.now() : Date.now());
    this._time = (now - this.startedAt) / 1000;
    for (const b of this.behaviors.values()) {
      if (b.enabled !== false) b.tick(dt, this._time, mgr);
    }
  }

  enable(id: string): void {
    const b = this.behaviors.get(id);
    if (b) b.enabled = true;
  }

  disable(id: string): void {
    const b = this.behaviors.get(id);
    if (b) b.enabled = false;
  }

  clear(): void {
    this.behaviors.clear();
  }
}

export const behaviorSystem: BehaviorSystem = new BehaviorSystem();
