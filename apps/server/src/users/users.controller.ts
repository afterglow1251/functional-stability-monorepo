import {
  Controller,
  ForbiddenException,
  Get,
  Inject,
  UseFilters,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CatchHttpExceptionFilter, CatchEverythingFilter } from '@app/logger';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  // @UseFilters(CatchEverythingFilter)
  getUsers() {
    // return this.usersService.findUsers();
    throw new ForbiddenException('users forbidden');
  }
}
