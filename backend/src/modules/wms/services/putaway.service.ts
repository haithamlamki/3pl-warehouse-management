import { Injectable } from '@nestjs/common';
import { PutawayDto } from '../dto/putaway.dto';

@Injectable()
export class PutawayService {
  async execute(dto: PutawayDto) {
    // Stub: Allocate bins based on simple rules
    return { success: true, moves: dto.moves };
  }
}


