// packages/core/src/scene/__tests__/AIState.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AIChannel } from '../AIState';

describe('AIChannel', () => {
  let aiState: AIChannel;

  beforeEach(() => {
    aiState = new AIChannel();
  });

  describe('set/get', () => {
    it('should set and get values', () => {
      aiState.set('key', 'value');
      expect(aiState.get('key')).toBe('value');
    });

    it('should return undefined for non-existent keys', () => {
      expect(aiState.get('non-existent')).toBeUndefined();
    });

    it('should support typed get', () => {
      aiState.set('number', 42);
      const value = aiState.get<number>('number');
      expect(value).toBe(42);
    });

    it('should overwrite existing values', () => {
      aiState.set('key', 'value1');
      aiState.set('key', 'value2');
      expect(aiState.get('key')).toBe('value2');
    });
  });

  describe('subscribe', () => {
    it('should call listener when value changes', () => {
      const listener = vi.fn();
      aiState.subscribe('key', listener);

      aiState.set('key', 'value');

      expect(listener).toHaveBeenCalledWith('value');
    });

    it('should not call listener for other keys', () => {
      const listener = vi.fn();
      aiState.subscribe('key1', listener);

      aiState.set('key2', 'value');

      expect(listener).not.toHaveBeenCalled();
    });

    it('should return subscription with unsubscribe', () => {
      const listener = vi.fn();
      const subscription = aiState.subscribe('key', listener);

      subscription.unsubscribe();
      aiState.set('key', 'value');

      expect(listener).not.toHaveBeenCalled();
    });

    it('should support multiple subscribers', () => {
      const listener1 = vi.fn();
      const listener2 = vi.fn();

      aiState.subscribe('key', listener1);
      aiState.subscribe('key', listener2);

      aiState.set('key', 'value');

      expect(listener1).toHaveBeenCalledWith('value');
      expect(listener2).toHaveBeenCalledWith('value');
    });
  });

  describe('snapshot', () => {
    it('should return all current values', () => {
      aiState.set('key1', 'value1');
      aiState.set('key2', 42);

      const snapshot = aiState.snapshot();

      expect(snapshot).toEqual({
        key1: 'value1',
        key2: 42,
      });
    });

    it('should return empty object when no values set', () => {
      expect(aiState.snapshot()).toEqual({});
    });
  });

  describe('clear', () => {
    it('should remove all values', () => {
      aiState.set('key1', 'value1');
      aiState.set('key2', 'value2');

      aiState.clear();

      expect(aiState.get('key1')).toBeUndefined();
      expect(aiState.get('key2')).toBeUndefined();
    });
  });
});
