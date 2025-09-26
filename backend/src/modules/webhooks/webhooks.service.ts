import { Injectable } from '@nestjs/common';

@Injectable()
export class WebhooksService {
  async handleEvent(headers: Record<string, string>, payload: any): Promise<void> {
    // Verify signature if needed
    // Process payload and dispatch to proper handler
    // eslint-disable-next-line no-console
    console.log('[WEBHOOK] headers=', headers, 'payload=', JSON.stringify(payload));
  }
}


