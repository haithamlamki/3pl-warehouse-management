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
import { Inventory } from './inventory.entity';

@Entity('warehouses')
@Index(['tenantId'])
export class Warehouse {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  tenantId: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'jsonb', nullable: true })
  address: any;

  @Column({ type: 'varchar', nullable: true })
  code: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @OneToMany(() => Bin, (bin) => bin.warehouse, { cascade: true })
  bins: Bin[];

  @OneToMany(() => Inventory, (inventory) => inventory.warehouse)
  inventory: Inventory[];
}

@Entity('bins')
@Unique(['warehouseId', 'code'])
export class Bin {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  warehouseId: string;

  @Column({ type: 'varchar' })
  code: string;

  @Column({ type: 'varchar', default: 'standard' })
  type: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  maxWeight: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  maxVolume: number;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Warehouse, (warehouse) => warehouse.bins, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'warehouseId' })
  warehouse: Warehouse;

  @OneToMany(() => Inventory, (inventory) => inventory.bin)
  inventory: Inventory[];
}
