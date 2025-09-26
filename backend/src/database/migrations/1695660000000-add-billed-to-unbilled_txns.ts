import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddBilledToUnbilledTxns1695660000000 implements MigrationInterface {
  name = 'AddBilledToUnbilledTxns1695660000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "unbilled_txns" ADD COLUMN IF NOT EXISTS "billed" boolean DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "unbilled_txns" ADD COLUMN IF NOT EXISTS "invoiceId" uuid`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "unbilled_txns" DROP COLUMN IF EXISTS "invoiceId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "unbilled_txns" DROP COLUMN IF EXISTS "billed"`,
    );
  }
}


