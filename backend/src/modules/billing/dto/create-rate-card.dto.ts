import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsDateString, IsNumber, IsOptional, IsString, IsUUID, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class RateCardRuleDto {
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

export class CreateRateCardDto {
  @ApiProperty()
  @IsUUID()
  tenantId: string;

  @ApiProperty()
  @IsUUID()
  customerId: string;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'USD' })
  @IsString()
  currency: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  validFrom?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  validTo?: string;

  @ApiProperty({ required: false, default: true })
  @IsOptional()
  @IsBoolean()
  active?: boolean;

  @ApiProperty({ type: [RateCardRuleDto], required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RateCardRuleDto)
  rules?: RateCardRuleDto[];
}
