import { SetMetadata } from '@nestjs/common';
import { UserRoles } from 'src/utils/enums';


export const Roles = (...roles: UserRoles[]) => SetMetadata('roles', roles);