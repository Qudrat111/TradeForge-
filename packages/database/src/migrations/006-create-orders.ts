import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateOrders1700000006000 implements MigrationInterface {
  public readonly name = 'CreateOrders1700000006000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TYPE order_status_enum AS ENUM (
        'draft', 'pending_approval', 'approved', 'processing',
        'shipped', 'delivered', 'completed', 'cancelled', 'disputed'
      )
    `);
    await queryRunner.query(`
      CREATE TYPE payment_status_enum AS ENUM ('unpaid', 'partially_paid', 'paid', 'refunded')
    `);
    await queryRunner.query(`
      CREATE TABLE orders (
        id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        tenant_id        UUID                NOT NULL REFERENCES tenants (id) ON DELETE RESTRICT,
        order_number     VARCHAR             NOT NULL,
        buyer_tenant_id  UUID                NOT NULL,
        seller_tenant_id UUID                NOT NULL,
        rfq_id           UUID,
        currency         VARCHAR(3)          NOT NULL,
        subtotal         DECIMAL(20, 4)      NOT NULL,
        tax              DECIMAL(20, 4)      NOT NULL DEFAULT 0,
        total            DECIMAL(20, 4)      NOT NULL,
        status           order_status_enum   NOT NULL DEFAULT 'draft',
        payment_status   payment_status_enum NOT NULL DEFAULT 'unpaid',
        incoterm         VARCHAR(3)          NOT NULL,
        shipping_address JSONB               NOT NULL DEFAULT '{}',
        created_at       TIMESTAMPTZ         NOT NULL DEFAULT NOW(),
        updated_at       TIMESTAMPTZ         NOT NULL DEFAULT NOW(),
        CONSTRAINT uq_orders_order_number UNIQUE (order_number)
      )
    `);
    await queryRunner.query(`CREATE INDEX idx_orders_tenant_id ON orders (tenant_id)`);
    await queryRunner.query(`CREATE INDEX idx_orders_status    ON orders (status)`);
    await queryRunner.query(`CREATE INDEX idx_orders_buyer     ON orders (buyer_tenant_id)`);
    await queryRunner.query(`CREATE INDEX idx_orders_seller    ON orders (seller_tenant_id)`);
    await queryRunner.query(`ALTER TABLE orders ENABLE ROW LEVEL SECURITY`);
    await queryRunner.query(`
      CREATE POLICY tenant_isolation ON orders
        USING (tenant_id = current_setting('app.current_tenant', true)::UUID)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP POLICY IF EXISTS tenant_isolation ON orders`);
    await queryRunner.query(`DROP TABLE IF EXISTS orders`);
    await queryRunner.query(`DROP TYPE IF EXISTS payment_status_enum`);
    await queryRunner.query(`DROP TYPE IF EXISTS order_status_enum`);
  }
}
