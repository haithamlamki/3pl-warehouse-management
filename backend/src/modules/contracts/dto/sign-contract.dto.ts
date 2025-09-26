import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class SignContractDto {
  @ApiProperty({ description: 'Signer full name' })
  @IsString()
  signerName: string;

  @ApiProperty({ description: 'Signer ID (national/company id)', required: false })
  @IsOptional()
  @IsString()
  signerId?: string;

  @ApiProperty({ description: 'Request IP address', required: false })
  @IsOptional()
  @IsString()
  ip?: string;

  @ApiProperty({ description: 'Request user agent', required: false })
  @IsOptional()
  @IsString()
  userAgent?: string;
}



