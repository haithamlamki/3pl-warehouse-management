import { ContractsService } from './contracts.service';
import { CreateContractDto } from './dto/create-contract.dto';
import { SignContractDto } from './dto/sign-contract.dto';
export declare class ContractsController {
    private readonly contractsService;
    constructor(contractsService: ContractsService);
    create(dto: CreateContractDto): Promise<import("../../database/entities").Contract>;
    sign(id: string, dto: SignContractDto): Promise<import("../../database/entities").Contract>;
}
