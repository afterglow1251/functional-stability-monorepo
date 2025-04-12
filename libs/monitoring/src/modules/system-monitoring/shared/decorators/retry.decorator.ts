type RetryOptions = {
  attempts: number;
  delay: number;
  strategy?: 'linear' | 'exponential' | ((attempt: number) => number);
};

function calculateDelay(
  attempt: number,
  baseDelay: number,
  strategy: RetryOptions['strategy'],
) {
  if (typeof strategy === 'function') return strategy(attempt);
  if (strategy === 'exponential') return baseDelay * 2 ** (attempt - 1);
  return baseDelay * attempt;
}

export function Retry(options: RetryOptions): MethodDecorator {
  return (
    target: object,
    propertyKey: string | symbol,
    descriptor: TypedPropertyDescriptor<any>,
  ) => {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      let lastError: any;
      for (let attempt = 1; attempt <= options.attempts; attempt++) {
        try {
          return await originalMethod.apply(this, args);
        } catch (error) {
          lastError = error;
          if (attempt < options.attempts) {
            const delay = calculateDelay(
              attempt,
              options.delay,
              options.strategy ?? ('linear' as RetryOptions['strategy']),
            );
            await new Promise((res) => setTimeout(res, delay));
          }
        }
      }
      throw lastError;
    };

    return descriptor;
  };
}
