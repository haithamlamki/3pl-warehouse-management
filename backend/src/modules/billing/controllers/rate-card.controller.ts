import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RateCardService } from '../services/rate-card.service';
import { CreateRateCardDto } from '../dto/create-rate-card.dto';
import { UpdateRateCardDto } from '../dto/update-rate-card.dto';
import { AddRateCardRuleDto } from '../dto/add-rate-card-rule.dto';

@ApiTags('billing')
@ApiBearerAuth()
@Controller('rate-cards')
export class RateCardController {
  constructor(private readonly rateCardService: RateCardService) {}

  @Post()
  @ApiOperation({ summary: 'Create rate card' })
  @ApiResponse({ status: 201, description: 'Rate card created' })
  async create(@Body() dto: CreateRateCardDto) {
    return this.rateCardService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get rate cards' })
  @ApiResponse({ status: 200, description: 'Rate cards retrieved' })
  async findAll(
    @Query('customerId') customerId?: string,
    @Query('active') active?: boolean,
  ) {
    return this.rateCardService.findAll(customerId, active);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get rate card by ID' })
  @ApiResponse({ status: 200, description: 'Rate card retrieved' })
  async findOne(@Param('id') id: string) {
    return this.rateCardService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update rate card' })
  @ApiResponse({ status: 200, description: 'Rate card updated' })
  async update(@Param('id') id: string, @Body() dto: UpdateRateCardDto) {
    return this.rateCardService.update(id, dto);
  }

  @Post(':id/rules')
  @ApiOperation({ summary: 'Add rate card rule' })
  @ApiResponse({ status: 201, description: 'Rule added' })
  async addRule(@Param('id') id: string, @Body() dto: AddRateCardRuleDto) {
    return this.rateCardService.addRule(id, dto);
  }

  @Get(':id/test-pricing')
  @ApiOperation({ summary: 'Test pricing calculation' })
  @ApiResponse({ status: 200, description: 'Pricing calculated' })
  async testPricing(
    @Param('id') id: string,
    @Query('serviceType') serviceType: string,
    @Query('qty') qty: number,
    @Query('uom') uom: string,
  ) {
    return this.rateCardService.testPricing(id, serviceType, qty, uom);
  }
}
