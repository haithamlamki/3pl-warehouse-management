import { Body, Controller, Headers, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { WebhooksService } from './webhooks.service';

@ApiTags('webhooks')
@Controller('webhooks')
export class WebhooksController {
  constructor(private readonly service: WebhooksService) {}

  @Post('events')
  @ApiOperation({ summary: 'Receive external webhook event' })
  async receiveEvent(@Headers() headers: Record<string, string>, @Body() body: any) {
    await this.service.handleEvent(headers, body);
    return { received: true };
  }
}


