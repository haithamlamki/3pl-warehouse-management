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
import { Customer } from './customer.entity';

@Entity('rate_cards')
@Index(['customerId'])
export class RateCard {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  tenantId: string;

  @Column({ type: 'uuid' })
  customerId: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar' })
  currency: string;

  @Column({ type: 'boolean', default: true })
  active: boolean;

  @Column({ type: 'date', nullable: true })
  validFrom: Date;

  @Column({ type: 'date', nullable: true })
  validTo: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Customer, (customer) => customer.rateCards)
  @JoinColumn({ name: 'customerId' })
  customer: Customer;

  @OneToMany(() => RateCardRule, (rule) => rule.rateCard, { cascade: true })
  rules: RateCardRule[];
}

@Entity('rate_card_rules')
export class RateCardRule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  rateCardId: string;

  @Column({ type: 'varchar' })
  serviceType: string; // storage, receipt, handling, picking, delivery, special

  @Column({ type: 'varchar' })
  uom: string; // pallet, m3, kg, unit

  @Column({ type: 'decimal', precision: 18, scale: 3, default: 0 })
  tierFrom: number;

  @Column({ type: 'decimal', precision: 18, scale: 3, nullable: true })
  tierTo: number;

  @Column({ type: 'decimal', precision: 18, scale: 3 })
  price: number;

  @Column({ type: 'decimal', precision: 18, scale: 3, nullable: true })
  minFee: number;

  @Column({ type: 'boolean', default: true })
  active: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => RateCard, (rateCard) => rateCard.rules, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'rateCardId' })
  rateCard: RateCard;
}
