import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class AddRateCardRuleDto {
  @ApiProperty()
  @IsString()
  serviceType: string;

  @ApiProperty()
  @IsString()
  uom: string;

  @ApiProperty({ example: 0 })
  @IsNumber()
  tierFrom: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  tierTo?: number;

  @ApiProperty({ example: 10.50 })
  @IsNumber()
  price: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  minFee?: number;
}
