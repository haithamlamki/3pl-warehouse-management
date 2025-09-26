import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Parameter decorator to access the authenticated user from request.
 */
export const CurrentUser = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  return request.user;
});


