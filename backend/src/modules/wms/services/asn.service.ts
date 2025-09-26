import { Injectable } from '@nestjs/common';
import { CreateAsnDto } from '../dto/create-asn.dto';

@Injectable()
export class AsnService {
  async create(dto: CreateAsnDto) {
    // Stub: Save ASN header/lines, return ASN ID
    return { id: 'asn_' + Date.now(), ...dto };
  }
}


