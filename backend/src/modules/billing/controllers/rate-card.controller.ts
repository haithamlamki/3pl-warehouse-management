import { Body, Controller, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RateCardService } from '../services/rate-card.service';
import { CreateRateCardDto } from '../dto/create-rate-card.dto';
import { UpdateRateCardDto } from '../dto/update-rate-card.dto';
import { AddRateCardRuleDto } from '../dto/add-rate-card-rule.dto';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';

/**
 * @class RateCardController
 * @description This controller exposes endpoints for managing rate cards and their pricing rules.
 * @tags billing
 */
@ApiTags('billing')
@ApiBearerAuth()
@Controller('rate-cards')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RateCardController {
  /**
   * @constructor
   * @param {RateCardService} rateCardService - Service for rate card-related business logic.
   */
  constructor(private readonly rateCardService: RateCardService) {}

  /**
   * @method create
   * @description Creates a new rate card.
   * @param {CreateRateCardDto} dto - The data needed to create the rate card.
   * @returns {Promise<RateCard>} A promise that resolves to the newly created rate card.
   */
  @Post()
  @ApiOperation({ summary: 'Create a new rate card' })
  @ApiResponse({ status: 201, description: 'Rate card created successfully.' })
  async create(@Body() dto: CreateRateCardDto) {
    return this.rateCardService.create(dto);
  }

  /**
   * @method findAll
   * @description Retrieves a list of rate cards, with optional filtering.
   * @param {string} [customerId] - Optional customer ID to filter rate cards.
   * @param {boolean} [active] - Optional flag to filter by active status.
   * @returns {Promise<RateCard[]>} A promise that resolves to an array of rate cards.
   */
  @Get()
  @ApiOperation({ summary: 'Get a list of rate cards with optional filters' })
  @ApiResponse({ status: 200, description: 'Rate cards retrieved successfully.' })
  async findAll(
    @Query('customerId') customerId?: string,
    @Query('active') active?: boolean,
  ) {
    return this.rateCardService.findAll(customerId, active);
  }

  /**
   * @method findOne
   * @description Retrieves a single rate card by its unique ID.
   * @param {string} id - The unique identifier of the rate card.
   * @returns {Promise<RateCard>} A promise that resolves to the requested rate card.
   */
  @Get(':id')
  @ApiOperation({ summary: 'Get a single rate card by its ID' })
  @ApiResponse({ status: 200, description: 'Rate card retrieved successfully.' })
  @ApiResponse({ status: 404, description: 'Rate card not found.' })
  async findOne(@Param('id') id: string) {
    return this.rateCardService.findOne(id);
  }

  /**
   * @method update
   * @description Updates an existing rate card.
   * @param {string} id - The unique identifier of the rate card to update.
   * @param {UpdateRateCardDto} dto - The data to update the rate card with.
   * @returns {Promise<RateCard>} A promise that resolves to the updated rate card.
   */
  @Put(':id')
  @ApiOperation({ summary: 'Update an existing rate card' })
  @ApiResponse({ status: 200, description: 'Rate card updated successfully.' })
  @ApiResponse({ status: 404, description: 'Rate card not found.' })
  async update(@Param('id') id: string, @Body() dto: UpdateRateCardDto) {
    return this.rateCardService.update(id, dto);
  }

  /**
   * @method addRule
   * @description Adds a new pricing rule to a rate card.
   * @param {string} id - The unique identifier of the rate card.
   * @param {AddRateCardRuleDto} dto - The data for the new pricing rule.
   * @returns {Promise<RateCard>} A promise that resolves to the updated rate card with the new rule.
   */
  @Post(':id/rules')
  @ApiOperation({ summary: 'Add a new pricing rule to a rate card' })
  @ApiResponse({ status: 201, description: 'Rule added successfully.' })
  @ApiResponse({ status: 404, description: 'Rate card not found.' })
  async addRule(@Param('id') id: string, @Body() dto: AddRateCardRuleDto) {
    return this.rateCardService.addRule(id, dto);
  }

  /**
   * @method testPricing
   * @description Tests a pricing calculation using a specific rate card.
   * @param {string} id - The unique identifier of the rate card to use for testing.
   * @param {string} serviceType - The service type to test.
   * @param {number} qty - The quantity to test.
   * @param {string} uom - The unit of measure to test.
   * @returns {Promise<object>} A promise that resolves to the detailed pricing calculation result.
   */
  @Get(':id/test-pricing')
  @ApiOperation({ summary: 'Test a pricing calculation using a rate card' })
  @ApiResponse({ status: 200, description: 'Pricing calculated successfully.' })
  @ApiResponse({ status: 404, description: 'Rate card not found.' })
  async testPricing(
    @Param('id') id: string,
    @Query('serviceType') serviceType: string,
    @Query('qty') qty: number,
    @Query('uom') uom: string,
  ) {
    return this.rateCardService.testPricing(id, serviceType, qty, uom);
  }
}