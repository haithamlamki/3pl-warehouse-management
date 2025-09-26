export declare class CreateContractDto {
    tenantId: string;
    customerId: string;
    startDate: string;
    endDate?: string;
    contractNumber?: string;
    terms?: Record<string, unknown>;
}
