import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString, IsUUID, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class ReceiptLineDto {
  @ApiProperty()
  @IsString()
  itemSku: string;

  @ApiProperty({ example: 10 })
  qty: number;

  @ApiProperty({ required: false })
  @IsOptional()
  lotCode?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  qualityStatus?: 'PENDING' | 'ACCEPTED' | 'REJECTED';
}

export class CreateReceiptDto {
  @ApiProperty()
  @IsUUID()
  tenantId: string;

  @ApiProperty()
  @IsUUID()
  warehouseId: string;

  @ApiProperty({ type: [ReceiptLineDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ReceiptLineDto)
  lines: ReceiptLineDto[];
}


