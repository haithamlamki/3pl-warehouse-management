import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
  Unique,
} from 'typeorm';
import { Customer } from './customer.entity';
import { Item, Lot } from './item.entity';
import { Warehouse, Bin } from './warehouse.entity';

export enum OwnerType {
  CLIENT = 'client',
  COMPANY = 'company',
}

@Entity('inventory')
@Index(['itemSku'])
@Index(['warehouseId', 'binId'])
@Unique(['itemSku', 'ownerType', 'ownerId', 'warehouseId', 'binId', 'lotId'])
export class Inventory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  itemSku: string;

  @Column({
    type: 'enum',
    enum: OwnerType,
  })
  ownerType: OwnerType;

  @Column({ type: 'uuid', nullable: true })
  ownerId: string;

  @Column({ type: 'uuid' })
  warehouseId: string;

  @Column({ type: 'uuid' })
  binId: string;

  @Column({ type: 'uuid', nullable: true })
  lotId: string;

  @Column({ type: 'varchar', nullable: true })
  serialNo: string;

  @Column({ type: 'decimal', precision: 18, scale: 3 })
  qty: number;

  @Column({ type: 'decimal', precision: 18, scale: 3, nullable: true })
  reservedQty: number;

  @Column({ type: 'decimal', precision: 18, scale: 3, nullable: true })
  availableQty: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Item, { nullable: true })
  @JoinColumn({ name: 'itemSku' })
  item: Item;

  @ManyToOne(() => Customer, { nullable: true })
  @JoinColumn({ name: 'ownerId' })
  owner: Customer;

  @ManyToOne(() => Warehouse, { nullable: true })
  @JoinColumn({ name: 'warehouseId' })
  warehouse: Warehouse;

  @ManyToOne(() => Bin, { nullable: true })
  @JoinColumn({ name: 'binId' })
  bin: Bin;

  @ManyToOne(() => Lot, { nullable: true })
  @JoinColumn({ name: 'lotId' })
  lot: Lot;
}
