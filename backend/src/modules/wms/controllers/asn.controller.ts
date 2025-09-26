import { Body, Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AsnService } from '../services/asn.service';
import { CreateAsnDto } from '../dto/create-asn.dto';

@ApiTags('wms')
@ApiBearerAuth()
@Controller('asn')
export class AsnController {
  constructor(private readonly asnService: AsnService) {}

  @Post()
  @ApiOperation({ summary: 'Create ASN (advance shipment notice)' })
  @ApiResponse({ status: 201, description: 'ASN created' })
  async create(@Body() dto: CreateAsnDto) {
    return this.asnService.create(dto);
  }
}


