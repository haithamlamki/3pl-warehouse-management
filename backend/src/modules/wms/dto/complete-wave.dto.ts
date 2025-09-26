import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsArray, ValidateNested, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

class PickLineDto {
  @ApiProperty({ description: 'Order line ID' })
  @IsString()
  orderLineId: string;

  @ApiProperty({ description: 'Picked quantity' })
  @IsNumber()
  pickedQty: number;
}

export class CompleteWaveDto {
  @ApiProperty({ description: 'Wave ID' })
  @IsString()
  waveId: string;

  @ApiProperty({ description: 'Picked lines', type: [PickLineDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PickLineDto)
  picks: PickLineDto[];
}


