import { CustomerShipmentsService } from '../services/customer-shipments.service';
export declare class CustomerShipmentsController {
    private readonly shipmentsService;
    constructor(shipmentsService: CustomerShipmentsService);
    getShipments(customerId: string, status?: string): Promise<import("../../../database/entities").RouteStop[]>;
    trackShipment(trackingNumber: string): Promise<{
        trackingNumber: string;
        status: string;
        currentLocation: string;
        estimatedDelivery: string;
        history: {
            status: string;
            location: string;
            timestamp: string;
        }[];
    }>;
}
