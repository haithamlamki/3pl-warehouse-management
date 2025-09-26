import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReportsService } from './reports.service';
import {
  Order,
  Inventory,
  Item,
  Customer,
  Invoice,
  Payment,
  OrderLine,
} from '../../database/entities';

describe('ReportsService', () => {
  let service: ReportsService;
  let invoiceRepository: Repository<Invoice>;
  let customerRepository: Repository<Customer>;
  let orderRepository: Repository<Order>;
  let inventoryRepository: Repository<Inventory>;
  let orderLineRepository: Repository<OrderLine>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReportsService,
        { provide: getRepositoryToken(Order), useClass: Repository },
        { provide: getRepositoryToken(OrderLine), useClass: Repository },
        { provide: getRepositoryToken(Inventory), useClass: Repository },
        { provide: getRepositoryToken(Item), useClass: Repository },
        { provide: getRepositoryToken(Customer), useClass: Repository },
        { provide: getRepositoryToken(Invoice), useClass: Repository },
        { provide: getRepositoryToken(Payment), useClass: Repository },
      ],
    }).compile();

    service = module.get<ReportsService>(ReportsService);
    invoiceRepository = module.get<Repository<Invoice>>(
      getRepositoryToken(Invoice),
    );
    customerRepository = module.get<Repository<Customer>>(
      getRepositoryToken(Customer),
    );
    orderRepository = module.get<Repository<Order>>(
      getRepositoryToken(Order),
    );
    inventoryRepository = module.get<Repository<Inventory>>(
      getRepositoryToken(Inventory),
    );
    orderLineRepository = module.get<Repository<OrderLine>>(
      getRepositoryToken(OrderLine),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getDashboard', () => {
    it('should calculate total revenue from PAID invoices only', async () => {
      jest.spyOn(customerRepository, 'count').mockResolvedValue(0);
      jest.spyOn(orderRepository, 'count').mockResolvedValue(0);
      jest.spyOn(inventoryRepository, 'count').mockResolvedValue(0);

      // This mock simulates the behavior of the query builder.
      // The `where` function checks if the query is filtering by status.
      // The `getRawOne` function returns a different total based on whether
      // the status filter was applied, thus testing the logic in getTotalRevenue.
      let whereCalledWithPaid = false;
      const qbMock = {
        select: jest.fn().mockReturnThis(),
        where: jest.fn(function (condition, params) {
          if (
            condition === 'invoice.status = :status' &&
            params.status === 'PAID'
          ) {
            whereCalledWithPaid = true;
          }
          return this;
        }),
        getRawOne: jest.fn().mockImplementation(async () => {
          if (whereCalledWithPaid) {
            return { total: 150.0 }; // Correctly filtered total
          }
          return { total: 450.0 }; // Unfiltered total
        }),
      };

      jest
        .spyOn(invoiceRepository, 'createQueryBuilder')
        .mockReturnValue(qbMock as any);

      // Mock other private methods called by getDashboard to isolate the test
      jest.spyOn(service as any, 'getOrderTrends').mockResolvedValue([]);
      jest.spyOn(service as any, 'getRevenueTrends').mockResolvedValue([]);
      jest.spyOn(service as any, 'getInventoryLevels').mockResolvedValue([]);

      // Mock getInventoryReports to avoid its complex logic in this unit test
      jest.spyOn(service, 'getInventoryReports').mockResolvedValue({
        inventories: [],
        totals: { totalItems: 0, totalValue: 0 },
      });

      const dashboardData = await service.getDashboard();

      expect(dashboardData.overview.totalRevenue).toBe(150.0);
    });
  });
});