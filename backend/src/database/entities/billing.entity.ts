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

@Entity('unbilled_txns')
@Index(['customerId', 'ts'])
@Index(['tenantId'])
export class UnbilledTxn {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  tenantId: string;

  @Column({ type: 'uuid' })
  customerId: string;

  @Column({ type: 'varchar' })
  refType: string; // order, storage, special

  @Column({ type: 'uuid', nullable: true })
  refId: string;

  @Column({ type: 'varchar' })
  serviceType: string;

  @Column({ type: 'decimal', precision: 18, scale: 3 })
  qty: number;

  @Column({ type: 'varchar' })
  uom: string;

  @Column({ type: 'decimal', precision: 18, scale: 3, nullable: true })
  rate: number;

  @Column({ type: 'decimal', precision: 18, scale: 3, nullable: true })
  amount: number;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  ts: Date;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'boolean', default: false })
  billed: boolean;

  @Column({ type: 'uuid', nullable: true })
  invoiceId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Customer)
  @JoinColumn({ name: 'customerId' })
  customer: Customer;
}

@Entity('invoices')
@Index(['customerId'])
@Index(['tenantId'])
export class Invoice {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  tenantId: string;

  @Column({ type: 'uuid' })
  customerId: string;

  @Column({ type: 'date', nullable: true })
  periodFrom: Date;

  @Column({ type: 'date', nullable: true })
  periodTo: Date;

  @Column({ type: 'varchar' })
  currency: string;

  @Column({ type: 'decimal', precision: 18, scale: 3, default: 0 })
  total: number;

  @Column({ type: 'decimal', precision: 18, scale: 3, default: 0 })
  tax: number;

  @Column({ type: 'decimal', precision: 18, scale: 3, default: 0 })
  subtotal: number;

  @Column({ type: 'varchar', default: 'OPEN' })
  status: string;

  @Column({ type: 'varchar', nullable: true })
  invoiceNumber: string;

  @Column({ type: 'date', nullable: true })
  dueDate: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Customer)
  @JoinColumn({ name: 'customerId' })
  customer: Customer;

  @OneToMany(() => InvoiceLine, (line) => line.invoice, { cascade: true })
  lines: InvoiceLine[];

  @OneToMany(() => Payment, (payment) => payment.invoice, { cascade: true })
  payments: Payment[];
}

@Entity('invoice_lines')
export class InvoiceLine {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  invoiceId: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', nullable: true })
  serviceType: string;

  @Column({ type: 'decimal', precision: 18, scale: 3, nullable: true })
  qty: number;

  @Column({ type: 'varchar', nullable: true })
  uom: string;

  @Column({ type: 'decimal', precision: 18, scale: 3, nullable: true })
  rate: number;

  @Column({ type: 'decimal', precision: 18, scale: 3, default: 0 })
  tax: number;

  @Column({ type: 'decimal', precision: 18, scale: 3 })
  amount: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Invoice, (invoice) => invoice.lines, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'invoiceId' })
  invoice: Invoice;
}

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  invoiceId: string;

  @Column({ type: 'varchar', nullable: true })
  method: string;

  @Column({ type: 'decimal', precision: 18, scale: 3 })
  amount: number;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  paidAt: Date;

  @Column({ type: 'varchar', nullable: true })
  reference: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Invoice, (invoice) => invoice.payments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'invoiceId' })
  invoice: Invoice;
}
