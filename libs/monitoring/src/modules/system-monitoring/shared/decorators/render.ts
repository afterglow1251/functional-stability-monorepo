import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { readFileSync } from 'fs';
import { join } from 'path';

let cachedHtml: Map<string, string> = new Map();

export const MyCashRender = createParamDecorator(
  (path: string, ctx: ExecutionContext) => {
    if (!path) {
      return 'Error: path not provided to @MyRender';
    }

    if (cachedHtml.has(path)) {
      return cachedHtml.get(path);
    }

    const filePath = join(process.cwd(), path);

    try {
      const fileContent = readFileSync(filePath, 'utf-8');
      cachedHtml.set(path, fileContent);
      return fileContent;
    } catch (error) {
      return `Error reading file (check @MyRender path: ${filePath})`;
    }
  },
);

export const MyRender = createParamDecorator(
  (path: string, ctx: ExecutionContext) => {
    if (!path) {
      return 'Error: path not provided to @MyRender';
    }

    const filePath = join(process.cwd(), path);

    try {
      const fileContent = readFileSync(filePath, 'utf-8');
      return fileContent;
    } catch (error) {
      return `Error reading file (check @MyRender path: ${filePath})`;
    }
  },
);
