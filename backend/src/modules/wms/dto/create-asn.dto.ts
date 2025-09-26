import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsDateString, IsOptional, IsString, IsUUID, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class AsnLineDto {
  @ApiProperty()
  @IsString()
  itemSku: string;

  @ApiProperty({ example: 10 })
  qty: number;

  @ApiProperty({ required: false })
  @IsOptional()
  lotCode?: string;
}

export class CreateAsnDto {
  @ApiProperty()
  @IsUUID()
  tenantId: string;

  @ApiProperty()
  @IsUUID()
  customerId: string;

  @ApiProperty({ example: '2025-01-26' })
  @IsDateString()
  eta: string;

  @ApiProperty({ type: [AsnLineDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AsnLineDto)
  lines: AsnLineDto[];
}


