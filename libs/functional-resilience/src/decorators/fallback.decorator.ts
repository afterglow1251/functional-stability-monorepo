export function Fallback(
  fallbackValue: any | ((error: any, context?: any) => any),
  options?: { ignore?: (error: any) => boolean },
): MethodDecorator {
  return (target, propertyKey, descriptor: PropertyDescriptor) => {
    const original = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      try {
        return await original.apply(this, args);
      } catch (error) {
        if (options?.ignore && !options.ignore(error)) throw error;

        if (typeof fallbackValue === 'function') {
          return fallbackValue(error, { args, methodName: propertyKey });
        }
        return fallbackValue;
      }
    };
  };
}
