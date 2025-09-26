import { MigrationInterface, QueryRunner } from 'typeorm';
export declare class AddOwnerTypeEffective1695670000000 implements MigrationInterface {
    name: string;
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
