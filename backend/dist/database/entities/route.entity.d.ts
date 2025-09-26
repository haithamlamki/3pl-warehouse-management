import { User } from './user.entity';
import { Order } from './order.entity';
export declare class Route {
    id: string;
    tenantId: string;
    driverUserId: string;
    status: string;
    routeNumber: string;
    plannedStartTime: Date;
    actualStartTime: Date;
    actualEndTime: Date;
    totalDistance: number;
    totalDuration: number;
    createdAt: Date;
    updatedAt: Date;
    driver: User;
    stops: RouteStop[];
}
export declare class RouteStop {
    id: string;
    routeId: string;
    orderId: string;
    seq: number;
    eta: Date;
    actualArrival: Date;
    status: string;
    address: any;
    latitude: number;
    longitude: number;
    createdAt: Date;
    updatedAt: Date;
    route: Route;
    order: Order;
}
export declare class EPod {
    id: string;
    orderId: string;
    signerName: string;
    signerId: string;
    photos: any;
    latitude: number;
    longitude: number;
    completedAt: Date;
    notes: string;
    createdAt: Date;
    updatedAt: Date;
    order: Order;
}
