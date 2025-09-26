import { RoutesService } from './routes.service';
import { CreateRouteDto } from './dto/create-route.dto';
import { UpdateRouteDto } from './dto/update-route.dto';
import { CompleteStopDto } from './dto/complete-stop.dto';
export declare class RoutesController {
    private readonly routesService;
    constructor(routesService: RoutesService);
    create(createRouteDto: CreateRouteDto): Promise<import("../../database/entities").Route>;
    findAll(): Promise<import("../../database/entities").Route[]>;
    myRoutes(req: any): Promise<import("../../database/entities").Route[]>;
    findOne(id: string): Promise<import("../../database/entities").Route>;
    update(id: string, updateRouteDto: UpdateRouteDto): Promise<import("../../database/entities").Route>;
    assignDriver(id: string, body: {
        driverUserId: string;
    }): Promise<import("../../database/entities").Route>;
    remove(id: string): Promise<void>;
    completeStop(routeId: string, stopId: string, dto: CompleteStopDto): Promise<{
        stopId: string;
        status: string;
        epodId: string;
    }>;
}
