import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';

/**
 * Global HTTP exception filter to standardize error responses.
 */
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const isHttp = exception instanceof HttpException;
    const status = isHttp ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    const message = isHttp ? (exception.getResponse() as any) : 'Internal server error';

    response.status(status).json({
      success: false,
      path: request.url,
      timestamp: new Date().toISOString(),
      error: typeof message === 'string' ? { message } : message,
    });
  }
}


