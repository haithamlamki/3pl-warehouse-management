declare class PutawayMoveDto {
    inventoryId: string;
    targetBinId: string;
    qty: number;
}
export declare class PutawayDto {
    moves: PutawayMoveDto[];
}
export {};
