// packages/core/src/scene/__tests__/SceneManager.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SceneManager, SceneEntity, SceneState } from '../SceneManager';

describe('SceneManager', () => {
  let manager: SceneManager;

  beforeEach(() => {
    manager = new SceneManager();
  });

  describe('entity management', () => {
    it('should add an entity', () => {
      const entity: SceneEntity = { id: 'test-entity' };
      manager.add(entity);
      // Entity should be added (no public way to check, but init should be called)
    });

    it('should call init on added entity', () => {
      const init = vi.fn();
      const entity: SceneEntity = { id: 'test-entity', init };

      manager.add(entity);

      expect(init).toHaveBeenCalledTimes(1);
    });

    it('should not add duplicate entities', () => {
      const init = vi.fn();
      const entity: SceneEntity = { id: 'test-entity', init };

      manager.add(entity);
      manager.add(entity);

      expect(init).toHaveBeenCalledTimes(1);
    });

    it('should remove an entity', () => {
      const dispose = vi.fn();
      const entity: SceneEntity = { id: 'test-entity', dispose };

      manager.add(entity);
      manager.remove('test-entity');

      expect(dispose).toHaveBeenCalledTimes(1);
    });

    it('should handle removing non-existent entity', () => {
      // Should not throw
      manager.remove('non-existent');
    });
  });

  describe('step', () => {
    it('should call tick on all entities', () => {
      const tick1 = vi.fn();
      const tick2 = vi.fn();

      manager.add({ id: 'e1', tick: tick1 });
      manager.add({ id: 'e2', tick: tick2 });

      const state: SceneState = { time: 1, dt: 0.016, frame: 1 };
      manager.step(state);

      expect(tick1).toHaveBeenCalledTimes(1);
      expect(tick2).toHaveBeenCalledTimes(1);
    });

    it('should pass context to tick', () => {
      const tick = vi.fn();
      manager.add({ id: 'test', tick });

      const state: SceneState = { time: 1, dt: 0.016, frame: 1 };
      manager.step(state);

      expect(tick).toHaveBeenCalledWith(
        expect.objectContaining({
          state,
          get: expect.any(Function),
          set: expect.any(Function),
        })
      );
    });
  });

  describe('store', () => {
    it('should set and get values', () => {
      manager.set('key', 'value');
      expect(manager.get('key')).toBe('value');
    });

    it('should return undefined for non-existent keys', () => {
      expect(manager.get('non-existent')).toBeUndefined();
    });

    it('should support typed get', () => {
      manager.set('number', 42);
      const value = manager.get<number>('number');
      expect(value).toBe(42);
    });
  });

  describe('clear', () => {
    it('should dispose all entities', () => {
      const dispose1 = vi.fn();
      const dispose2 = vi.fn();

      manager.add({ id: 'e1', dispose: dispose1 });
      manager.add({ id: 'e2', dispose: dispose2 });

      manager.clear();

      expect(dispose1).toHaveBeenCalledTimes(1);
      expect(dispose2).toHaveBeenCalledTimes(1);
    });

    it('should clear the store', () => {
      manager.set('key', 'value');
      manager.clear();
      expect(manager.get('key')).toBeUndefined();
    });
  });
});
