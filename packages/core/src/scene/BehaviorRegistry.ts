import type { Behavior } from "./BehaviorSystem";
import { behaviorSystem } from "./BehaviorSystem";

export type BehaviorFactory<TOptions = unknown> = (options?: TOptions) => Behavior;

export interface ActivationHandle {
  name: string;
  unsubscribe: () => void;
}

export class BehaviorRegistry {
  private factories: Map<string, BehaviorFactory<any>> = new Map();
  private active: Map<string, ActivationHandle> = new Map();

  /**
   * Register or replace a behavior factory by name.
   * Returns true if newly added, false if replaced.
   */
  registerFactory<TOptions = unknown>(name: string, factory: BehaviorFactory<TOptions>): boolean {
    const exists = this.factories.has(name);
    this.factories.set(name, factory as BehaviorFactory<any>);
    return !exists;
  }

  /**
   * Remove a factory by name (does not deactivate active instance).
   */
  removeFactory(name: string): boolean {
    return this.factories.delete(name);
  }

  hasFactory(name: string): boolean {
    return this.factories.has(name);
  }

  listFactories(): string[] {
    return Array.from(this.factories.keys());
  }

  /**
   * Activate a behavior by name (replaces any existing active instance for that name).
   * Returns an unsubscribe function for this activation.
   */
  activate<TOptions = unknown>(name: string, options?: TOptions): () => void {
    const factory = this.factories.get(name) as BehaviorFactory<TOptions> | undefined;
    if (!factory) {
      throw new Error(`Behavior factory "${name}" not found`);
    }

    // If already active, deactivate first (single active instance per name)
    this.deactivate(name);

    const behavior: Behavior = factory(options);
    const unsubscribe = behaviorSystem.register(behavior);

    const handle: ActivationHandle = { name, unsubscribe };
    this.active.set(name, handle);

    // Return unsubscribe that also clears registry tracking if still current
    return () => {
      const current = this.active.get(name);
      if (current && current.unsubscribe === unsubscribe) {
        this.active.delete(name);
      }
      unsubscribe();
    };
  }

  /**
   * Deactivate an active behavior by name. Returns true if it was active.
   */
  deactivate(name: string): boolean {
    const handle = this.active.get(name);
    if (!handle) return false;
    try { handle.unsubscribe(); } finally { this.active.delete(name); }
    return true;
  }

  /**
   * Deactivate all active behaviors.
   */
  deactivateAll(): void {
    for (const [name, handle] of this.active.entries()) {
      try { handle.unsubscribe(); } catch { /* noop */ }
      this.active.delete(name);
    }
  }

  /**
   * List names of currently active behaviors.
   */
  listActive(): string[] {
    return Array.from(this.active.keys());
  }
}

// Shared registry instance for app/runtime usage
export const behaviorRegistry: BehaviorRegistry = new BehaviorRegistry();

