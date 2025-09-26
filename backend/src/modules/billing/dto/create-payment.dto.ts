import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';

/**
 * @class CreatePaymentDto
 * @description Data transfer object for creating a new payment.
 */
export class CreatePaymentDto {
  /**
   * The unique identifier of the invoice this payment is for.
   * @type {string}
   * @example 'a1b2c3d4-e5f6-7890-1234-567890abcdef'
   */
  @ApiProperty({ description: 'The unique identifier of the invoice this payment is for.', example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef' })
  @IsUUID()
  invoiceId: string;

  /**
   * The method of payment used (e.g., 'credit_card', 'bank_transfer').
   * @type {string}
   * @example 'credit_card'
   */
  @ApiProperty({ description: "The method of payment used (e.g., 'credit_card', 'bank_transfer').", example: 'credit_card' })
  @IsString()
  method: string;

  /**
   * The amount of the payment.
   * @type {number}
   * @example 100.50
   */
  @ApiProperty({ description: 'The amount of the payment.', example: 100.50 })
  @IsNumber()
  amount: number;

  /**
   * An optional reference number for the transaction (e.g., a bank transaction ID).
   * @type {string}
   * @example 'TXN123456789'
   */
  @ApiProperty({ description: 'An optional reference number for the transaction (e.g., a bank transaction ID).', example: 'TXN123456789', required: false })
  @IsOptional()
  @IsString()
  reference?: string;

  /**
   * Optional notes or comments about the payment.
   * @type {string}
   * @example 'Monthly subscription payment.'
   */
  @ApiProperty({ description: 'Optional notes or comments about the payment.', required: false, example: 'Monthly subscription payment.' })
  @IsOptional()
  @IsString()
  notes?: string;

  /**
   * The optional date and time when the payment was made. If not provided, the current time will be used.
   * @type {string}
   * @example '2023-10-27T10:00:00Z'
   */
  @ApiProperty({ description: 'The optional date and time when the payment was made. Defaults to now if not provided.', required: false, example: '2023-10-27T10:00:00Z' })
  @IsOptional()
  @IsDateString()
  paidAt?: string;
}