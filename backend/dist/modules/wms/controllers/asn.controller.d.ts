import { AsnService } from '../services/asn.service';
import { CreateAsnDto } from '../dto/create-asn.dto';
export declare class AsnController {
    private readonly asnService;
    constructor(asnService: AsnService);
    create(dto: CreateAsnDto): Promise<{
        tenantId: string;
        customerId: string;
        eta: string;
        lines: {
            itemSku: string;
            qty: number;
            lotCode?: string;
        }[];
        id: string;
    }>;
}
