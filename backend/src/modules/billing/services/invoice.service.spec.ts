import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InvoiceService } from './invoice.service';
import { Invoice, InvoiceLine, UnbilledTxn } from '../../../../src/database/entities/billing.entity';
import { Customer } from '../../../../src/database/entities/customer.entity';
import { RateCard } from '../../../../src/database/entities/rate-card.entity';
import { Order, OrderLine, OwnerTypeEffective } from '../../../../src/database/entities/order.entity';
import { PricingEngineService } from './pricing-engine.service';

describe('InvoiceService generatePurchaseForClientInvoice', () => {
  let service: InvoiceService;
  let invoiceRepo: Repository<Invoice>;
  let invoiceLineRepo: Repository<InvoiceLine>;
  let rateCardRepo: Repository<RateCard>;
  let orderRepo: Repository<Order>;

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
  });

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
    // mock create and save to return a saved entity
    jest.spyOn(invoiceRepo, 'create').mockImplementation((x: any) => ({ ...x } as any));
    const saveSpy = jest.spyOn(invoiceRepo, 'save').mockImplementation(async (entity) => ({ id: 'inv1', ...entity } as any));
    const updateSpy = jest.spyOn(invoiceRepo, 'update').mockResolvedValue({} as any);
    jest.spyOn(invoiceLineRepo, 'create').mockImplementation((x: any) => x as any);
    jest.spyOn(invoiceLineRepo, 'save').mockResolvedValue([] as any);

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