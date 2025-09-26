import { PackDto } from '../dto/pack.dto';
export declare class PacksService {
    pack(dto: PackDto): Promise<{
        lines: {
            orderLineId: string;
            qty: number;
        }[];
        packId: string;
    }>;
}
