import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsDateString, IsNumber, IsOptional, IsString, IsUUID, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

/**
 * @class RateCardRuleDto
 * @description Data transfer object for a single pricing rule within a rate card.
 */
class RateCardRuleDto {
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

/**
 * @class CreateRateCardDto
 * @description Data transfer object for creating a new rate card.
 */
export class CreateRateCardDto {
  /**
   * The unique identifier of the tenant this rate card belongs to.
   * @type {string}
   * @example 'a1b2c3d4-e5f6-7890-1234-567890abcdef'
   */
  @ApiProperty({ description: 'The unique identifier of the tenant this rate card belongs to.', example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef' })
  @IsUUID()
  tenantId: string;

  /**
   * The unique identifier of the customer this rate card is for.
   * @type {string}
   * @example 'b2c3d4e5-f6a7-8901-2345-67890abcdef1'
   */
  @ApiProperty({ description: 'The unique identifier of the customer this rate card is for.', example: 'b2c3d4e5-f6a7-8901-2345-67890abcdef1' })
  @IsUUID()
  customerId: string;

  /**
   * A descriptive name for the rate card.
   * @type {string}
   * @example 'Standard Storage and Handling Rates 2024'
   */
  @ApiProperty({ description: 'A descriptive name for the rate card.', example: 'Standard Storage and Handling Rates 2024' })
  @IsString()
  name: string;

  /**
   * The currency for the prices in this rate card (e.g., 'USD', 'SAR').
   * @type {string}
   * @example 'USD'
   */
  @ApiProperty({ description: "The currency for the prices in this rate card (e.g., 'USD', 'SAR').", example: 'USD' })
  @IsString()
  currency: string;

  /**
   * The optional date from which this rate card is valid. Defaults to the current date if not provided.
   * @type {string}
   * @example '2024-01-01T00:00:00Z'
   */
  @ApiProperty({ description: 'The optional date from which this rate card is valid. Defaults to now if not provided.', required: false, example: '2024-01-01T00:00:00Z' })
  @IsOptional()
  @IsDateString()
  validFrom?: string;

  /**
   * The optional date until which this rate card is valid. If null, it does not expire.
   * @type {string}
   * @example '2024-12-31T23:59:59Z'
   */
  @ApiProperty({ description: 'The optional date until which this rate card is valid. If null, it does not expire.', required: false, example: '2024-12-31T23:59:59Z' })
  @IsOptional()
  @IsDateString()
  validTo?: string;

  /**
   * A flag indicating whether the rate card is active. Defaults to true.
   * @type {boolean}
   * @example true
   */
  @ApiProperty({ description: 'A flag indicating whether the rate card is active. Defaults to true.', required: false, default: true })
  @IsOptional()
  @IsBoolean()
  active?: boolean;

  /**
   * An optional array of pricing rules to be created with the rate card.
   * @type {RateCardRuleDto[]}
   */
  @ApiProperty({ type: [RateCardRuleDto], description: 'An optional array of pricing rules to be created with the rate card.', required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RateCardRuleDto)
  rules?: RateCardRuleDto[];
}