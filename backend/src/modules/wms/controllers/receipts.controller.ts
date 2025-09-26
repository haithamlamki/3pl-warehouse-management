import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ReceiptsService } from '../services/receipts.service';
import { CreateReceiptDto } from '../dto/create-receipt.dto';
import { CreateCycleCountDto } from '../dto/create-cycle-count.dto';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';

@ApiTags('wms')
@ApiBearerAuth()
@Controller('receipts')
export class ReceiptsController {
  constructor(private readonly receiptsService: ReceiptsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ops')
  @ApiOperation({ summary: 'Post a receipt against ASN or PO' })
  @ApiResponse({ status: 201, description: 'Receipt posted' })
  async postReceipt(@Body() dto: CreateReceiptDto) {
    return this.receiptsService.postReceipt(dto);
  }

  @Post('cycle-count/start')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ops')
  @ApiOperation({ summary: 'Start cycle count for a bin/item' })
  @ApiResponse({ status: 201, description: 'Cycle count started' })
  async startCycleCount(@Body() dto: CreateCycleCountDto) {
    return this.receiptsService.startCycleCount(dto);
  }

  @Post('cycle-count/post')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ops')
  @ApiOperation({ summary: 'Post cycle count differences and adjust inventory' })
  @ApiResponse({ status: 201, description: 'Cycle count posted' })
  async postCycleCount(@Body() dto: CreateCycleCountDto) {
    return this.receiptsService.postCycleCount(dto);
  }
}


