import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Parameter decorator to access current tenant id from headers or user payload.
 */
export const Tenant = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  const fromHeader = request.headers['x-tenant-id'] as string | undefined;
  const fromUser = request.user?.tenantId as string | undefined;
  return fromHeader || fromUser;
});


