import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsUUID, IsDateString, IsNumber, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

/**
 * @class CreateRouteDto
 * @description Data transfer object for creating a new delivery route.
 */
export class CreateRouteDto {
  /**
   * A descriptive name for the route.
   * @type {string}
   * @example 'Morning Delivery Route A'
   */
  @ApiProperty({ description: 'A descriptive name for the route.', example: 'Morning Delivery Route A' })
  @IsString()
  name: string;

  /**
   * An optional, more detailed description of the route.
   * @type {string}
   * @example 'Covering the downtown area.'
   */
  @ApiProperty({ description: 'An optional, more detailed description of the route.', required: false, example: 'Covering the downtown area.' })
  @IsOptional()
  @IsString()
  description?: string;

  /**
   * The optional ID of the driver assigned to this route.
   * @type {string}
   * @example 'driver-uuid-123'
   */
  @ApiProperty({ description: 'The optional ID of the driver assigned to this route.', required: false, example: 'driver-uuid-123' })
  @IsOptional()
  @IsString()
  driverId?: string;

  /**
   * The optional ID of the vehicle assigned to this route.
   * @type {string}
   * @example 'vehicle-uuid-456'
   */
  @ApiProperty({ description: 'The optional ID of the vehicle assigned to this route.', required: false, example: 'vehicle-uuid-456' })
  @IsOptional()
  @IsString()
  vehicleId?: string;

  /**
   * The optional planned start time for the route.
   * @type {string}
   * @example '2024-10-28T08:00:00Z'
   */
  @ApiProperty({ description: 'The optional planned start time for the route.', required: false, example: '2024-10-28T08:00:00Z' })
  @IsOptional()
  @IsDateString()
  plannedStartTime?: string;

  /**
   * The optional planned end time for the route.
   * @type {string}
   * @example '2024-10-28T17:00:00Z'
   */
  @ApiProperty({ description: 'The optional planned end time for the route.', required: false, example: '2024-10-28T17:00:00Z' })
  @IsOptional()
  @IsDateString()
  plannedEndTime?: string;

  /**
   * The optional total planned distance for the route in kilometers.
   * @type {number}
   * @example 150.5
   */
  @ApiProperty({ description: 'The optional total planned distance for the route in kilometers.', required: false, example: 150.5 })
  @IsOptional()
  @IsNumber()
  totalDistance?: number;

  /**
   * The unique identifier of the tenant this route belongs to.
   * @type {string}
   * @example 'a1b2c3d4-e5f6-7890-1234-567890abcdef'
   */
  @ApiProperty({ description: 'The unique identifier of the tenant this route belongs to.', example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef' })
  @IsUUID()
  tenantId: string;

  /**
   * An optional array of stops to be created with the route.
   * @type {RouteStopInput[]}
   */
  @ApiProperty({
    required: false,
    type: () => [RouteStopInput],
    description: 'An optional array of stops to be created with the route.',
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RouteStopInput)
  stops?: RouteStopInput[];
}

/**
 * @class RouteStopInput
 * @description Represents a single stop to be created as part of a new route.
 */
export class RouteStopInput {
  /**
   * The unique identifier of the order associated with this stop.
   * @type {string}
   * @example 'order-uuid-123'
   */
  @ApiProperty({ description: 'The unique identifier of the order associated with this stop.', example: 'order-uuid-123' })
  @IsUUID()
  orderId: string;

  /**
   * The sequence number of this stop in the route's itinerary.
   * @type {number}
   * @example 1
   */
  @ApiProperty({ description: "The sequence number of this stop in the route's itinerary.", example: 1 })
  @IsNumber()
  seq: number;
}