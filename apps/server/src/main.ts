import { NestFactory } from '@nestjs/core';
import { ServerModule } from './server.module';

import { PinoConsoleLoggerService } from '@app/functional-resilience';

async function bootstrap() {
  const app = await NestFactory.create(ServerModule);

  app.useLogger(app.get(PinoConsoleLoggerService));

  // app.setGlobalPrefix('api', { exclude: ['v1/system-monitoring/(.*)'] });

  // app.useGlobalFilters(
  //   new CatchEverythingFilter(app.get(HttpAdapterHost), {
  //     console: { on: true },
  //     file: { on: true },
  //   }),
  // );

  // app.useGlobalFilters(
  //   new CatchHttpExceptionFilter(app.get(HttpAdapterHost), {
  //     console: { on: true },
  //     file: { on: true },
  //   }),
  // );

  await app.listen(process.env.port ?? 3000);
}

bootstrap();
