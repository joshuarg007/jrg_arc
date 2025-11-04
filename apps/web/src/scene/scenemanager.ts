// packages/core/src/scene/SceneManager.ts
// Minimal, dependency-free scene manager for R3F/Three integration without importing three types.

export interface SceneState {
    time: number;        // elapsed time (s)
    dt: number;          // delta time (s)
    frame: number;       // frame counter
    viewport?: { width: number; height: number };
    // Extend as needed (camera, controls, etc.)
  }
  
  export interface SceneContext {
    scene?: unknown;     // external scene graph (e.g., THREE.Scene) when provided
    state: SceneState;
    get<T = unknown>(key: string): T | undefined;
    set<T = unknown>(key: string, value: T): void;
  }
  
  export interface SceneEntity {
    id: string;
    init?(ctx: SceneContext): void;
    tick?(ctx: SceneContext): void;
    dispose?(ctx: SceneContext): void;
  }
  
  type EntityMap = Map<string, SceneEntity>;
  
  export class SceneManager {
    private readonly entities: EntityMap = new Map();
    private readonly store = new Map<string, unknown>();
    private readonly sceneRef?: unknown;
  
    constructor(opts?: { scene?: unknown }) {
      this.sceneRef = opts?.scene;
    }
  
    /** Register an entity (id must be unique). Runs `init` once if provided. */
    add(entity: SceneEntity): void {
      if (this.entities.has(entity.id)) return;
      this.entities.set(entity.id, entity);
      entity.init?.(this.ctx({ time: 0, dt: 0, frame: 0 }));
    }
  
    /** Remove an entity by id and call `dispose` if present. */
    remove(id: string): void {
      const e = this.entities.get(id);
      if (!e) return;
      e.dispose?.(this.ctx({ time: 0, dt: 0, frame: 0 }));
      this.entities.delete(id);
    }
  
    /** Advance one frame; call `tick` for all entities. */
    step(state: SceneState): void {
      const ctx = this.ctx(state);
      // Snapshot iteration to tolerate add/remove during tick.
      for (const e of Array.from(this.entities.values())) {
        e.tick?.(ctx);
      }
    }
  
    /** Clear all entities and dispose them. */
    clear(): void {
      for (const e of this.entities.values()) {
        e.dispose?.(this.ctx({ time: 0, dt: 0, frame: 0 }));
      }
      this.entities.clear();
      this.store.clear();
    }
  
    /** Simple shared store helpers */
    get<T = unknown>(key: string): T | undefined {
      return this.store.get(key) as T | undefined;
    }
    set<T = unknown>(key: string, value: T): void {
      this.store.set(key, value);
    }
  
    private ctx(state: SceneState): SceneContext {
      return {
        scene: this.sceneRef,
        state,
        get: <T = unknown>(k: string) => this.get<T>(k),
        set: <T = unknown>(k: string, v: T) => this.set<T>(k, v)
      };
    }
  }
  
  export default SceneManager;
  