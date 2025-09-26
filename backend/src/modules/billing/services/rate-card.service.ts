import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RateCard, RateCardRule } from '../../../database/entities/rate-card.entity';
import { CreateRateCardDto } from '../dto/create-rate-card.dto';
import { UpdateRateCardDto } from '../dto/update-rate-card.dto';
import { AddRateCardRuleDto } from '../dto/add-rate-card-rule.dto';
import { PricingEngineService } from './pricing-engine.service';

/**
 * @class RateCardService
 * @description This service manages all operations related to rate cards and their associated pricing rules.
 */
@Injectable()
export class RateCardService {
  /**
   * @constructor
   * @param {Repository<RateCard>} rateCardRepo - Repository for RateCard entities.
   * @param {Repository<RateCardRule>} rateCardRuleRepo - Repository for RateCardRule entities.
   * @param {PricingEngineService} pricingEngine - Service for performing pricing calculations.
   */
  constructor(
    @InjectRepository(RateCard)
    private readonly rateCardRepo: Repository<RateCard>,
    @InjectRepository(RateCardRule)
    private readonly rateCardRuleRepo: Repository<RateCardRule>,
    private readonly pricingEngine: PricingEngineService,
  ) {}

  /**
   * @method create
   * @description Creates a new rate card and, optionally, its associated pricing rules.
   * @param {CreateRateCardDto} dto - The data transfer object containing the details for the new rate card.
   * @returns {Promise<RateCard>} A promise that resolves to the newly created RateCard entity, including its rules.
   */
  async create(dto: CreateRateCardDto): Promise<RateCard> {
    const rateCard = this.rateCardRepo.create({
      tenantId: dto.tenantId,
      customerId: dto.customerId,
      name: dto.name,
      currency: dto.currency,
      validFrom: dto.validFrom ? new Date(dto.validFrom) : new Date(),
      validTo: dto.validTo ? new Date(dto.validTo) : null,
      active: dto.active ?? true,
    });

    const savedRateCard = await this.rateCardRepo.save(rateCard);

    // Add rules if provided
    if (dto.rules && dto.rules.length > 0) {
      const rules = dto.rules.map((rule) =>
        this.rateCardRuleRepo.create({
          rateCardId: savedRateCard.id,
          serviceType: rule.serviceType,
          uom: rule.uom,
          tierFrom: rule.tierFrom,
          tierTo: rule.tierTo,
          price: rule.price,
          minFee: rule.minFee,
        }),
      );

      await this.rateCardRuleRepo.save(rules);
    }

    return this.findOne(savedRateCard.id);
  }

  /**
   * @method findAll
   * @description Retrieves a list of rate cards, with optional filtering.
   * @param {string} [customerId] - Optional ID of the customer to filter by.
   * @param {boolean} [active] - Optional flag to filter by active status.
   * @returns {Promise<RateCard[]>} A promise that resolves to an array of RateCard entities.
   */
  async findAll(customerId?: string, active?: boolean): Promise<RateCard[]> {
    const query = this.rateCardRepo
      .createQueryBuilder('rateCard')
      .leftJoinAndSelect('rateCard.rules', 'rules')
      .orderBy('rateCard.createdAt', 'DESC');

    if (customerId) {
      query.andWhere('rateCard.customerId = :customerId', { customerId });
    }

    if (active !== undefined) {
      query.andWhere('rateCard.active = :active', { active });
    }

    return query.getMany();
  }

  /**
   * @method findOne
   * @description Finds a single rate card by its unique ID, including its rules.
   * @param {string} id - The unique identifier of the rate card.
   * @returns {Promise<RateCard>} A promise that resolves to the RateCard entity.
   * @throws {NotFoundException} If no rate card is found with the given ID.
   */
  async findOne(id: string): Promise<RateCard> {
    const rateCard = await this.rateCardRepo.findOne({
      where: { id },
      relations: ['rules'],
    });

    if (!rateCard) {
      throw new NotFoundException('Rate card not found');
    }

    return rateCard;
  }

  /**
   * @method update
   * @description Updates the details of an existing rate card.
   * @param {string} id - The unique identifier of the rate card to update.
   * @param {UpdateRateCardDto} dto - The data transfer object containing the updated fields.
   * @returns {Promise<RateCard>} A promise that resolves to the updated RateCard entity.
   */
  async update(id: string, dto: UpdateRateCardDto): Promise<RateCard> {
    const rateCard = await this.findOne(id);

    Object.assign(rateCard, {
      name: dto.name,
      currency: dto.currency,
      validFrom: dto.validFrom ? new Date(dto.validFrom) : rateCard.validFrom,
      validTo: dto.validTo ? new Date(dto.validTo) : rateCard.validTo,
      active: dto.active,
    });

    await this.rateCardRepo.save(rateCard);
    return this.findOne(id);
  }

  /**
   * @method addRule
   * @description Adds a new pricing rule to an existing rate card.
   * @param {string} id - The unique identifier of the rate card to add the rule to.
   * @param {AddRateCardRuleDto} dto - The data transfer object containing the details of the new rule.
   * @returns {Promise<RateCard>} A promise that resolves to the updated RateCard entity with the new rule.
   */
  async addRule(id: string, dto: AddRateCardRuleDto): Promise<RateCard> {
    const rateCard = await this.findOne(id);

    const rule = this.rateCardRuleRepo.create({
      rateCardId: id,
      serviceType: dto.serviceType,
      uom: dto.uom,
      tierFrom: dto.tierFrom,
      tierTo: dto.tierTo,
      price: dto.price,
      minFee: dto.minFee,
    });

    await this.rateCardRuleRepo.save(rule);
    return this.findOne(id);
  }

  /**
   * @method testPricing
   * @description Tests the pricing engine with a specific rate card and a set of parameters.
   * @param {string} id - The unique identifier of the rate card to test.
   * @param {string} serviceType - The service type to test.
   * @param {number} qty - The quantity to test.
   * @param {string} uom - The unit of measure to test.
   * @returns {Promise<object>} A promise that resolves to an object containing the rate card info, input parameters, and the detailed pricing calculation result.
   */
  async testPricing(
    id: string,
    serviceType: string,
    qty: number,
    uom: string,
  ) {
    const rateCard = await this.findOne(id);
    
    const result = await this.pricingEngine.calculatePrice(
      rateCard,
      serviceType,
      qty,
      uom,
    );

    return {
      rateCard: {
        id: rateCard.id,
        name: rateCard.name,
        currency: rateCard.currency,
      },
      input: {
        serviceType,
        qty,
        uom,
      },
      calculation: result,
    };
  }
}