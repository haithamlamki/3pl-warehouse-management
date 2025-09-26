import { Injectable } from '@nestjs/common';
import { PackDto } from '../dto/pack.dto';

@Injectable()
export class PacksService {
  async pack(dto: PackDto) {
    // Stub: Confirm packed quantities and close picks
    return { packId: 'pack_' + Date.now(), ...dto };
  }
}


