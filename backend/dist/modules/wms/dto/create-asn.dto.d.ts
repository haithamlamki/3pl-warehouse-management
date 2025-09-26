declare class AsnLineDto {
    itemSku: string;
    qty: number;
    lotCode?: string;
}
export declare class CreateAsnDto {
    tenantId: string;
    customerId: string;
    eta: string;
    lines: AsnLineDto[];
}
export {};
