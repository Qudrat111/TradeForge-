import { DataSource } from 'typeorm';
import { ProductEntity } from '../entities/product.entity';
import { CategoryEntity } from '../entities/category.entity';
import { TenantEntity } from '../entities/tenant.entity';
import { ProductStatus } from '@tradeforge/common';

export async function seedProducts(
  dataSource: DataSource,
  tenants: TenantEntity[],
): Promise<void> {
  const productRepo = dataSource.getRepository(ProductEntity);
  const categoryRepo = dataSource.getRepository(CategoryEntity);

  const supplierTenant = tenants.find((t) => t.slug === 'global-supplies');
  if (!supplierTenant) {
    throw new Error('Supplier tenant not found. Run tenant seed first.');
  }

  let category = await categoryRepo.findOne({
    where: { tenantId: supplierTenant.id, slug: 'industrial-components' },
  });
  if (!category) {
    category = categoryRepo.create({
      tenantId: supplierTenant.id,
      name: { en: 'Industrial Components', de: 'Industrielle Komponenten' },
      slug: 'industrial-components',
      parentId: null,
    });
    category = await categoryRepo.save(category);
  }

  const productsData: Partial<ProductEntity>[] = [
    {
      tenantId: supplierTenant.id,
      sku: 'BOLT-M8-SS-001',
      name: { en: 'Stainless Steel Bolt M8', de: 'Edelstahlschraube M8' },
      description: { en: 'High-grade stainless steel bolt, M8 x 25mm', de: 'Hochwertige Edelstahlschraube M8 x 25mm' },
      categoryId: category.id,
      prices: [
        { currency: 'EUR', amount: 0.45, minQuantity: 1000 },
        { currency: 'EUR', amount: 0.38, minQuantity: 5000 },
        { currency: 'USD', amount: 0.49, minQuantity: 1000 },
      ],
      hsCode: '7318.15',
      moq: 1000,
      leadTimeDays: 14,
      status: ProductStatus.ACTIVE,
      metadata: { material: 'A2 stainless steel', standard: 'DIN 933' },
    },
    {
      tenantId: supplierTenant.id,
      sku: 'NUT-M8-SS-001',
      name: { en: 'Stainless Steel Nut M8', de: 'Edelstahlmutter M8' },
      description: { en: 'Hex nut M8 stainless steel', de: 'Sechskantmutter M8 Edelstahl' },
      categoryId: category.id,
      prices: [
        { currency: 'EUR', amount: 0.22, minQuantity: 1000 },
        { currency: 'EUR', amount: 0.18, minQuantity: 5000 },
      ],
      hsCode: '7318.16',
      moq: 1000,
      leadTimeDays: 14,
      status: ProductStatus.ACTIVE,
      metadata: { material: 'A2 stainless steel', standard: 'DIN 934' },
    },
    {
      tenantId: supplierTenant.id,
      sku: 'WASHER-M8-SS-001',
      name: { en: 'Stainless Steel Washer M8', de: 'Edelstahlscheibe M8' },
      description: { en: 'Flat washer M8 stainless steel', de: 'Flache Unterlegscheibe M8 Edelstahl' },
      categoryId: category.id,
      prices: [
        { currency: 'EUR', amount: 0.08, minQuantity: 2000 },
        { currency: 'EUR', amount: 0.06, minQuantity: 10000 },
      ],
      hsCode: '7318.22',
      moq: 2000,
      leadTimeDays: 10,
      status: ProductStatus.ACTIVE,
      metadata: { material: 'A2 stainless steel', standard: 'DIN 125' },
    },
    {
      tenantId: supplierTenant.id,
      sku: 'BEARING-6205-2RS',
      name: { en: 'Deep Groove Ball Bearing 6205-2RS', de: 'Rillenkugellager 6205-2RS' },
      description: { en: 'Single row deep groove ball bearing, sealed', de: 'Einreihiges Rillenkugellager, abgedichtet' },
      categoryId: category.id,
      prices: [
        { currency: 'EUR', amount: 3.20, minQuantity: 50 },
        { currency: 'EUR', amount: 2.85, minQuantity: 200 },
        { currency: 'EUR', amount: 2.50, minQuantity: 500 },
      ],
      hsCode: '8482.10',
      moq: 50,
      leadTimeDays: 21,
      status: ProductStatus.ACTIVE,
      metadata: { bore: '25mm', outerDiameter: '52mm', width: '15mm' },
    },
    {
      tenantId: supplierTenant.id,
      sku: 'SEAL-OIL-40X55X8',
      name: { en: 'Oil Seal 40x55x8mm', de: 'Öldichtung 40x55x8mm' },
      description: { en: 'Rotary shaft oil seal 40x55x8mm NBR', de: 'Wellendichtring 40x55x8mm NBR' },
      categoryId: category.id,
      prices: [
        { currency: 'EUR', amount: 1.85, minQuantity: 100 },
        { currency: 'EUR', amount: 1.55, minQuantity: 500 },
      ],
      hsCode: '4016.93',
      moq: 100,
      leadTimeDays: 18,
      status: ProductStatus.ACTIVE,
      metadata: { material: 'NBR', innerDiameter: '40mm', outerDiameter: '55mm', width: '8mm' },
    },
    {
      tenantId: supplierTenant.id,
      sku: 'PIPE-SS-1IN-SCH40',
      name: { en: 'Stainless Steel Pipe 1" SCH40', de: 'Edelstahlrohr 1" SCH40' },
      description: { en: '316L stainless steel pipe 1 inch SCH40', de: '316L Edelstahlrohr 1 Zoll SCH40' },
      categoryId: category.id,
      prices: [
        { currency: 'EUR', amount: 28.50, minQuantity: 10 },
        { currency: 'EUR', amount: 25.00, minQuantity: 50 },
      ],
      hsCode: '7304.41',
      moq: 10,
      leadTimeDays: 30,
      status: ProductStatus.ACTIVE,
      metadata: { material: '316L', schedule: 'SCH40', length: '6m' },
    },
    {
      tenantId: supplierTenant.id,
      sku: 'VALVE-BALL-1IN-SS',
      name: { en: 'Ball Valve 1" Stainless Steel', de: 'Kugelhahn 1" Edelstahl' },
      description: { en: 'Full bore ball valve DN25 stainless steel', de: 'Vollbohrungskugelhahn DN25 Edelstahl' },
      categoryId: category.id,
      prices: [
        { currency: 'EUR', amount: 42.00, minQuantity: 5 },
        { currency: 'EUR', amount: 36.00, minQuantity: 25 },
        { currency: 'EUR', amount: 30.00, minQuantity: 100 },
      ],
      hsCode: '8481.20',
      moq: 5,
      leadTimeDays: 21,
      status: ProductStatus.ACTIVE,
      metadata: { material: '316 stainless steel', pressure: 'PN40', DN: '25' },
    },
    {
      tenantId: supplierTenant.id,
      sku: 'MOTOR-IE3-4KW',
      name: { en: 'IE3 Electric Motor 4kW', de: 'IE3 Elektromotor 4kW' },
      description: { en: 'Three-phase induction motor 4kW 1450rpm IE3', de: 'Drehstrom-Asynchronmotor 4kW 1450rpm IE3' },
      categoryId: category.id,
      prices: [
        { currency: 'EUR', amount: 385.00, minQuantity: 1 },
        { currency: 'EUR', amount: 345.00, minQuantity: 5 },
        { currency: 'EUR', amount: 310.00, minQuantity: 20 },
      ],
      hsCode: '8501.52',
      moq: 1,
      leadTimeDays: 28,
      status: ProductStatus.ACTIVE,
      metadata: { power: '4kW', speed: '1450rpm', efficiency: 'IE3', frame: 'B3' },
    },
    {
      tenantId: supplierTenant.id,
      sku: 'PUMP-CENTRIFUGAL-5M3',
      name: { en: 'Centrifugal Pump 5m³/h', de: 'Kreiselpumpe 5m³/h' },
      description: { en: 'Stainless steel centrifugal pump 5m³/h 20m head', de: 'Kreiselpumpe Edelstahl 5m³/h 20m Förderhöhe' },
      categoryId: category.id,
      prices: [
        { currency: 'EUR', amount: 620.00, minQuantity: 1 },
        { currency: 'EUR', amount: 570.00, minQuantity: 3 },
      ],
      hsCode: '8413.70',
      moq: 1,
      leadTimeDays: 35,
      status: ProductStatus.ACTIVE,
      metadata: { flow: '5m3/h', head: '20m', material: '316L', power: '0.75kW' },
    },
    {
      tenantId: supplierTenant.id,
      sku: 'GASKET-SPIRAL-DN50',
      name: { en: 'Spiral Wound Gasket DN50', de: 'Spiralgewickelte Dichtung DN50' },
      description: { en: 'Spiral wound gasket DN50 PN16 SS316/graphite', de: 'Spiralgewickelte Dichtung DN50 PN16 SS316/Graphit' },
      categoryId: category.id,
      prices: [
        { currency: 'EUR', amount: 8.50, minQuantity: 20 },
        { currency: 'EUR', amount: 7.20, minQuantity: 100 },
      ],
      hsCode: '8484.10',
      moq: 20,
      leadTimeDays: 14,
      status: ProductStatus.DRAFT,
      metadata: { DN: '50', PN: '16', filler: 'graphite', winding: 'SS316' },
    },
  ];

  let seededCount = 0;
  for (const data of productsData) {
    const existing = await productRepo.findOne({
      where: { tenantId: supplierTenant.id, sku: data.sku as string },
    });
    if (!existing) {
      const entity = productRepo.create(data);
      await productRepo.save(entity);
      seededCount++;
    }
  }

  console.log(`Seeded ${seededCount} products`);
}
