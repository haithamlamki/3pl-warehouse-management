import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RateCard, RateCardRule } from '../../database/entities/rate-card.entity';
import { CreateRateCardDto } from '../dto/create-rate-card.dto';
import { UpdateRateCardDto } from '../dto/update-rate-card.dto';
import { AddRateCardRuleDto } from '../dto/add-rate-card-rule.dto';
import { PricingEngineService } from './pricing-engine.service';

@Injectable()
export class RateCardService {
  constructor(
    @InjectRepository(RateCard)
    private readonly rateCardRepo: Repository<RateCard>,
    @InjectRepository(RateCardRule)
    private readonly rateCardRuleRepo: Repository<RateCardRule>,
    private readonly pricingEngine: PricingEngineService,
  ) {}

  /**
   * Create rate card
   * @param dto Create rate card DTO
   * @returns Created rate card
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
   * Find all rate cards
   * @param customerId Customer ID filter
   * @param active Active status filter
   * @returns Rate cards
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
   * Find rate card by ID
   * @param id Rate card ID
   * @returns Rate card
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
   * Update rate card
   * @param id Rate card ID
   * @param dto Update DTO
   * @returns Updated rate card
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
   * Add rule to rate card
   * @param id Rate card ID
   * @param dto Add rule DTO
   * @returns Updated rate card
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
   * Test pricing calculation
   * @param id Rate card ID
   * @param serviceType Service type
   * @param qty Quantity
   * @param uom Unit of measure
   * @returns Pricing calculation result
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
