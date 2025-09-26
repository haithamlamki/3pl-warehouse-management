import { WebhooksService } from './webhooks.service';
export declare class WebhooksController {
    private readonly service;
    constructor(service: WebhooksService);
    receiveEvent(headers: Record<string, string>, body: any): Promise<{
        received: boolean;
    }>;
}
