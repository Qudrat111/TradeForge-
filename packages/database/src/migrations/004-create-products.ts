import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateProducts1700000004000 implements MigrationInterface {
  public readonly name = 'CreateProducts1700000004000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TYPE product_status_enum AS ENUM ('active', 'inactive', 'draft', 'discontinued')
    `);
    await queryRunner.query(`
      CREATE TABLE products (
        id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        tenant_id      UUID                NOT NULL REFERENCES tenants    (id) ON DELETE CASCADE,
        sku            VARCHAR(100)        NOT NULL,
        name           JSONB               NOT NULL,
        description    JSONB               NOT NULL DEFAULT '{}',
        category_id    UUID                NOT NULL REFERENCES categories (id) ON DELETE RESTRICT,
        prices         JSONB               NOT NULL DEFAULT '[]',
        hs_code        VARCHAR(20)         NOT NULL,
        moq            INTEGER             NOT NULL DEFAULT 1,
        lead_time_days INTEGER             NOT NULL DEFAULT 0,
        status         product_status_enum NOT NULL DEFAULT 'draft',
        metadata       JSONB               NOT NULL DEFAULT '{}',
        created_at     TIMESTAMPTZ         NOT NULL DEFAULT NOW()
      )
    `);
    await queryRunner.query(`CREATE INDEX idx_products_tenant_id   ON products (tenant_id)`);
    await queryRunner.query(`CREATE INDEX idx_products_category_id ON products (category_id)`);
    await queryRunner.query(`CREATE INDEX idx_products_status      ON products (status)`);
    await queryRunner.query(`CREATE INDEX idx_products_name_gin    ON products USING GIN (name)`);
    await queryRunner.query(`ALTER TABLE products ENABLE ROW LEVEL SECURITY`);
    await queryRunner.query(`
      CREATE POLICY tenant_isolation ON products
        USING (tenant_id = current_setting('app.current_tenant', true)::UUID)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP POLICY IF EXISTS tenant_isolation ON products`);
    await queryRunner.query(`DROP TABLE IF EXISTS products`);
    await queryRunner.query(`DROP TYPE IF EXISTS product_status_enum`);
  }
}
