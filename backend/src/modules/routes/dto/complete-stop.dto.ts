import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsString, IsOptional, IsArray, IsNumber } from 'class-validator';

export class CompleteStopDto {
  @ApiProperty({ description: 'Route ID containing the stop' })
  @IsUUID()
  routeId: string;

  @ApiProperty()
  @IsUUID()
  stopId: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  signerName?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  signerId?: string;

  @ApiProperty({ required: false, description: 'Base64 photos' })
  @IsArray()
  @IsOptional()
  photos?: string[];

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  latitude?: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  longitude?: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiProperty({ required: false, description: 'Base64-encoded signature image' })
  @IsString()
  @IsOptional()
  signature?: string;
}


