import { NestFactory } from '@nestjs/core';
import { ServerModule } from './server.module';

import { PinoConsoleLoggerService } from '@app/functional-resilience';

async function bootstrap() {
  const app = await NestFactory.create(ServerModule);

  // Use PinoConsoleLogger
  app.useLogger(app.get(PinoConsoleLoggerService));

  await app.listen(process.env.port ?? 3000);
}

bootstrap();
