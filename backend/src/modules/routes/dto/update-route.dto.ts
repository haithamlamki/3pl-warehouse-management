import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsDateString, IsNumber } from 'class-validator';

/**
 * @class UpdateRouteDto
 * @description Data transfer object for updating an existing delivery route. All fields are optional.
 */
export class UpdateRouteDto {
  /**
   * A new descriptive name for the route.
   * @type {string}
   * @example 'Afternoon Delivery Route B'
   */
  @ApiProperty({ description: 'A new descriptive name for the route.', required: false, example: 'Afternoon Delivery Route B' })
  @IsOptional()
  @IsString()
  name?: string;

  /**
   * A new, more detailed description of the route.
   * @type {string}
   * @example 'Covering the northern suburbs.'
   */
  @ApiProperty({ description: 'A new, more detailed description of the route.', required: false, example: 'Covering the northern suburbs.' })
  @IsOptional()
  @IsString()
  description?: string;

  /**
   * The new ID of the driver assigned to this route.
   * @type {string}
   * @example 'driver-uuid-789'
   */
  @ApiProperty({ description: 'The new ID of the driver assigned to this route.', required: false, example: 'driver-uuid-789' })
  @IsOptional()
  @IsString()
  driverId?: string;

  /**
   * The new ID of the vehicle assigned to this route.
   * @type {string}
   * @example 'vehicle-uuid-101'
   */
  @ApiProperty({ description: 'The new ID of the vehicle assigned to this route.', required: false, example: 'vehicle-uuid-101' })
  @IsOptional()
  @IsString()
  vehicleId?: string;

  /**
   * The new planned start time for the route.
   * @type {string}
   * @example '2024-10-28T13:00:00Z'
   */
  @ApiProperty({ description: 'The new planned start time for the route.', required: false, example: '2024-10-28T13:00:00Z' })
  @IsOptional()
  @IsDateString()
  plannedStartTime?: string;

  /**
   * The new planned end time for the route.
   * @type {string}
   * @example '2024-10-28T21:00:00Z'
   */
  @ApiProperty({ description: 'The new planned end time for the route.', required: false, example: '2024-10-28T21:00:00Z' })
  @IsOptional()
  @IsDateString()
  plannedEndTime?: string;

  /**
   * The new total planned distance for the route in kilometers.
   * @type {number}
   * @example 120.0
   */
  @ApiProperty({ description: 'The new total planned distance for the route in kilometers.', required: false, example: 120.0 })
  @IsOptional()
  @IsNumber()
  totalDistance?: number;

  /**
   * The new status of the route (e.g., 'IN_TRANSIT', 'COMPLETED').
   * @type {string}
   * @example 'IN_TRANSIT'
   */
  @ApiProperty({ description: "The new status of the route (e.g., 'IN_TRANSIT', 'COMPLETED').", required: false, example: 'IN_TRANSIT' })
  @IsOptional()
  @IsString()
  status?: string;
}