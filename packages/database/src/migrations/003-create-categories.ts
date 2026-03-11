import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateCategories1700000003000 implements MigrationInterface {
  public readonly name = 'CreateCategories1700000003000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE categories (
        id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        tenant_id  UUID          NOT NULL REFERENCES tenants (id) ON DELETE CASCADE,
        name       JSONB         NOT NULL,
        parent_id  UUID          REFERENCES categories (id) ON DELETE SET NULL,
        slug       VARCHAR(150)  NOT NULL,
        created_at TIMESTAMPTZ   NOT NULL DEFAULT NOW()
      )
    `);
    await queryRunner.query(`CREATE INDEX idx_categories_tenant_id ON categories (tenant_id)`);
    await queryRunner.query(`CREATE INDEX idx_categories_slug      ON categories (slug)`);
    await queryRunner.query(`CREATE INDEX idx_categories_parent_id ON categories (parent_id)`);
    await queryRunner.query(`ALTER TABLE categories ENABLE ROW LEVEL SECURITY`);
    await queryRunner.query(`
      CREATE POLICY tenant_isolation ON categories
        USING (tenant_id = current_setting('app.current_tenant', true)::UUID)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP POLICY IF EXISTS tenant_isolation ON categories`);
    await queryRunner.query(`DROP TABLE IF EXISTS categories`);
  }
}
