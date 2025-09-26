declare class PickLineDto {
    orderLineId: string;
    pickedQty: number;
}
export declare class CompleteWaveDto {
    waveId: string;
    picks: PickLineDto[];
}
export {};
