import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsUUID, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class PackLineDto {
  @ApiProperty()
  @IsUUID()
  orderLineId: string;

  @ApiProperty({ example: 3 })
  qty: number;
}

export class PackDto {
  @ApiProperty({ type: [PackLineDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PackLineDto)
  lines: PackLineDto[];
}


