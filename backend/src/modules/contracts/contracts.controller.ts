import { Body, Controller, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ContractsService } from './contracts.service';
import { CreateContractDto } from './dto/create-contract.dto';
import { SignContractDto } from './dto/sign-contract.dto';

@ApiTags('contracts')
@ApiBearerAuth()
@Controller('contracts')
export class ContractsController {
  constructor(private readonly contractsService: ContractsService) {}

  /** Create contract from template */
  @Post()
  @ApiOperation({ summary: 'Create contract from template' })
  @ApiResponse({ status: 201, description: 'Contract created' })
  async create(@Body() dto: CreateContractDto) {
    return this.contractsService.create(dto);
  }

  /** Sign contract (e-signature) */
  @Post(':id/sign')
  @ApiOperation({ summary: 'Sign contract' })
  @ApiResponse({ status: 200, description: 'Contract signed' })
  async sign(@Param('id') id: string, @Body() dto: SignContractDto) {
    return this.contractsService.sign(id, dto);
  }
}



