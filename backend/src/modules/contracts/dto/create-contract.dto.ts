import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateContractDto {
  @ApiProperty({ description: 'Tenant ID' })
  @IsUUID()
  tenantId: string;

  @ApiProperty({ description: 'Customer ID' })
  @IsUUID()
  customerId: string;

  @ApiProperty({ description: 'Contract start date', example: '2025-01-01' })
  @IsDateString()
  startDate: string;

  @ApiProperty({ description: 'Contract end date', required: false })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiProperty({ description: 'Contract number', required: false })
  @IsOptional()
  @IsString()
  contractNumber?: string;

  @ApiProperty({ description: 'Terms JSON', required: false, type: Object })
  @IsOptional()
  terms?: Record<string, unknown>;
}



