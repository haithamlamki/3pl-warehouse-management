import { Repository } from 'typeorm';
import { Route, RouteStop, EPod } from '../../database/entities/route.entity';
import { Order } from '../../database/entities/order.entity';
import { CreateRouteDto } from './dto/create-route.dto';
import { UpdateRouteDto } from './dto/update-route.dto';
import { CompleteStopDto } from './dto/complete-stop.dto';
import { InvoiceService } from '../billing/services/invoice.service';
export declare class RoutesService {
    private readonly routeRepository;
    private readonly stopRepository;
    private readonly epodRepository;
    private readonly orderRepository;
    private readonly invoiceService;
    constructor(routeRepository: Repository<Route>, stopRepository: Repository<RouteStop>, epodRepository: Repository<EPod>, orderRepository: Repository<Order>, invoiceService: InvoiceService);
    create(createRouteDto: CreateRouteDto): Promise<Route>;
    findAll(): Promise<Route[]>;
    findDriverRoutes(driverUserId: string, tenantId: string): Promise<Route[]>;
    findOne(id: string): Promise<Route>;
    update(id: string, updateRouteDto: UpdateRouteDto): Promise<Route>;
    assignDriver(id: string, driverUserId: string): Promise<Route>;
    remove(id: string): Promise<void>;
    completeStop(dto: CompleteStopDto): Promise<{
        stopId: string;
        status: string;
        epodId: string;
    }>;
}
