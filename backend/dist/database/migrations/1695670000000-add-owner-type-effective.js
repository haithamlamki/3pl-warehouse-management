"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddOwnerTypeEffective1695670000000 = void 0;
const typeorm_1 = require("typeorm");
class AddOwnerTypeEffective1695670000000 {
    constructor() {
        this.name = 'AddOwnerTypeEffective1695670000000';
    }
    async up(queryRunner) {
        await queryRunner.addColumn('orders', new typeorm_1.TableColumn({
            name: 'ownerTypeEffective',
            type: 'enum',
            enum: ['CONSIGNMENT', 'PURCHASE_FOR_CLIENT', 'COMPANY_OWNED'],
            default: "'CONSIGNMENT'",
        }));
        await queryRunner.addColumn('order_lines', new typeorm_1.TableColumn({
            name: 'ownerTypeEffective',
            type: 'enum',
            enum: ['CONSIGNMENT', 'PURCHASE_FOR_CLIENT', 'COMPANY_OWNED'],
            default: "'CONSIGNMENT'",
        }));
        await queryRunner.addColumn('order_lines', new typeorm_1.TableColumn({
            name: 'unitPrice',
            type: 'decimal',
            precision: 18,
            scale: 3,
            isNullable: true,
        }));
    }
    async down(queryRunner) {
        await queryRunner.dropColumn('order_lines', 'unitPrice');
        await queryRunner.dropColumn('order_lines', 'ownerTypeEffective');
        await queryRunner.dropColumn('orders', 'ownerTypeEffective');
    }
}
exports.AddOwnerTypeEffective1695670000000 = AddOwnerTypeEffective1695670000000;
//# sourceMappingURL=1695670000000-add-owner-type-effective.js.map