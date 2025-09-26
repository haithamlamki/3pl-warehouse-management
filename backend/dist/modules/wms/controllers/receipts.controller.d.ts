import { ReceiptsService } from '../services/receipts.service';
import { CreateReceiptDto } from '../dto/create-receipt.dto';
import { CreateCycleCountDto } from '../dto/create-cycle-count.dto';
export declare class ReceiptsController {
    private readonly receiptsService;
    constructor(receiptsService: ReceiptsService);
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
    postCycleCount(dto: CreateCycleCountDto): Promise<{
        cycleCountId: any;
        status: string;
        discrepanciesProcessed: any;
    }>;
}
