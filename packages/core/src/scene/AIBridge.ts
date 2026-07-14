import { aiState } from './AIState';
import { behaviorRegistry } from './BehaviorRegistry';
import { logger } from '../utils/logger';

type QG = {
  set: (key: string, value: unknown) => void;
  get: <T = unknown>(key: string) => T | undefined;
  snapshot: () => Record<string, unknown>;
  help: () => void;
  behaviors: {
    factories: () => string[];
    list: () => string[];
    activate: (name: string, options?: unknown) => () => void;
    deactivate: (name: string) => boolean;
  };
};


declare global {
  interface Window {
    qg?: QG;
  }
}

/**
 * Installs window.qg for quick AI state tweaks in DevTools.
 */
export function setupAIBridge(): void {
  if (typeof window === 'undefined') return;
  if (window.qg) return;

  const qg: QG = {
    set: (key, value) => aiState.set(key, value),
    get: (key) => aiState.get(key),
    snapshot: () => aiState.snapshot(),
    help: () => {
      console.log(
        [
          'Quantum Gallery AI Bridge:',
          "  qg.set('torusPulse.amplitude', 0.8)",
          "  qg.set('torusPulse.speed', 1.2)",
          "  qg.get('torusPulse.amplitude')",
          '  qg.snapshot()',
          '  qg.behaviors.factories()',
        ].join('\n')
      );
    },
    behaviors: {
      factories: () => behaviorRegistry.listFactories(),
      list: () => behaviorRegistry.listActive(),
      activate: (name, options) => {
        return behaviorRegistry.activate(name, options);
      },
      deactivate: (name) => {
        return behaviorRegistry.deactivate(name);
      },
    },    
  };

  Object.defineProperty(window, 'qg', {
    value: qg,
    configurable: false,
    writable: false,
    enumerable: false,
  });

  logger.info('Dev bridge installed. Type qg.help() for usage.');
}
