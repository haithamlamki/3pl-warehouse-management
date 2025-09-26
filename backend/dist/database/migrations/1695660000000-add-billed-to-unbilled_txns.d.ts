import { MigrationInterface, QueryRunner } from 'typeorm';
export declare class AddBilledToUnbilledTxns1695660000000 implements MigrationInterface {
    name: string;
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
