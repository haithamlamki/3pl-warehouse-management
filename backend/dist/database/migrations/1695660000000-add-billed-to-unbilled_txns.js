"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddBilledToUnbilledTxns1695660000000 = void 0;
class AddBilledToUnbilledTxns1695660000000 {
    constructor() {
        this.name = 'AddBilledToUnbilledTxns1695660000000';
    }
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "unbilled_txns" ADD COLUMN IF NOT EXISTS "billed" boolean DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "unbilled_txns" ADD COLUMN IF NOT EXISTS "invoiceId" uuid`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "unbilled_txns" DROP COLUMN IF EXISTS "invoiceId"`);
        await queryRunner.query(`ALTER TABLE "unbilled_txns" DROP COLUMN IF EXISTS "billed"`);
    }
}
exports.AddBilledToUnbilledTxns1695660000000 = AddBilledToUnbilledTxns1695660000000;
//# sourceMappingURL=1695660000000-add-billed-to-unbilled_txns.js.map