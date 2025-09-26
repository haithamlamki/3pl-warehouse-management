import { Body, Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PutawayService } from '../services/putaway.service';
import { PutawayDto } from '../dto/putaway.dto';

@ApiTags('wms')
@ApiBearerAuth()
@Controller('putaway')
export class PutawayController {
  constructor(private readonly putawayService: PutawayService) {}

  @Post()
  @ApiOperation({ summary: 'Execute putaway according to rules' })
  @ApiResponse({ status: 201, description: 'Putaway executed' })
  async execute(@Body() dto: PutawayDto) {
    return this.putawayService.execute(dto);
  }
}


