import { PutawayDto } from '../dto/putaway.dto';
export declare class PutawayService {
    execute(dto: PutawayDto): Promise<{
        success: boolean;
        moves: {
            inventoryId: string;
            targetBinId: string;
            qty: number;
        }[];
    }>;
}
