import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Route, RouteStop, EPod } from '../../database/entities/route.entity';
import { Order, OwnerTypeEffective, OrderStatus } from '../../database/entities/order.entity';
import { CreateRouteDto } from './dto/create-route.dto';
import { UpdateRouteDto } from './dto/update-route.dto';
import { CompleteStopDto } from './dto/complete-stop.dto';
import { InvoiceService } from '../billing/services/invoice.service';

/**
 * @class RoutesService
 * @description This service manages all operations related to delivery routes and their stops.
 */
@Injectable()
export class RoutesService {
  /**
   * @constructor
   * @param {Repository<Route>} routeRepository - Repository for Route entities.
   * @param {Repository<RouteStop>} stopRepository - Repository for RouteStop entities.
   * @param {Repository<EPod>} epodRepository - Repository for EPod (Electronic Proof of Delivery) entities.
   * @param {Repository<Order>} orderRepository - Repository for Order entities.
   * @param {InvoiceService} invoiceService - Service for generating invoices.
   */
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

  /**
   * @method create
   * @description Creates a new delivery route.
   * @param {CreateRouteDto} createRouteDto - The data needed to create the route.
   * @returns {Promise<Route>} A promise that resolves to the newly created Route entity.
   */
  async create(createRouteDto: CreateRouteDto): Promise<Route> {
    const route = this.routeRepository.create(createRouteDto);
    return this.routeRepository.save(route);
  }

  /**
   * @method findAll
   * @description Retrieves all delivery routes, including their stops.
   * @returns {Promise<Route[]>} A promise that resolves to an array of all Route entities.
   */
  async findAll(): Promise<Route[]> {
    return this.routeRepository.find({ relations: ['stops'] });
  }

  /**
   * @method findDriverRoutes
   * @description Retrieves all routes assigned to a specific driver within a tenant.
   * @param {string} driverUserId - The unique identifier of the driver.
   * @param {string} tenantId - The unique identifier of the tenant.
   * @returns {Promise<Route[]>} A promise that resolves to an array of the driver's assigned routes.
   */
  async findDriverRoutes(driverUserId: string, tenantId: string): Promise<Route[]> {
    return this.routeRepository.find({ where: { driverUserId, tenantId }, relations: ['stops'] });
  }

  /**
   * @method findOne
   * @description Finds a single route by its unique ID.
   * @param {string} id - The unique identifier of the route.
   * @returns {Promise<Route>} A promise that resolves to the Route entity.
   * @throws {NotFoundException} If no route is found with the given ID.
   */
  async findOne(id: string): Promise<Route> {
    const route = await this.routeRepository.findOne({ where: { id } });

    if (!route) {
      throw new NotFoundException('Route not found');
    }

    return route;
  }

  /**
   * @method update
   * @description Updates the details of an existing route.
   * @param {string} id - The unique identifier of the route to update.
   * @param {UpdateRouteDto} updateRouteDto - The data to update the route with.
   * @returns {Promise<Route>} A promise that resolves to the updated Route entity.
   */
  async update(id: string, updateRouteDto: UpdateRouteDto): Promise<Route> {
    const route = await this.findOne(id);
    Object.assign(route, updateRouteDto);
    return this.routeRepository.save(route);
  }

  /**
   * @method assignDriver
   * @description Assigns a driver to a specific route.
   * @param {string} id - The unique identifier of the route.
   * @param {string} driverUserId - The unique identifier of the driver to assign.
   * @returns {Promise<Route>} A promise that resolves to the updated Route entity with the new driver assigned.
   */
  async assignDriver(id: string, driverUserId: string): Promise<Route> {
    const route = await this.findOne(id);
    route.driverUserId = driverUserId;
    return this.routeRepository.save(route);
  }

  /**
   * @method remove
   * @description Deletes a route from the system.
   * @param {string} id - The unique identifier of the route to delete.
   * @returns {Promise<void>}
   */
  async remove(id: string): Promise<void> {
    const route = await this.findOne(id);
    await this.routeRepository.remove(route);
  }

  /**
   * @method completeStop
   * @description Marks a stop on a route as completed, creates an electronic proof of delivery (ePOD), updates the associated order's status to 'DELIVERED', and may trigger invoicing.
   * @param {CompleteStopDto} dto - The data required to complete the stop.
   * @returns {Promise<object>} A promise that resolves to an object containing the stop ID, status, and ePOD ID.
   * @throws {NotFoundException} If the specified stop is not found.
   */
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
    });
    await this.epodRepository.save(epod);

    if (stop.orderId) {
      await this.orderRepository.update(stop.orderId, { status: OrderStatus.DELIVERED });

      const order = await this.orderRepository.findOne({ where: { id: stop.orderId } });
      if (order && order.ownerTypeEffective === OwnerTypeEffective.PURCHASE_FOR_CLIENT) {
        try {
          const invoice = await this.invoiceService.generatePurchaseForClientInvoice(stop.orderId);
          console.log(`Generated invoice ${invoice.invoiceNumber} for PURCHASE_FOR_CLIENT order ${stop.orderId}`);
        } catch (error) {
          console.error(`Failed to generate invoice for order ${stop.orderId}:`, error.message);
        }
      }
    }

    return { stopId: stop.id, status: stop.status, epodId: epod.id };
  }
}