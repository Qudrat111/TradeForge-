import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateOrderItems1700000007000 implements MigrationInterface {
  public readonly name = 'CreateOrderItems1700000007000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE order_items (
        id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        order_id    UUID           NOT NULL REFERENCES orders   (id) ON DELETE CASCADE,
        product_id  UUID           NOT NULL REFERENCES products (id) ON DELETE RESTRICT,
        quantity    INTEGER        NOT NULL,
        unit_price  DECIMAL(20, 4) NOT NULL,
        total_price DECIMAL(20, 4) NOT NULL,
        currency    VARCHAR(3)     NOT NULL
      )
    `);
    await queryRunner.query(`CREATE INDEX idx_order_items_order_id   ON order_items (order_id)`);
    await queryRunner.query(`CREATE INDEX idx_order_items_product_id ON order_items (product_id)`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS order_items`);
  }
}
