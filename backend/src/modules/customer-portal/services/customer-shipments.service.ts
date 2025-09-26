import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Route, RouteStop, EPod } from '../../../database/entities/route.entity';
import { Order } from '../../../database/entities/order.entity';

@Injectable()
export class CustomerShipmentsService {
  constructor(
    @InjectRepository(Route)
    private readonly routeRepo: Repository<Route>,
    @InjectRepository(RouteStop)
    private readonly routeStopRepo: Repository<RouteStop>,
    @InjectRepository(EPod)
    private readonly epodRepo: Repository<EPod>,
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
  ) {}

  /**
   * Get shipments for customer
   * @param customerId Customer ID
   * @param status Shipment status filter
   * @returns Customer shipments
   */
  async getShipments(customerId: string, status?: string) {
    const query = this.routeStopRepo
      .createQueryBuilder('stop')
      .leftJoinAndSelect('stop.route', 'route')
      .leftJoinAndSelect('stop.order', 'order')
      .leftJoinAndSelect('order.customer', 'customer')
      .where('order.customerId = :customerId', { customerId });

    if (status) {
      query.andWhere('stop.status = :status', { status });
    }

    return query.getMany();
  }

  /**
   * Track shipment by tracking number
   * @param trackingNumber Tracking number
   * @returns Tracking information
   */
  async trackShipment(trackingNumber: string) {
    // Stub: Return mock tracking data
    return {
      trackingNumber,
      status: 'IN_TRANSIT',
      currentLocation: 'Distribution Center',
      estimatedDelivery: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      history: [
        {
          status: 'PICKED_UP',
          location: 'Warehouse',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        },
        {
          status: 'IN_TRANSIT',
          location: 'Distribution Center',
          timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        },
      ],
    };
  }
}
