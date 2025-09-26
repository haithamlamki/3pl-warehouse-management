import {
  Entity,
  PrimaryColumn,
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
import { Inventory } from './inventory.entity';

@Entity('items')
@Index(['tenantId'])
export class Item {
  @PrimaryColumn({ type: 'varchar' })
  sku: string;

  @Column({ type: 'uuid' })
  tenantId: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar' })
  uom: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  lengthCm: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  widthCm: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  heightCm: number;

  @Column({ type: 'decimal', precision: 10, scale: 3, nullable: true })
  weightKg: number;

  @Column({ type: 'boolean', default: false })
  lotTracked: boolean;

  @Column({ type: 'boolean', default: false })
  serialTracked: boolean;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', nullable: true })
  category: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @OneToMany(() => Inventory, (inventory) => inventory.item)
  inventory: Inventory[];

  @OneToMany(() => Lot, (lot) => lot.item)
  lots: Lot[];
}

@Entity('lots')
@Unique(['itemSku', 'lotCode'])
export class Lot {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  itemSku: string;

  @Column({ type: 'varchar' })
  lotCode: string;

  @Column({ type: 'date', nullable: true })
  expiryDate: Date;

  @Column({ type: 'date', nullable: true })
  manufactureDate: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Item, (item) => item.lots, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'itemSku' })
  item: Item;

  @OneToMany(() => Inventory, (inventory) => inventory.lot)
  inventory: Inventory[];
}
