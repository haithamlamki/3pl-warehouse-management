import { Repository } from 'typeorm';
import { Contract } from '../../database/entities/customer.entity';
import { CreateContractDto } from './dto/create-contract.dto';
import { SignContractDto } from './dto/sign-contract.dto';
export declare class ContractsService {
    private readonly contractRepo;
    constructor(contractRepo: Repository<Contract>);
    create(dto: CreateContractDto): Promise<Contract>;
    sign(id: string, dto: SignContractDto): Promise<Contract>;
}
