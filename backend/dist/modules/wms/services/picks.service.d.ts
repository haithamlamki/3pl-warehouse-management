import { Repository } from 'typeorm';
import { Order, OrderLine } from '../../database/entities/order.entity';
import { Inventory } from '../../database/entities/inventory.entity';
import { CreateWaveDto } from '../dto/create-wave.dto';
import { CompleteWaveDto } from '../dto/complete-wave.dto';
import { UnbilledTxnService } from '../../billing/services/unbilled-txn.service';
export declare class PicksService {
    private readonly orderRepo;
    private readonly orderLineRepo;
    private readonly inventoryRepo;
    private readonly unbilledTxnService;
    constructor(orderRepo: Repository<Order>, orderLineRepo: Repository<OrderLine>, inventoryRepo: Repository<Inventory>, unbilledTxnService: UnbilledTxnService);
    createWave(dto: CreateWaveDto): Promise<{
        waveId: string;
        orders: string[];
        status: string;
        orderCount: number;
    }>;
    completeWave(dto: CompleteWaveDto): Promise<{
        waveId: string;
        status: string;
        packedOrders: any;
        orderCount: number;
    }>;
    fulfillOrder(orderId: string): Promise<void>;
}
