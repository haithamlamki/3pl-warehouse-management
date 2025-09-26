import { SetMetadata } from '@nestjs/common';
import { ROLES_METADATA_KEY } from '../guards/roles.guard';

/**
 * Decorator to declare required role codes for route access.
 * @param roles List of role codes (e.g. 'admin', 'ops')
 */
export const Roles = (...roles: string[]) => SetMetadata(ROLES_METADATA_KEY, roles);


