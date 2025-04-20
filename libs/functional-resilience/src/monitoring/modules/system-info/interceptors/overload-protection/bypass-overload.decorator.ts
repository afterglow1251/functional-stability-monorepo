import { SetMetadata } from '@nestjs/common';

export const BYPASS_OVERLOAD_KEY = Symbol('bypassOverload');

export const BypassOverload = () => SetMetadata(BYPASS_OVERLOAD_KEY, true);
