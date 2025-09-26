import { CreateAsnDto } from '../dto/create-asn.dto';
export declare class AsnService {
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
