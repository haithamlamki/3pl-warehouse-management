import { Repository } from 'typeorm';
import { Order, OrderLine } from '../../database/entities/order.entity';
import { Inventory } from '../../database/entities/inventory.entity';
import { CreateReceiptDto } from '../dto/create-receipt.dto';
import { CreateCycleCountDto, PostCycleCountDto } from '../dto/create-cycle-count.dto';
import { UnbilledTxnService } from '../../billing/services/unbilled-txn.service';
export declare class ReceiptsService {
    private readonly orderRepo;
    private readonly orderLineRepo;
    private readonly inventoryRepo;
    private readonly unbilledTxnService;
    constructor(orderRepo: Repository<Order>, orderLineRepo: Repository<OrderLine>, inventoryRepo: Repository<Inventory>, unbilledTxnService: UnbilledTxnService);
    postReceipt(dto: CreateReceiptDto): Promise<{
        receiptId: string;
        orderId: any;
        status: string;
        linesProcessed: number;
    }>;
    startCycleCount(dto: CreateCycleCountDto): Promise<{
        warehouseId: string;
        binId: string;
        itemSku: string;
        countedQty: number;
        lotId?: string;
        cycleCountId: string;
        status: string;
    }>;
    postCycleCount(dto: PostCycleCountDto): Promise<{
        cycleCountId: any;
        status: string;
        discrepanciesProcessed: any;
    }>;
}
