import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsUUID, IsDateString, IsNumber, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateRouteDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  driverId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  vehicleId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  plannedStartTime?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  plannedEndTime?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  totalDistance?: number;

  @ApiProperty()
  @IsUUID()
  tenantId: string;

  @ApiProperty({
    required: false,
    type: [Object],
    description: 'Optional planned stops with order linkage',
    example: [
      { orderId: 'uuid-order-1', seq: 1 },
      { orderId: 'uuid-order-2', seq: 2 },
    ],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RouteStopInput)
  stops?: RouteStopInput[];
}

export class RouteStopInput {
  @ApiProperty()
  @IsUUID()
  orderId: string;

  @ApiProperty()
  @IsNumber()
  seq: number;
}
