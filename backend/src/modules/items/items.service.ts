import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Item } from '../../database/entities/item.entity';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';

@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>,
  ) {}

  async create(createItemDto: CreateItemDto): Promise<Item> {
    const item = this.itemRepository.create(createItemDto);
    return this.itemRepository.save(item);
  }

  async findAll(): Promise<Item[]> {
    return this.itemRepository.find();
  }

  async findOne(sku: string): Promise<Item> {
    const item = await this.itemRepository.findOne({ where: { sku } });

    if (!item) {
      throw new NotFoundException('Item not found');
    }

    return item;
  }

  async update(sku: string, updateItemDto: UpdateItemDto): Promise<Item> {
    const item = await this.findOne(sku);
    Object.assign(item, updateItemDto);
    return this.itemRepository.save(item);
  }

  async remove(sku: string): Promise<void> {
    const item = await this.findOne(sku);
    await this.itemRepository.remove(item);
  }
}