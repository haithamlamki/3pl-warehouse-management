import { PutawayService } from '../services/putaway.service';
import { PutawayDto } from '../dto/putaway.dto';
export declare class PutawayController {
    private readonly putawayService;
    constructor(putawayService: PutawayService);
    execute(dto: PutawayDto): Promise<{
        success: boolean;
        moves: {
            inventoryId: string;
            targetBinId: string;
            qty: number;
        }[];
    }>;
}
