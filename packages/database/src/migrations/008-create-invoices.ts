import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateInvoices1700000008000 implements MigrationInterface {
  public readonly name = 'CreateInvoices1700000008000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TYPE invoice_status_enum AS ENUM ('draft', 'issued', 'sent', 'paid', 'overdue', 'cancelled')
    `);
    await queryRunner.query(`
      CREATE TABLE invoices (
        id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        tenant_id      UUID                 NOT NULL REFERENCES tenants (id) ON DELETE RESTRICT,
        invoice_number VARCHAR              NOT NULL,
        order_id       UUID                 NOT NULL REFERENCES orders  (id) ON DELETE RESTRICT,
        amount         DECIMAL(20, 4)       NOT NULL,
        currency       VARCHAR(3)           NOT NULL,
        due_date       TIMESTAMPTZ          NOT NULL,
        status         invoice_status_enum  NOT NULL DEFAULT 'draft',
        pdf_url        VARCHAR,
        created_at     TIMESTAMPTZ          NOT NULL DEFAULT NOW(),
        CONSTRAINT uq_invoices_invoice_number UNIQUE (invoice_number)
      )
    `);
    await queryRunner.query(`CREATE INDEX idx_invoices_tenant_id ON invoices (tenant_id)`);
    await queryRunner.query(`CREATE INDEX idx_invoices_order_id  ON invoices (order_id)`);
    await queryRunner.query(`CREATE INDEX idx_invoices_status    ON invoices (status)`);
    await queryRunner.query(`ALTER TABLE invoices ENABLE ROW LEVEL SECURITY`);
    await queryRunner.query(`
      CREATE POLICY tenant_isolation ON invoices
        USING (tenant_id = current_setting('app.current_tenant', true)::UUID)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP POLICY IF EXISTS tenant_isolation ON invoices`);
    await queryRunner.query(`DROP TABLE IF EXISTS invoices`);
    await queryRunner.query(`DROP TYPE IF EXISTS invoice_status_enum`);
  }
}
