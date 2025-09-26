import { PacksService } from '../services/packs.service';
import { PackDto } from '../dto/pack.dto';
export declare class PacksController {
    private readonly packsService;
    constructor(packsService: PacksService);
    pack(dto: PackDto): Promise<{
        lines: {
            orderLineId: string;
            qty: number;
        }[];
        packId: string;
    }>;
}
