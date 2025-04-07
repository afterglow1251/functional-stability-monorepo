import {
  Controller,
  Get,
  Logger,
  Res,
  UseFilters,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { ServerService } from './server.service';
import { CatchHttpExceptionFilter } from '@app/logger';
import { LoggerInterceptor } from '@app/logger/modules/interceptor/logger.interceptor';

@Controller()
export class ServerController {
  private readonly logger = new Logger(ServerController.name);

  constructor(private readonly serverService: ServerService) {}

  @Get()
  async getHello(): Promise<string> {
    this.logger.log('GET hello controller');
    return await this.serverService.getHello();
  }

  @Get('test')
  // @UseInterceptors(LoggerInterceptor)
  getTest(): any {
    return { message: 'test' };
  }

  @Get('error')
  // @UseFilters(CatchHttpExceptionFilter)
  getError(): string {
    return this.serverService.getError();
  }
}
