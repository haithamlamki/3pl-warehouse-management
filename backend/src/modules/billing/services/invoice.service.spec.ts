import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InvoiceService } from './invoice.service';
import { Invoice, InvoiceLine, UnbilledTxn } from '../../../../src/database/entities/billing.entity';
import { Customer } from '../../../../src/database/entities/customer.entity';
import { RateCard } from '../../../../src/database/entities/rate-card.entity';
import { Order, OrderLine, OwnerTypeEffective } from '../../../../src/database/entities/order.entity';
import { PricingEngineService } from './pricing-engine.service';
import { NotFoundException } from '@nestjs/common';
import { GenerateInvoiceDto } from '../dto/generate-invoice.dto';

describe('InvoiceService', () => {
  let service: InvoiceService;
  let invoiceRepo: Repository<Invoice>;
  let invoiceLineRepo: Repository<InvoiceLine>;
  let rateCardRepo: Repository<RateCard>;
  let orderRepo: Repository<Order>;
  let customerRepo: Repository<Customer>;
  let unbilledTxnRepo: Repository<UnbilledTxn>;

  const mockQueryBuilder = {
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    getMany: jest.fn().mockResolvedValue([]),
    where: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    set: jest.fn().mockReturnThis(),
    whereInIds: jest.fn().mockReturnThis(),
    execute: jest.fn().mockResolvedValue({}),
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        InvoiceService,
        { provide: getRepositoryToken(Invoice), useClass: Repository },
        { provide: getRepositoryToken(InvoiceLine), useClass: Repository },
        { provide: getRepositoryToken(UnbilledTxn), useClass: Repository },
        { provide: getRepositoryToken(Customer), useClass: Repository },
        { provide: getRepositoryToken(RateCard), useClass: Repository },
        { provide: getRepositoryToken(Order), useClass: Repository },
        { provide: getRepositoryToken(OrderLine), useClass: Repository },
        {
          provide: PricingEngineService,
          useValue: {
            calculatePrice: jest.fn().mockResolvedValue({ finalPrice: 10, appliedRule: { price: 10 } }),
          },
        },
      ],
    }).compile();

    service = moduleRef.get(InvoiceService);
    invoiceRepo = moduleRef.get(getRepositoryToken(Invoice));
    invoiceLineRepo = moduleRef.get(getRepositoryToken(InvoiceLine));
    rateCardRepo = moduleRef.get(getRepositoryToken(RateCard));
    orderRepo = moduleRef.get(getRepositoryToken(Order));
    customerRepo = moduleRef.get(getRepositoryToken(Customer));
    unbilledTxnRepo = moduleRef.get(getRepositoryToken(UnbilledTxn));

    jest.spyOn(invoiceRepo, 'createQueryBuilder').mockReturnValue(mockQueryBuilder as any);
    jest.spyOn(unbilledTxnRepo, 'createQueryBuilder').mockReturnValue(mockQueryBuilder as any);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('generatePurchaseForClientInvoice', () => {
    it('uses valid Invoice fields and updates tax/total correctly', async () => {
      jest.spyOn(orderRepo, 'findOne').mockResolvedValue({
        id: 'o1',
        customerId: 'c1',
        status: 'DELIVERED',
        ownerTypeEffective: OwnerTypeEffective.PURCHASE_FOR_CLIENT,
        lines: [
          { id: 'l1', itemSku: 'SKU1', qty: 2, unitPrice: 5, item: { uom: 'PCS', name: 'Item' } },
        ],
      } as any);

      jest.spyOn(rateCardRepo, 'findOne').mockResolvedValue({ id: 'rc', currency: 'USD', rules: [] } as any);
      jest.spyOn(invoiceRepo, 'create').mockImplementation((x: any) => ({ ...x } as any));
      const saveSpy = jest.spyOn(invoiceRepo, 'save').mockImplementation(async (entity) => ({ id: 'inv1', ...entity } as any));
      const updateSpy = jest.spyOn(invoiceRepo, 'update').mockResolvedValue({} as any);
      jest.spyOn(invoiceLineRepo, 'create').mockImplementation((x: any) => x as any);
      jest.spyOn(invoiceLineRepo, 'save').mockResolvedValue([new InvoiceLine()] as any);
      jest.spyOn(service, 'findOne').mockResolvedValue({} as any);

      const inv = await service.generatePurchaseForClientInvoice('o1');

      expect(saveSpy).toHaveBeenCalled();
      const saved = saveSpy.mock.calls[0][0] as any;
      expect(saved.currency).toBe('USD');
      expect(saved.status).toBe('OPEN');
      expect(updateSpy).toHaveBeenCalledWith('inv1', expect.objectContaining({
        subtotal: expect.any(Number),
        tax: expect.any(Number),
        total: expect.any(Number),
        status: 'FINAL',
      }));
      expect(inv).toBeDefined();
    });
  });

  describe('findOne', () => {
    it('should return an invoice if found', async () => {
      const mockInvoice = { id: 'inv1' } as Invoice;
      jest.spyOn(invoiceRepo, 'findOne').mockResolvedValue(mockInvoice);

      const result = await service.findOne('inv1');

      expect(result).toEqual(mockInvoice);
      expect(invoiceRepo.findOne).toHaveBeenCalledWith({
        where: { id: 'inv1' },
        relations: ['customer', 'lines', 'payments'],
      });
    });

    it('should throw NotFoundException if invoice is not found', async () => {
      jest.spyOn(invoiceRepo, 'findOne').mockResolvedValue(null);

      await expect(service.findOne('inv1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('should return all invoices when no filters are provided', async () => {
      const mockInvoices = [{ id: '1' }, { id: '2' }] as Invoice[];
      mockQueryBuilder.getMany.mockResolvedValue(mockInvoices);

      const result = await service.findAll();

      expect(result).toEqual(mockInvoices);
      expect(mockQueryBuilder.andWhere).not.toHaveBeenCalled();
    });

    it('should apply customerId filter when provided', async () => {
      await service.findAll('cust1');
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'invoice.customerId = :customerId',
        { customerId: 'cust1' }
      );
    });

    it('should apply status filter when provided', async () => {
      await service.findAll(undefined, 'PAID');
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'invoice.status = :status',
        { status: 'PAID' }
      );
    });

    it('should apply date filters when provided', async () => {
      const from = '2023-01-01';
      const to = '2023-01-31';
      await service.findAll(undefined, undefined, from, to);
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'invoice.periodFrom >= :from',
        { from }
      );
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'invoice.periodTo <= :to',
        { to }
      );
    });
  });

  describe('generate', () => {
    const generateDto: GenerateInvoiceDto = {
      tenantId: 't1',
      customerId: 'c1',
      periodFrom: '2023-01-01',
      periodTo: '2023-01-31',
      currency: 'USD',
      taxRate: 15,
    };

    it('should generate an invoice successfully', async () => {
      jest.spyOn(customerRepo, 'findOne').mockResolvedValue({ id: 'c1' } as Customer);
      mockQueryBuilder.getMany.mockResolvedValue([{ id: 'txn1', amount: 100 }] as UnbilledTxn[]);
      jest.spyOn(invoiceRepo, 'create').mockReturnValue({ id: 'inv1' } as Invoice);
      jest.spyOn(invoiceRepo, 'save').mockResolvedValue({ id: 'inv1' } as Invoice);
      jest.spyOn(rateCardRepo, 'findOne').mockResolvedValue(null);
      jest.spyOn(invoiceLineRepo, 'create').mockReturnValue({} as InvoiceLine);
      jest.spyOn(invoiceLineRepo, 'save').mockResolvedValue([new InvoiceLine()] as any);
      jest.spyOn(invoiceRepo, 'update').mockResolvedValue({} as any);
      jest.spyOn(service, 'findOne').mockResolvedValue({ id: 'inv1', total: 115 } as Invoice);
      jest.spyOn(invoiceRepo, 'count').mockResolvedValue(0);

      const result = await service.generate(generateDto);

      expect(result.total).toBe(115);
      expect(invoiceRepo.save).toHaveBeenCalled();
      expect(invoiceLineRepo.save).toHaveBeenCalled();
      expect(invoiceRepo.update).toHaveBeenCalled();
      expect(mockQueryBuilder.execute).toHaveBeenCalled(); // For marking txns as billed
    });

    it('should throw NotFoundException if customer is not found', async () => {
      jest.spyOn(customerRepo, 'findOne').mockResolvedValue(null);
      await expect(service.generate(generateDto)).rejects.toThrow(NotFoundException);
    });

    it('should throw an error if no unbilled transactions are found', async () => {
      jest.spyOn(customerRepo, 'findOne').mockResolvedValue({ id: 'c1' } as Customer);
      mockQueryBuilder.getMany.mockResolvedValue([]);
      await expect(service.generate(generateDto)).rejects.toThrow('No unbilled transactions found for the specified period');
    });
  });
});