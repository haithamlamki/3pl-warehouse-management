import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddOwnerTypeEffective1695670000000 implements MigrationInterface {
  name = 'AddOwnerTypeEffective1695670000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add ownerTypeEffective to orders table
    await queryRunner.addColumn(
      'orders',
      new TableColumn({
        name: 'ownerTypeEffective',
        type: 'enum',
        enum: ['CONSIGNMENT', 'PURCHASE_FOR_CLIENT', 'COMPANY_OWNED'],
        default: "'CONSIGNMENT'",
      }),
    );

    // Add ownerTypeEffective to order_lines table
    await queryRunner.addColumn(
      'order_lines',
      new TableColumn({
        name: 'ownerTypeEffective',
        type: 'enum',
        enum: ['CONSIGNMENT', 'PURCHASE_FOR_CLIENT', 'COMPANY_OWNED'],
        default: "'CONSIGNMENT'",
      }),
    );

    // Add unitPrice to order_lines table for PURCHASE_FOR_CLIENT
    await queryRunner.addColumn(
      'order_lines',
      new TableColumn({
        name: 'unitPrice',
        type: 'decimal',
        precision: 18,
        scale: 3,
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('order_lines', 'unitPrice');
    await queryRunner.dropColumn('order_lines', 'ownerTypeEffective');
    await queryRunner.dropColumn('orders', 'ownerTypeEffective');
  }
}
