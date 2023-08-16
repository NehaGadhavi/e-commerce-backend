import { SetMetadata } from '@nestjs/common';
import { UserRoles } from '../utils/enums';

export const Roles = (...roles: UserRoles[]) => SetMetadata('roles', roles);
