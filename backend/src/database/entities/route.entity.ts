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
import { User } from './user.entity';
import { Order } from './order.entity';

@Entity('routes')
@Index(['tenantId'])
@Index(['driverUserId'])
export class Route {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  tenantId: string;

  @Column({ type: 'uuid', nullable: true })
  driverUserId: string;

  @Column({ type: 'varchar', default: 'PLANNED' })
  status: string;

  @Column({ type: 'varchar', nullable: true })
  routeNumber: string;

  @Column({ type: 'timestamptz', nullable: true })
  plannedStartTime: Date;

  @Column({ type: 'timestamptz', nullable: true })
  actualStartTime: Date;

  @Column({ type: 'timestamptz', nullable: true })
  actualEndTime: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  totalDistance: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  totalDuration: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'driverUserId' })
  driver: User;

  @OneToMany(() => RouteStop, (stop) => stop.route, { cascade: true })
  stops: RouteStop[];
}

@Entity('route_stops')
@Unique(['routeId', 'seq'])
export class RouteStop {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  routeId: string;

  @Column({ type: 'uuid', nullable: true })
  orderId: string;

  @Column({ type: 'int' })
  seq: number;

  @Column({ type: 'timestamptz', nullable: true })
  eta: Date;

  @Column({ type: 'timestamptz', nullable: true })
  actualArrival: Date;

  @Column({ type: 'varchar', default: 'PENDING' })
  status: string;

  @Column({ type: 'jsonb', nullable: true })
  address: any;

  @Column({ type: 'decimal', precision: 10, scale: 6, nullable: true })
  latitude: number;

  @Column({ type: 'decimal', precision: 10, scale: 6, nullable: true })
  longitude: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Route, (route) => route.stops, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'routeId' })
  route: Route;

  @ManyToOne(() => Order, { nullable: true })
  @JoinColumn({ name: 'orderId' })
  order: Order;
}

@Entity('epod')
@Index(['orderId'])
export class EPod {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  orderId: string;

  @Column({ type: 'varchar', nullable: true })
  signerName: string;

  @Column({ type: 'varchar', nullable: true })
  signerId: string;

  @Column({ type: 'jsonb', nullable: true })
  photos: any;

  @Column({ type: 'decimal', precision: 10, scale: 6, nullable: true })
  latitude: number;

  @Column({ type: 'decimal', precision: 10, scale: 6, nullable: true })
  longitude: number;

  @Column({ type: 'timestamptz' })
  completedAt: Date;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Order, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'orderId' })
  order: Order;
}
