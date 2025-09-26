import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';

export class GenerateInvoiceDto {
  @ApiProperty()
  @IsUUID()
  tenantId: string;

  @ApiProperty()
  @IsUUID()
  customerId: string;

  @ApiProperty({ example: '2025-01-01' })
  @IsDateString()
  periodFrom: string;

  @ApiProperty({ example: '2025-01-31' })
  @IsDateString()
  periodTo: string;

  @ApiProperty({ example: 'USD', required: false })
  @IsOptional()
  @IsString()
  currency?: string;

  @ApiProperty({ example: 15, required: false })
  @IsOptional()
  @IsNumber()
  taxRate?: number;
}
