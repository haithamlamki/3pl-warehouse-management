import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('health')
@Controller()
export class HealthController {
  @Get()
  @ApiOperation({ summary: 'Health check endpoint' })
  @ApiResponse({ 
    status: 200, 
    description: 'Service is healthy',
    schema: {
      type: 'object',
      properties: {
        ok: { type: 'boolean' },
        timestamp: { type: 'string' },
        uptime: { type: 'number' },
        environment: { type: 'string' }
      }
    }
  })
  ping() {
    return {
      ok: true,
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development'
    };
  }

  @Get('ready')
  @ApiOperation({ summary: 'Readiness check endpoint' })
  @ApiResponse({ 
    status: 200, 
    description: 'Service is ready to accept requests',
    schema: {
      type: 'object',
      properties: {
        ready: { type: 'boolean' },
        checks: {
          type: 'object',
          properties: {
            database: { type: 'boolean' },
            redis: { type: 'boolean' }
          }
        }
      }
    }
  })
  ready() {
    // TODO: Add actual health checks for database and Redis
    return {
      ready: true,
      checks: {
        database: true,
        redis: true
      }
    };
  }
}
