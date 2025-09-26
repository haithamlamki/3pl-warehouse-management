import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateCycleCountDto {
  @ApiProperty({ description: 'Warehouse ID' })
  @IsUUID()
  warehouseId: string;

  @ApiProperty({ description: 'Bin ID' })
  @IsUUID()
  binId: string;

  @ApiProperty({ description: 'Item SKU' })
  @IsString()
  itemSku: string;

  @ApiProperty({ description: 'Counted quantity' })
  @IsNumber()
  countedQty: number;

  @ApiProperty({ description: 'Lot ID', required: false })
  @IsUUID()
  @IsOptional()
  lotId?: string;
}


