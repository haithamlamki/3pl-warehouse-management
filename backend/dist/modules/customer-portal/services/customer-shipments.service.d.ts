import { Repository } from 'typeorm';
import { Route, RouteStop, EPod } from '../../../database/entities/route.entity';
import { Order } from '../../../database/entities/order.entity';
export declare class CustomerShipmentsService {
    private readonly routeRepo;
    private readonly routeStopRepo;
    private readonly epodRepo;
    private readonly orderRepo;
    constructor(routeRepo: Repository<Route>, routeStopRepo: Repository<RouteStop>, epodRepo: Repository<EPod>, orderRepo: Repository<Order>);
    getShipments(customerId: string, status?: string): Promise<RouteStop[]>;
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
