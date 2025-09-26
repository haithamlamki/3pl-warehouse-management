import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsDateString, IsNumber } from 'class-validator';

export class UpdateRouteDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  name?: string;

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

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  status?: string;
}
