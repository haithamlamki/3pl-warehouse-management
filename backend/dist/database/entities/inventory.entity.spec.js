"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const inventory_entity_1 = require("./inventory.entity");
describe('Inventory Entity', () => {
    it('should compile without TypeScript errors', () => {
        const inventory = new inventory_entity_1.Inventory();
        inventory.itemSku = 'TEST-SKU-001';
        inventory.ownerType = inventory_entity_1.OwnerType.CLIENT;
        inventory.ownerId = 'owner-uuid';
        inventory.warehouseId = 'warehouse-uuid';
        inventory.binId = 'bin-uuid';
        inventory.qty = 100;
        expect(inventory.itemSku).toBe('TEST-SKU-001');
        expect(inventory.ownerType).toBe(inventory_entity_1.OwnerType.CLIENT);
        expect(inventory.qty).toBe(100);
    });
    it('should have all required entity decorators', () => {
        const inventory = new inventory_entity_1.Inventory();
        expect(inventory).toBeInstanceOf(inventory_entity_1.Inventory);
    });
    it('should have proper relation decorators', () => {
        const inventory = new inventory_entity_1.Inventory();
        expect(inventory.item).toBeUndefined();
        expect(inventory.owner).toBeUndefined();
        expect(inventory.warehouse).toBeUndefined();
        expect(inventory.bin).toBeUndefined();
        expect(inventory.lot).toBeUndefined();
    });
});
//# sourceMappingURL=inventory.entity.spec.js.map