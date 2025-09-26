import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsString, IsOptional, IsArray, IsNumber } from 'class-validator';

/**
 * @class CompleteStopDto
 * @description Data transfer object for completing a route stop and providing proof of delivery.
 */
export class CompleteStopDto {
  /**
   * The unique identifier of the route this stop belongs to.
   * @type {string}
   * @example 'a1b2c3d4-e5f6-7890-1234-567890abcdef'
   */
  @ApiProperty({ description: 'The unique identifier of the route this stop belongs to.' })
  @IsUUID()
  routeId: string;

  /**
   * The unique identifier of the stop being completed.
   * @type {string}
   * @example 'b2c3d4e5-f6a7-8901-2345-67890abcdef1'
   */
  @ApiProperty({ description: 'The unique identifier of the stop being completed.' })
  @IsUUID()
  stopId: string;

  /**
   * The optional name of the person who signed for the delivery.
   * @type {string}
   * @example 'John Doe'
   */
  @ApiProperty({ description: 'The optional name of the person who signed for the delivery.', required: false, example: 'John Doe' })
  @IsString()
  @IsOptional()
  signerName?: string;

  /**
   * The optional ID or identification number of the signer.
   * @type {string}
   * @example 'ID12345'
   */
  @ApiProperty({ description: 'The optional ID or identification number of the signer.', required: false, example: 'ID12345' })
  @IsString()
  @IsOptional()
  signerId?: string;

  /**
   * An optional array of Base64-encoded photo strings as proof of delivery.
   * @type {string[]}
   */
  @ApiProperty({ description: 'An optional array of Base64-encoded photo strings as proof of delivery.', required: false, type: [String] })
  @IsArray()
  @IsOptional()
  photos?: string[];

  /**
   * The optional latitude coordinate where the stop was completed.
   * @type {number}
   * @example 34.0522
   */
  @ApiProperty({ description: 'The optional latitude coordinate where the stop was completed.', required: false, example: 34.0522 })
  @IsNumber()
  @IsOptional()
  latitude?: number;

  /**
   * The optional longitude coordinate where the stop was completed.
   * @type {number}
   * @example -118.2437
   */
  @ApiProperty({ description: 'The optional longitude coordinate where the stop was completed.', required: false, example: -118.2437 })
  @IsNumber()
  @IsOptional()
  longitude?: number;

  /**
   * Optional notes or comments from the driver about the stop.
   * @type {string}
   * @example 'Customer requested to leave package at the front door.'
   */
  @ApiProperty({ description: 'Optional notes or comments from the driver about the stop.', required: false, example: 'Customer requested to leave package at the front door.' })
  @IsString()
  @IsOptional()
  notes?: string;

  /**
   * An optional Base64-encoded signature image.
   * @type {string}
   */
  @ApiProperty({ description: 'An optional Base64-encoded signature image.', required: false })
  @IsString()
  @IsOptional()
  signature?: string;
}