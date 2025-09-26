import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contract } from '../../database/entities/customer.entity';
import { CreateContractDto } from './dto/create-contract.dto';
import { SignContractDto } from './dto/sign-contract.dto';

@Injectable()
export class ContractsService {
  constructor(
    @InjectRepository(Contract)
    private readonly contractRepo: Repository<Contract>,
  ) {}

  /**
   * Create a contract from a template payload.
   * @param dto CreateContractDto
   */
  async create(dto: CreateContractDto): Promise<Contract> {
    const contract = this.contractRepo.create({
      tenantId: dto.tenantId,
      customerId: dto.customerId,
      startDate: dto.startDate,
      endDate: dto.endDate ?? null,
      eSignStatus: 'draft',
      terms: dto.terms ?? {},
      contractNumber: dto.contractNumber ?? null,
    });

    return this.contractRepo.save(contract);
  }

  /**
   * Apply e-signature details and mark as signed.
   * @param id Contract ID
   * @param dto SignContractDto
   */
  async sign(id: string, dto: SignContractDto): Promise<Contract> {
    const contract = await this.contractRepo.findOne({ where: { id } });
    if (!contract) {
      throw new NotFoundException('Contract not found');
    }

    const updatedTerms = {
      ...((contract.terms as any) ?? {}),
      eSign: {
        signerName: dto.signerName,
        signerId: dto.signerId ?? null,
        signedAt: new Date().toISOString(),
        ip: dto.ip ?? null,
        userAgent: dto.userAgent ?? null,
      },
    };

    contract.eSignStatus = 'signed';
    contract.terms = updatedTerms as any;
    return this.contractRepo.save(contract);
  }
}



