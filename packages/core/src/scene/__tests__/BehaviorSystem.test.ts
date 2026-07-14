// packages/core/src/scene/__tests__/BehaviorSystem.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BehaviorSystem, Behavior } from '../BehaviorSystem';
import { SceneManager } from '../SceneManager';

describe('BehaviorSystem', () => {
  let system: BehaviorSystem;
  let manager: SceneManager;

  beforeEach(() => {
    system = new BehaviorSystem();
    manager = new SceneManager();
  });

  describe('register', () => {
    it('should register a behavior and return unsubscribe function', () => {
      const behavior: Behavior = {
        id: 'test-behavior',
        enabled: true,
        tick: vi.fn(),
      };

      const unsubscribe = system.register(behavior);

      expect(typeof unsubscribe).toBe('function');
    });

    it('should generate an id if none provided', () => {
      const behavior: Behavior = {
        enabled: true,
        tick: vi.fn(),
      };

      system.register(behavior);
      // Should not throw
    });

    it('should unsubscribe correctly', () => {
      const tick = vi.fn();
      const behavior: Behavior = {
        id: 'test-behavior',
        enabled: true,
        tick,
      };

      const unsubscribe = system.register(behavior);
      system.update(0.016, manager);
      expect(tick).toHaveBeenCalledTimes(1);

      unsubscribe();
      system.update(0.016, manager);
      expect(tick).toHaveBeenCalledTimes(1); // Still 1, not called again
    });
  });

  describe('update', () => {
    it('should call tick on all enabled behaviors', () => {
      const tick1 = vi.fn();
      const tick2 = vi.fn();

      system.register({ id: 'b1', enabled: true, tick: tick1 });
      system.register({ id: 'b2', enabled: true, tick: tick2 });

      system.update(0.016, manager);

      expect(tick1).toHaveBeenCalledTimes(1);
      expect(tick2).toHaveBeenCalledTimes(1);
    });

    it('should not call tick on disabled behaviors', () => {
      const tick = vi.fn();
      system.register({ id: 'disabled', enabled: false, tick });

      system.update(0.016, manager);

      expect(tick).not.toHaveBeenCalled();
    });

    it('should pass correct arguments to tick', () => {
      const tick = vi.fn();
      system.register({ id: 'test', enabled: true, tick });

      system.update(0.016, manager);

      expect(tick).toHaveBeenCalledWith(
        0.016,
        expect.any(Number),
        manager
      );
    });
  });

  describe('enable/disable', () => {
    it('should enable a behavior by id', () => {
      const tick = vi.fn();
      system.register({ id: 'test', enabled: false, tick });

      system.enable('test');
      system.update(0.016, manager);

      expect(tick).toHaveBeenCalled();
    });

    it('should disable a behavior by id', () => {
      const tick = vi.fn();
      system.register({ id: 'test', enabled: true, tick });

      system.disable('test');
      system.update(0.016, manager);

      expect(tick).not.toHaveBeenCalled();
    });
  });

  describe('clear', () => {
    it('should remove all behaviors', () => {
      const tick1 = vi.fn();
      const tick2 = vi.fn();

      system.register({ id: 'b1', enabled: true, tick: tick1 });
      system.register({ id: 'b2', enabled: true, tick: tick2 });

      system.clear();
      system.update(0.016, manager);

      expect(tick1).not.toHaveBeenCalled();
      expect(tick2).not.toHaveBeenCalled();
    });
  });

  describe('time', () => {
    it('should track elapsed time', () => {
      expect(system.time).toBe(0);
      system.update(0.016, manager);
      expect(system.time).toBeGreaterThan(0);
    });
  });
});
