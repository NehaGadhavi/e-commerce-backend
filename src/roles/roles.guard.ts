import { Injectable, CanActivate, ExecutionContext, BadRequestException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ERROR_MSG } from '../utils/constants';
import { UserRoles } from '../utils/enums';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<UserRoles[]>(
      'roles',
      context.getHandler(),
    );

    if (!roles) {
      return true; // If roles are not set, allow access.
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (
      !user ||
      !user.roles.toString() ||
      !this.matchRoles(roles, user.roles)
    ) {
      throw new BadRequestException(ERROR_MSG.unauthorized_error); // If the user does not have any of the allowed roles, deny access.
    }

    return true;
  }

  matchRoles(roles: UserRoles[], userRole: any) {
    return roles.some((role) => role === userRole);
  }
}
