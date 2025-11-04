export type AIValue = unknown;

export type AISubscription = {
  key: string;
  unsubscribe: () => void;
};

type Listener = (value: AIValue) => void;

/**
 * Minimal key-value pub/sub channel for AI-driven signals.
 * - set/get individual values
 * - subscribe per-key, returns unsubscribe
 * - snapshot to plain object for debugging/serialization
 */
export class AIChannel {
  private store = new Map<string, AIValue>();
  private listeners = new Map<string, Set<Listener>>();

  set(key: string, value: AIValue): void {
    this.store.set(key, value);
    const ls = this.listeners.get(key);
    if (ls) for (const fn of ls) { try { fn(value); } catch { /* noop */ } }
  }

  get<T = AIValue>(key: string): T | undefined {
    return this.store.get(key) as T | undefined;
  }

  subscribe(key: string, fn: Listener): AISubscription {
    let set = this.listeners.get(key);
    if (!set) { set = new Set<Listener>(); this.listeners.set(key, set); }
    set.add(fn);
    return {
      key,
      unsubscribe: () => {
        const s = this.listeners.get(key);
        if (!s) return;
        s.delete(fn);
        if (s.size === 0) this.listeners.delete(key);
      }
    };
  }

  snapshot(): Record<string, AIValue> {
    const out: Record<string, AIValue> = {};
    for (const [k, v] of this.store.entries()) out[k] = v;
    return out;
  }

  clear(): void {
    this.store.clear();
    this.listeners.clear();
  }
}

// Shared instance
export const aiState = new AIChannel();
