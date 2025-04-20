import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  controllers: [UsersController],
  providers: [
    UsersService,
    // {
    //   provide: CATCH_EVERYTHING_FILTER_CONFIG,
    //   useValue: {
    //     console: { on: true },
    //     file: { on: true, options: {} },
    //   } satisfies ExceptionFilterConfig,
    // },
  ],
})
export class UsersModule {}
