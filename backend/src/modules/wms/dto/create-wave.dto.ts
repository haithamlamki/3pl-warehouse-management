import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsUUID } from 'class-validator';

export class CreateWaveDto {
  @ApiProperty({ type: [String], description: 'Order IDs to include in wave' })
  @IsArray()
  @IsUUID(undefined, { each: true })
  orderIds: string[];
}


