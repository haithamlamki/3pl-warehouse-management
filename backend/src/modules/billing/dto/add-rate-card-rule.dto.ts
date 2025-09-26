import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

/**
 * @class AddRateCardRuleDto
 * @description Data transfer object for adding a new rule to a rate card.
 */
export class AddRateCardRuleDto {
  /**
   * The type of service this rule applies to (e.g., 'STORAGE', 'PICKING').
   * @type {string}
   * @example 'STORAGE'
   */
  @ApiProperty({ description: "The type of service this rule applies to (e.g., 'STORAGE', 'PICKING').", example: 'STORAGE' })
  @IsString()
  serviceType: string;

  /**
   * The unit of measure for the service (e.g., 'm3', 'kg', 'PCS').
   * @type {string}
   * @example 'm3'
   */
  @ApiProperty({ description: "The unit of measure for the service (e.g., 'm3', 'kg', 'PCS').", example: 'm3' })
  @IsString()
  uom: string;

  /**
   * The lower bound of the quantity tier for this rule to apply.
   * @type {number}
   * @example 0
   */
  @ApiProperty({ description: 'The lower bound of the quantity tier for this rule to apply.', example: 0 })
  @IsNumber()
  tierFrom: number;

  /**
   * The optional upper bound of the quantity tier. If null, the rule applies to all quantities above the lower bound.
   * @type {number}
   * @example 100
   */
  @ApiProperty({ description: 'The optional upper bound of the quantity tier. If null, it applies to all quantities above the lower bound.', required: false, example: 100 })
  @IsOptional()
  @IsNumber()
  tierTo?: number;

  /**
   * The price per unit for this service tier.
   * @type {number}
   * @example 10.50
   */
  @ApiProperty({ description: 'The price per unit for this service tier.', example: 10.5 })
  @IsNumber()
  price: number;

  /**
   * The optional minimum fee for this service. If the calculated price is less than this fee, the minimum fee will be charged.
   * @type {number}
   * @example 50
   */
  @ApiProperty({ description: 'The optional minimum fee for this service. If the calculated price is less than this, the minimum fee is charged.', required: false, example: 50 })
  @IsOptional()
  @IsNumber()
  minFee?: number;
}