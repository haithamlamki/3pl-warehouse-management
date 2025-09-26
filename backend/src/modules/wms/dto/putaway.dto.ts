import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsUUID, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class PutawayMoveDto {
  @ApiProperty()
  @IsUUID()
  inventoryId: string;

  @ApiProperty()
  @IsUUID()
  targetBinId: string;

  @ApiProperty({ example: 5 })
  qty: number;
}

export class PutawayDto {
  @ApiProperty({ type: [PutawayMoveDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PutawayMoveDto)
  moves: PutawayMoveDto[];
}


