import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UsersEntity } from './auth/users.entity';

export const User = createParamDecorator((data, ctx: ExecutionContext): UsersEntity => {
  const req = ctx.switchToHttp().getRequest();
  return req.user;
});
