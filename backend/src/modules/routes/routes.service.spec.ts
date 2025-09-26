import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoutesService } from './routes.service';
import { Route, RouteStop, EPod } from '../../../database/entities/route.entity';
import { Order, OwnerTypeEffective, OrderStatus } from '../../../database/entities/order.entity';
import { InvoiceService } from '../billing/services/invoice.service';

describe('RoutesService.completeStop', () => {
  let service: RoutesService;
  let stopRepo: Repository<RouteStop>;
  let orderRepo: Repository<Order>;
  let epodRepo: Repository<EPod>;
  let invoiceService: InvoiceService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        RoutesService,
        { provide: getRepositoryToken(Route), useClass: Repository },
        { provide: getRepositoryToken(RouteStop), useClass: Repository },
        { provide: getRepositoryToken(EPod), useClass: Repository },
        { provide: getRepositoryToken(Order), useClass: Repository },
        { provide: InvoiceService, useValue: { generatePurchaseForClientInvoice: jest.fn().mockResolvedValue({ invoiceNumber: 'INV-1' }) } },
      ],
    }).compile();

    service = moduleRef.get(RoutesService);
    stopRepo = moduleRef.get(getRepositoryToken(RouteStop));
    orderRepo = moduleRef.get(getRepositoryToken(Order));
    epodRepo = moduleRef.get(getRepositoryToken(EPod));
    invoiceService = moduleRef.get(InvoiceService);
  });

  it('marks stop complete, updates order to DELIVERED, and triggers invoice for PURCHASE_FOR_CLIENT', async () => {
    jest.spyOn(stopRepo, 'findOne').mockResolvedValue({ id: 's1', routeId: 'r1', orderId: 'o1' } as any);
    jest.spyOn(stopRepo, 'save').mockResolvedValue({} as any);
    const orderUpdateSpy = jest.spyOn(orderRepo, 'update').mockResolvedValue({} as any);
    jest.spyOn(orderRepo, 'findOne').mockResolvedValue({ id: 'o1', ownerTypeEffective: OwnerTypeEffective.PURCHASE_FOR_CLIENT } as any);
    jest.spyOn(epodRepo, 'create').mockImplementation((x: any) => x as any);
    jest.spyOn(epodRepo, 'save').mockResolvedValue({} as any);

    const res = await service.completeStop({ routeId: 'r1', stopId: 's1' } as any);

    expect(res.status).toBe('COMPLETED');
    expect(orderUpdateSpy).toHaveBeenCalledWith('o1', { status: OrderStatus.DELIVERED });
    expect(invoiceService.generatePurchaseForClientInvoice).toHaveBeenCalledWith('o1');
  });
});


