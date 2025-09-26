import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDateString, IsOptional, IsString } from 'class-validator';

/**
 * @class UpdateRateCardDto
 * @description Data transfer object for updating an existing rate card. All fields are optional.
 */
export class UpdateRateCardDto {
  /**
   * A new descriptive name for the rate card.
   * @type {string}
   * @example 'Updated Standard Rates 2024'
   */
  @ApiProperty({ description: 'A new descriptive name for the rate card.', required: false, example: 'Updated Standard Rates 2024' })
  @IsOptional()
  @IsString()
  name?: string;

  /**
   * The new currency for the prices in this rate card (e.g., 'USD', 'SAR').
   * @type {string}
   * @example 'SAR'
   */
  @ApiProperty({ description: "The new currency for the prices in this rate card (e.g., 'USD', 'SAR').", required: false, example: 'SAR' })
  @IsOptional()
  @IsString()
  currency?: string;

  /**
   * The new date from which this rate card is valid.
   * @type {string}
   * @example '2024-02-01T00:00:00Z'
   */
  @ApiProperty({ description: 'The new date from which this rate card is valid.', required: false, example: '2024-02-01T00:00:00Z' })
  @IsOptional()
  @IsDateString()
  validFrom?: string;

  /**
   * The new date until which this rate card is valid. If null, it does not expire.
   * @type {string}
   * @example '2025-12-31T23:59:59Z'
   */
  @ApiProperty({ description: 'The new date until which this rate card is valid. If null, it does not expire.', required: false, example: '2025-12-31T23:59:59Z' })
  @IsOptional()
  @IsDateString()
  validTo?: string;

  /**
   * A new flag indicating whether the rate card is active.
   * @type {boolean}
   * @example false
   */
  @ApiProperty({ description: 'A new flag indicating whether the rate card is active.', required: false, example: false })
  @IsOptional()
  @IsBoolean()
  active?: boolean;
}