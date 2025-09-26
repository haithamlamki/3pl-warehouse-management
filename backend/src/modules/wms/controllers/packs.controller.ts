import { Body, Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PacksService } from '../services/packs.service';
import { PackDto } from '../dto/pack.dto';

@ApiTags('wms')
@ApiBearerAuth()
@Controller('packs')
export class PacksController {
  constructor(private readonly packsService: PacksService) {}

  @Post()
  @ApiOperation({ summary: 'Confirm packing of picked items' })
  @ApiResponse({ status: 201, description: 'Pack confirmed' })
  async pack(@Body() dto: PackDto) {
    return this.packsService.pack(dto);
  }
}


