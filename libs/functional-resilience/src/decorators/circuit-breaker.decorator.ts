type CircuitBreakerOptions = {
  failureThreshold: number;
  resetTimeout: number;
  strategy?: 'linear' | 'exponential' | ((failureCount: number) => number);
};

type CircuitState = {
  isOpen: boolean;
  failureCount: number;
  resetTimer: NodeJS.Timeout | null;
};

const circuitStates: WeakMap<object, Map<string, CircuitState>> = new WeakMap();

function calculateBackoffDelay(
  failureCount: number,
  failureThreshold: number,
  resetTimeout: number,
  strategy: CircuitBreakerOptions['strategy'],
): number {
  if (typeof strategy === 'function') {
    return strategy(failureCount);
  }
  if (strategy === 'exponential') {
    return resetTimeout * 2 ** (failureCount - failureThreshold);
  }
  return resetTimeout * (failureCount - failureThreshold + 1);
}

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
        isOpen: false,
        failureCount: 0,
        resetTimer: null,
      });
    }

    descriptor.value = async function (...args: any[]) {
      const state = targetCircuitStates.get(circuitId)!;

      if (state.isOpen) {
        throw new Error(`CircuitBreaker: Service unavailable (${circuitId})`);
      }

      try {
        const result = await originalMethod.apply(this, args);
        state.failureCount = 0;
        return result;
      } catch (error) {
        state.failureCount++;

        if (state.failureCount >= options.failureThreshold) {
          state.isOpen = true;

          if (state.resetTimer) {
            clearTimeout(state.resetTimer);
          }

          const backoffTimeout = calculateBackoffDelay(
            state.failureCount,
            options.failureThreshold,
            options.resetTimeout,
            options.strategy ?? 'exponential',
          );

          state.resetTimer = setTimeout(() => {
            state.isOpen = false;
            state.resetTimer = null;
          }, backoffTimeout);
        }

        throw error;
      }
    };

    return descriptor;
  };
}
