import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, tap } from 'rxjs';

/**
 * Interceptor to log/audit mutating requests.
 */
@Injectable()
export class AuditInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const { method, originalUrl } = req;
    const isMutation = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method);
    const start = Date.now();
    return next.handle().pipe(
      tap(() => {
        if (isMutation) {
          const duration = Date.now() - start;
          // eslint-disable-next-line no-console
          console.log(`[AUDIT] ${method} ${originalUrl} by ${req.user?.id || 'anon'} in ${duration}ms`);
        }
      }),
    );
  }
}


