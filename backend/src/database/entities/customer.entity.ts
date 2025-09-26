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
} from 'typeorm';
import { RateCard } from './rate-card.entity';
import { Order } from './order.entity';
import { Inventory } from './inventory.entity';

@Entity('customers')
@Index(['tenantId'])
export class Customer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  tenantId: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar', nullable: true })
  taxId: string;

  @Column({ type: 'varchar', nullable: true })
  billingEmail: string;

  @Column({ type: 'varchar', default: 'active' })
  status: string;

  @Column({ type: 'jsonb', nullable: true })
  address: any;

  @Column({ type: 'varchar', nullable: true })
  phone: string;

  @Column({ type: 'varchar', nullable: true })
  contactPerson: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @OneToMany(() => Contract, (contract) => contract.customer)
  contracts: Contract[];

  @OneToMany(() => RateCard, (rateCard) => rateCard.customer)
  rateCards: RateCard[];

  @OneToMany(() => Order, (order) => order.customer)
  orders: Order[];

  @OneToMany(() => Inventory, (inventory) => inventory.owner)
  inventory: Inventory[];
}

@Entity('contracts')
@Index(['customerId'])
export class Contract {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  tenantId: string;

  @Column({ type: 'uuid' })
  customerId: string;

  @Column({ type: 'date' })
  startDate: Date;

  @Column({ type: 'date', nullable: true })
  endDate: Date;

  @Column({ type: 'varchar', default: 'draft' })
  eSignStatus: string;

  @Column({ type: 'jsonb', default: '{}' })
  terms: any;

  @Column({ type: 'varchar', nullable: true })
  contractNumber: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Customer, (customer) => customer.contracts)
  @JoinColumn({ name: 'customerId' })
  customer: Customer;
}
