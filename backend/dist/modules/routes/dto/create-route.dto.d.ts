export declare class CreateRouteDto {
    name: string;
    description?: string;
    driverId?: string;
    vehicleId?: string;
    plannedStartTime?: string;
    plannedEndTime?: string;
    totalDistance?: number;
    tenantId: string;
    stops?: RouteStopInput[];
}
export declare class RouteStopInput {
    orderId: string;
    seq: number;
}
