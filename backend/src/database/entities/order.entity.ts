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
import { User } from './user.entity';
import { Customer } from './customer.entity';
import { Item, Lot } from './item.entity';

export enum OrderType {
  IN = 'IN',
  OUT = 'OUT',
  TRANSFER = 'TRANSFER',
}

export enum OrderStatus {
  NEW = 'NEW',
  APPROVED = 'APPROVED',
  PICKING = 'PICKING',
  PACKED = 'PACKED',
  OUT_FOR_DELIVERY = 'OUT_FOR_DELIVERY',
  DELIVERED = 'DELIVERED',
  RECEIVED = 'RECEIVED',
  CLOSED = 'CLOSED',
  ON_HOLD = 'ON_HOLD',
}

export enum OwnerTypeEffective {
  CONSIGNMENT = 'CONSIGNMENT', // وديعة العميل - الفوترة = خدمات فقط
  PURCHASE_FOR_CLIENT = 'PURCHASE_FOR_CLIENT', // الشركة مالك مؤقت - عند ePOD يُصدر فاتورة بيع + خدمات
  COMPANY_OWNED = 'COMPANY_OWNED', // ملكية الشركة
}

@Entity('orders')
@Index(['tenantId', 'status'])
@Index(['customerId', 'createdAt'])
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  tenantId: string;

  @Column({ type: 'uuid', nullable: true })
  customerId: string;

  @Column({
    type: 'enum',
    enum: OrderType,
  })
  type: OrderType;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.NEW,
  })
  status: OrderStatus;

  @Column({ type: 'timestamptz', nullable: true })
  slaTs: Date;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'uuid', nullable: true })
  createdBy: string;

  @Column({
    type: 'enum',
    enum: OwnerTypeEffective,
    default: OwnerTypeEffective.CONSIGNMENT,
  })
  ownerTypeEffective: OwnerTypeEffective;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Customer, { nullable: true })
  @JoinColumn({ name: 'customerId' })
  customer: Customer;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'createdBy' })
  creator: User;

  @OneToMany(() => OrderLine, (line) => line.order, { cascade: true })
  lines: OrderLine[];
}

@Entity('order_lines')
export class OrderLine {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  orderId: string;

  @Column({ type: 'varchar' })
  itemSku: string;

  @Column({ type: 'uuid', nullable: true })
  lotId: string;

  @Column({ type: 'decimal', precision: 18, scale: 3 })
  qty: number;

  @Column({ type: 'decimal', precision: 18, scale: 3, nullable: true })
  pickedQty: number;

  @Column({ type: 'decimal', precision: 18, scale: 3, nullable: true })
  packedQty: number;

  @Column({
    type: 'enum',
    enum: OwnerTypeEffective,
    default: OwnerTypeEffective.CONSIGNMENT,
  })
  ownerTypeEffective: OwnerTypeEffective;

  @Column({ type: 'decimal', precision: 18, scale: 3, nullable: true })
  unitPrice: number; // سعر البيع للعنصر (لـ PURCHASE_FOR_CLIENT)

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Order, (order) => order.lines, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'orderId' })
  order: Order;

  @ManyToOne(() => Item, { nullable: true })
  @JoinColumn({ name: 'itemSku' })
  item: Item;

  @ManyToOne(() => Lot, { nullable: true })
  @JoinColumn({ name: 'lotId' })
  lot: Lot;
}
