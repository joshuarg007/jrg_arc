// packages/core/src/scene/behaviors/BaseBehavior.ts
import type { Behavior, BehaviorFn } from '../BehaviorSystem';
import type { SceneManager, SceneEntity } from '../SceneManager';

/**
 * Configuration options for behaviors
 */
export interface BehaviorOptions {
  /** Unique identifier for this behavior instance */
  id?: string;
  /** Whether the behavior starts enabled */
  enabled?: boolean;
}

/**
 * Interface for entities that can receive parameter updates
 */
export interface ParameterizedEntity extends SceneEntity {
  setParam?(name: string, value: unknown): void;
  getParam?<T = unknown>(name: string): T | undefined;
}

/**
 * Base class for behaviors that provides common functionality
 * and type-safe entity access patterns.
 */
export abstract class BaseBehavior implements Behavior {
  readonly id: string;
  enabled: boolean;

  constructor(options?: BehaviorOptions) {
    this.id = options?.id ?? this.generateId();
    this.enabled = options?.enabled ?? true;
  }

  private generateId(): string {
    const base =
      typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? crypto.randomUUID()
        : Math.random().toString(36).slice(2);
    return `bhv_${base}`;
  }

  /**
   * Abstract tick method to be implemented by subclasses
   */
  abstract onTick(dt: number, time: number, manager: SceneManager): void;

  /**
   * The tick function called by the BehaviorSystem
   */
  tick: BehaviorFn = (dt, time, manager) => {
    if (this.enabled) {
      this.onTick(dt, time, manager);
    }
  };

  /**
   * Helper to iterate over entities of a specific type
   */
  protected forEachEntity<T extends SceneEntity>(
    manager: SceneManager,
    typeName: string,
    callback: (entity: T) => void
  ): void {
    // Access entities through a type-safe pattern
    const anyMgr = manager as unknown as { entities?: Map<string, SceneEntity> };
    const entities = anyMgr.entities;

    if (!entities) return;

    for (const entity of entities.values()) {
      const entityTypeName = entity.constructor?.name ?? '';
      if (entityTypeName === typeName) {
        callback(entity as T);
      }
    }
  }

  /**
   * Helper to set a parameter on an entity safely
   */
  protected setEntityParam(entity: ParameterizedEntity, name: string, value: unknown): boolean {
    // Try direct property access first
    const anyEntity = entity as unknown as Record<string, unknown>;
    if (name in anyEntity && typeof anyEntity[name] === typeof value) {
      anyEntity[name] = value;
      return true;
    }

    // Try setParam method
    if (typeof entity.setParam === 'function') {
      try {
        entity.setParam(name, value);
        return true;
      } catch {
        return false;
      }
    }

    return false;
  }

  /**
   * Optional lifecycle methods
   */
  onEnable?(): void;
  onDisable?(): void;
  dispose?(): void;
}

export default BaseBehavior;
