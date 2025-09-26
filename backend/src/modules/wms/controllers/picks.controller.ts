import { Body, Controller, Post, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PicksService } from '../services/picks.service';
import { CreateWaveDto } from '../dto/create-wave.dto';
import { CompleteWaveDto } from '../dto/complete-wave.dto';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';

@ApiTags('wms')
@ApiBearerAuth()
@Controller('picks')
export class PicksController {
  constructor(private readonly picksService: PicksService) {}

  @Post('waves')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ops', 'admin')
  @ApiOperation({ summary: 'Create picking wave' })
  @ApiResponse({ status: 201, description: 'Wave created' })
  async createWave(@Body() dto: CreateWaveDto) {
    return this.picksService.createWave(dto);
  }

  @Post('waves/complete')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ops', 'admin')
  @ApiOperation({ summary: 'Complete picking wave and mark orders PACKED' })
  @ApiResponse({ status: 200, description: 'Wave completed' })
  async completeWave(@Body() dto: CompleteWaveDto) {
    return this.picksService.completeWave(dto);
  }

  @Post('fulfill/:orderId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ops', 'admin')
  @ApiOperation({ summary: 'Fulfill order - reduce inventory and mark OUT_FOR_DELIVERY' })
  @ApiResponse({ status: 200, description: 'Order fulfilled' })
  async fulfillOrder(@Param('orderId') orderId: string) {
    await this.picksService.fulfillOrder(orderId);
    return { orderId, status: 'OUT_FOR_DELIVERY', message: 'Order fulfilled successfully' };
  }
}


