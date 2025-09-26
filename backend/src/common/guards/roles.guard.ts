import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

export const ROLES_METADATA_KEY = 'roles';

/**
 * Guard that enforces RBAC using role codes attached via `@Roles`.
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_METADATA_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user as { userRoles?: { role: { code: string } }[]; roles?: string[] };

    const userRoles: string[] = Array.isArray(user?.roles)
      ? user.roles
      : (user?.userRoles || []).map((ur) => ur.role?.code).filter(Boolean);

    const hasRole = requiredRoles.some((role) => userRoles.includes(role));
    if (!hasRole) {
      throw new ForbiddenException('Insufficient role to access this resource');
    }
    return true;
  }
}


