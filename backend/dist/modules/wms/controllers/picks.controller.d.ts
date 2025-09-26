import { PicksService } from '../services/picks.service';
import { CreateWaveDto } from '../dto/create-wave.dto';
import { CompleteWaveDto } from '../dto/complete-wave.dto';
export declare class PicksController {
    private readonly picksService;
    constructor(picksService: PicksService);
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
    fulfillOrder(orderId: string): Promise<{
        orderId: string;
        status: string;
        message: string;
    }>;
}
