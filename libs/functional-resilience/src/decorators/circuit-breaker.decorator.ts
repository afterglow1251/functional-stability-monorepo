type CircuitBreakerOptions = {
  failureThreshold: number;
  resetTimeout: number;
};

const STATE_CLOSED = 0;
const STATE_OPEN = 1;
const STATE_HALF_OPEN = 2;

type CircuitState = {
  state: typeof STATE_CLOSED | typeof STATE_OPEN | typeof STATE_HALF_OPEN;
  failureCount: number;
  resetTimer: NodeJS.Timeout | null;
  lastFailureTime: number | null;
  successCount: number;
};

const circuitStates: WeakMap<object, Map<string, CircuitState>> = new WeakMap();

export function CircuitBreaker(options: CircuitBreakerOptions): MethodDecorator {
  return (target, propertyKey, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;
    const circuitId = `${target.constructor.name}.${String(propertyKey)}`;

    if (!circuitStates.has(target)) {
      circuitStates.set(target, new Map());
    }

    const targetCircuitStates = circuitStates.get(target)!;

    if (!targetCircuitStates.has(circuitId)) {
      targetCircuitStates.set(circuitId, {
        state: STATE_CLOSED,
        failureCount: 0,
        resetTimer: null,
        lastFailureTime: null,
        successCount: 0,
      });
    }

    descriptor.value = async function (...args: any[]) {
      const state = targetCircuitStates.get(circuitId)!;

      if (state.state === STATE_OPEN) {
        if (
          state.lastFailureTime &&
          Date.now() - state.lastFailureTime >= options.resetTimeout
        ) {
          state.state = STATE_HALF_OPEN;
          state.successCount = 0;
        } else {
          throw new Error(`CircuitBreaker: Service unavailable (${circuitId})`);
        }
      }

      try {
        const result = await originalMethod.apply(this, args);

        if (state.state === STATE_HALF_OPEN) {
          ++state.successCount;

          if (state.successCount >= options.failureThreshold) {
            state.state = STATE_CLOSED;
            state.failureCount = 0;
            state.lastFailureTime = null;
            if (state.resetTimer) {
              clearTimeout(state.resetTimer);
              state.resetTimer = null;
            }
          }
        } else {
          state.failureCount = 0;
        }

        return result;
      } catch (error) {
        if (state.state === STATE_HALF_OPEN) {
          state.state = STATE_OPEN;
          state.lastFailureTime = Date.now();

          if (state.resetTimer) {
            clearTimeout(state.resetTimer);
          }
          state.resetTimer = setTimeout(() => {
            state.state = STATE_HALF_OPEN;
            state.successCount = 0;
          }, options.resetTimeout);
        } else {
          state.failureCount++;

          if (state.failureCount >= options.failureThreshold) {
            state.state = STATE_OPEN;
            state.lastFailureTime = Date.now();

            if (state.resetTimer) {
              clearTimeout(state.resetTimer);
            }
            state.resetTimer = setTimeout(() => {
              state.state = STATE_HALF_OPEN;
              state.successCount = 0;
            }, options.resetTimeout);
          }
        }

        throw error;
      }
    };

    return descriptor;
  };
}
