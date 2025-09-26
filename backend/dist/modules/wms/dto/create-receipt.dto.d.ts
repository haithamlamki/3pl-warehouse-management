declare class ReceiptLineDto {
    itemSku: string;
    qty: number;
    lotCode?: string;
    qualityStatus?: 'PENDING' | 'ACCEPTED' | 'REJECTED';
}
export declare class CreateReceiptDto {
    tenantId: string;
    warehouseId: string;
    lines: ReceiptLineDto[];
}
export {};
