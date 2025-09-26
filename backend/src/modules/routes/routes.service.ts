import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Route, RouteStop, EPod } from '../../database/entities/route.entity';
import { Order, OwnerTypeEffective, OrderStatus } from '../../database/entities/order.entity';
import { CreateRouteDto } from './dto/create-route.dto';
import { UpdateRouteDto } from './dto/update-route.dto';
import { CompleteStopDto } from './dto/complete-stop.dto';
import { InvoiceService } from '../billing/services/invoice.service';

@Injectable()
export class RoutesService {
  constructor(
    @InjectRepository(Route)
    private readonly routeRepository: Repository<Route>,
    @InjectRepository(RouteStop)
    private readonly stopRepository: Repository<RouteStop>,
    @InjectRepository(EPod)
    private readonly epodRepository: Repository<EPod>,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    private readonly invoiceService: InvoiceService,
  ) {}

  async create(createRouteDto: CreateRouteDto): Promise<Route> {
    const route = this.routeRepository.create(createRouteDto);
    return this.routeRepository.save(route);
  }

  async findAll(): Promise<Route[]> {
    return this.routeRepository.find({ relations: ['stops'] });
  }

  async findDriverRoutes(driverUserId: string, tenantId: string): Promise<Route[]> {
    return this.routeRepository.find({ where: { driverUserId, tenantId }, relations: ['stops'] });
  }

  async findOne(id: string): Promise<Route> {
    const route = await this.routeRepository.findOne({ where: { id } });

    if (!route) {
      throw new NotFoundException('Route not found');
    }

    return route;
  }

  async update(id: string, updateRouteDto: UpdateRouteDto): Promise<Route> {
    const route = await this.findOne(id);
    Object.assign(route, updateRouteDto);
    return this.routeRepository.save(route);
  }

  async assignDriver(id: string, driverUserId: string): Promise<Route> {
    const route = await this.findOne(id);
    route.driverUserId = driverUserId;
    return this.routeRepository.save(route);
  }

  async remove(id: string): Promise<void> {
    const route = await this.findOne(id);
    await this.routeRepository.remove(route);
  }

  async completeStop(dto: CompleteStopDto) {
    const stop = await this.stopRepository.findOne({ where: { id: dto.stopId, routeId: dto.routeId } });
    if (!stop) throw new NotFoundException('Stop not found');

    stop.status = 'COMPLETED';
    stop.actualArrival = new Date();
    await this.stopRepository.save(stop);

    const epod = this.epodRepository.create({
      orderId: stop.orderId!,
      signerName: dto.signerName,
      signerId: dto.signerId,
      photos: dto.photos,
      latitude: dto.latitude,
      longitude: dto.longitude,
      completedAt: new Date(),
      notes: dto.notes,
      // signature will be included inside photos/notes for now
    });
    await this.epodRepository.save(epod);

    // Update order status to DELIVERED
    if (stop.orderId) {
      await this.orderRepository.update(stop.orderId, { status: OrderStatus.DELIVERED });

      // Check if this is a PURCHASE_FOR_CLIENT order and generate invoice
      const order = await this.orderRepository.findOne({ where: { id: stop.orderId } });
      if (order && order.ownerTypeEffective === OwnerTypeEffective.PURCHASE_FOR_CLIENT) {
        try {
          const invoice = await this.invoiceService.generatePurchaseForClientInvoice(stop.orderId);
          console.log(`Generated invoice ${invoice.invoiceNumber} for PURCHASE_FOR_CLIENT order ${stop.orderId}`);
        } catch (error) {
          console.error(`Failed to generate invoice for order ${stop.orderId}:`, error.message);
          // Don't fail the ePOD completion if invoice generation fails
        }
      }
    }

    return { stopId: stop.id, status: stop.status, epodId: epod.id };
  }
}
