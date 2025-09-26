import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';

/**
 * @class GenerateInvoiceDto
 * @description Data transfer object for generating a new invoice from unbilled transactions.
 */
export class GenerateInvoiceDto {
  /**
   * The unique identifier of the tenant this invoice belongs to.
   * @type {string}
   * @example 'a1b2c3d4-e5f6-7890-1234-567890abcdef'
   */
  @ApiProperty({ description: 'The unique identifier of the tenant this invoice belongs to.', example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef' })
  @IsUUID()
  tenantId: string;

  /**
   * The unique identifier of the customer this invoice is for.
   * @type {string}
   * @example 'b2c3d4e5-f6a7-8901-2345-67890abcdef1'
   */
  @ApiProperty({ description: 'The unique identifier of the customer this invoice is for.', example: 'b2c3d4e5-f6a7-8901-2345-67890abcdef1' })
  @IsUUID()
  customerId: string;

  /**
   * The start date of the billing period.
   * @type {string}
   * @example '2025-01-01'
   */
  @ApiProperty({ description: 'The start date of the billing period.', example: '2025-01-01' })
  @IsDateString()
  periodFrom: string;

  /**
   * The end date of the billing period.
   * @type {string}
   * @example '2025-01-31'
   */
  @ApiProperty({ description: 'The end date of the billing period.', example: '2025-01-31' })
  @IsDateString()
  periodTo: string;

  /**
   * The optional currency for the invoice. Defaults to 'USD' if not provided.
   * @type {string}
   * @example 'USD'
   */
  @ApiProperty({ description: "The optional currency for the invoice. Defaults to 'USD' if not provided.", example: 'USD', required: false })
  @IsOptional()
  @IsString()
  currency?: string;

  /**
   * The optional tax rate to apply to the invoice total, as a percentage.
   * @type {number}
   * @example 15
   */
  @ApiProperty({ description: 'The optional tax rate to apply to the invoice total, as a percentage.', example: 15, required: false })
  @IsOptional()
  @IsNumber()
  taxRate?: number;
}