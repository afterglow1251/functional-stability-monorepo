import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { ServerModule } from './server.module';

// import { CatchHttpExceptionFilter, CatchEverythingFilter } from 'libs/logger/src';
// import { ClsService } from 'nestjs-cls';
import { PinoConsoleLoggerService } from '@app/logger/shared/services/console-logger.service';

async function bootstrap() {
  const app = await NestFactory.create(ServerModule);

  app.useLogger(app.get(PinoConsoleLoggerService));

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
