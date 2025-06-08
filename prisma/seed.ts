import { subMonths } from 'date-fns';
import { faker, tr } from '@faker-js/faker';
import { PrismaClient, TaskType } from '@prisma/client';

const prisma = new PrismaClient();

const generateRandomSKU = (prefix: string): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const randomPart = Array.from({ length: 6 }, () =>
    chars.charAt(Math.floor(Math.random() * chars.length)),
  ).join('');
  return `${prefix}-${randomPart}`;
};

async function populateUsers() {
  const users = [
    {
      name: 'Ekrem Jevric',
      email: 'ekrem-jevric@idol.com',
    },
    {
      name: 'Sasa Matic',
      email: 'sasa-matic@grand.com',
    },
    {
      name: 'Mile Lajkovac',
      email: 'mile@lajkovac.com',
    },
  ];
  await prisma.user.createMany({
    data: users,
  });
}

async function populateBrandsAndProducts() {
  // Brands → Categories → Subcategories → Products
  const brandNames = [
    'Braun',
    'Beko',
    'Vox',
    'Gorenje',
    'Bosch',
    'Philips',
    'Tefal',
    'ECG',
    'Rowenta',
    'Sencor',
  ];
  // Categories with subcategories
  const categoryData = {
    MDA: ['Washing Machines', 'Refrigerators', 'Ovens'],
    SDA: ['Toasters', 'Blenders', 'Vacuum Cleaners'],
    TV: ['LED TVs', 'OLED TVs', 'Smart TVs'],
    HVAC: ['Air Conditioners', 'Heaters', 'Ventilators'],
  };

  const brands = await Promise.all(
    brandNames.map((name) => prisma.brand.create({ data: { name } })),
  );

  for (const brand of brands) {
    const c = Object.keys(categoryData).map((name) =>
      prisma.category.create({
        data: {
          name,
          brand: {
            connect: {
              id: brand.id,
            },
          },
        },
      }),
    );
    const categories = await Promise.all(c);

    for (const category of categories) {
      const d = categoryData[
        category.name as 'MDA' | 'SDA' | 'TV' | 'HVAC'
      ] as string[];
      const subC = d.map((name: string) =>
        prisma.subcategory.create({
          data: {
            name,
            category: {
              connect: {
                id: category.id,
              },
            },
          },
        }),
      );
      const subcategories = await Promise.all(subC);

      for (const subCat of subcategories) {
        await Promise.all(
          Array.from({ length: 5 }).map((_, idx) => {
            return prisma.product.create({
              data: {
                name: `${subCat.name} Product ${idx + 1}`,
                subcategoryId: subCat.id,
                sku: generateRandomSKU(subCat.name.slice(0, 3).toUpperCase()),
              },
            });
          }),
        );
      }
    }
  }
}

async function populateRetailers() {
  const retailersData = [
    {
      name: 'Tehnomania',
      address: 'Leskovac',
    },
    {
      name: 'Tehnomania',
      address: 'Beograd',
    },
    {
      name: 'Tehnomania',
      address: 'Kraljevo',
    },
    {
      name: 'Gigatron',
      address: 'Leskovac',
    },
    {
      name: 'Gigatron',
      address: 'Beograd',
    },
    {
      name: 'Gigatron',
      address: 'Kraljevo',
    },
    {
      name: 'Uspon',
      address: 'Cacak',
    },
    {
      name: 'Uspon',
      address: 'Kragujevac',
    },
    {
      name: 'Gigatron',
      address: 'Kraljevo',
    },
  ];

  for (const retailer of retailersData) {
    await prisma.retailer.create({
      data: {
        name: retailer.name,
        address: retailer.address,
      },
    });
  }
}

async function populatePosForRetailer() {
  const retailers = await prisma.retailer.findMany();

  for (const retailer of retailers) {
    await prisma.pOS.create({
      data: {
        name: retailer.name,
        location: retailer.address,
        retailer: {
          connect: {
            id: retailer.id,
          },
        },
      },
    });
  }
}

async function populateSalesReports() {
  const products = await prisma.product.findMany();
  const posList = await prisma.pOS.findMany();
  const user = await prisma.user.findFirst();

  if (!user || posList.length === 0 || products.length === 0) {
    console.error('Missing user, POS, or products');
    return;
  }
  // Generate a report for each month
  for (let i = 0; i < 12; i++) {
    const reportDate = subMonths(new Date(2024, 11, 1), 11 - i); // Jan to Dec 2024
    for (const pos of posList) {
      await prisma.report.create({
        data: {
          userId: user.id,
          posId: pos.id,
          date: reportDate,
          tasks: {
            create: {
              type: TaskType.SALE_REPORT,
              submitted: true,
              data: products.map((product) => {
                const price = faker.number.float({ min: 10, max: 100 });
                const quantity = faker.number.int({ min: 5, max: 50 });
                return {
                  productSku: product.sku,
                  productName: product.name,
                  price,
                  quantity,
                  revenue: +(price * quantity).toFixed(2),
                };
              }),
            },
          },
        },
      });
    }
  }
}

async function populateStockStatusReport() {
  const products = await prisma.product.findMany();
  const posList = await prisma.pOS.findMany();
  const user = await prisma.user.findFirst();

  if (!user || posList.length === 0 || products.length === 0) {
    console.error('Missing user, POS, or products');
    return;
  }

  for (let i = 0; i < 12; i++) {
    const reportDate = subMonths(new Date(2024, 11, 1), 11 - i); // Jan to Dec 2024
    for (const pos of posList) {
      await prisma.report.create({
        data: {
          userId: user.id,
          posId: pos.id,
          date: reportDate,
          tasks: {
            create: {
              type: TaskType.STOCK_STATUS,
              submitted: true,
              data: products.map((product) => {
                const quantity = faker.number.int({ min: 5, max: 50 });
                return {
                  productSku: product.sku,
                  productName: product.name,
                  quantity,
                };
              }),
            },
          },
        },
      });
    }
  }
}

async function populateLineupSamplePlacementReport() {
  const allProducts = await prisma.product.findMany();
  const posList = await prisma.pOS.findMany();
  const user = await prisma.user.findFirst();

  for (const pos of posList) {
    // 1. Randomly select 10 products as the lineup
    const lineup = faker.helpers.arrayElements(allProducts, 10);
    const lineupProductSkus = lineup.map((p) => p.sku);

    // 2. Reported products: mix of lineup + randoms
    const randomProducts = faker.helpers.arrayElements(allProducts, 5);
    const reportedProducts = faker.helpers
      .shuffle([...lineup, ...randomProducts])
      .slice(0, faker.number.int({ min: 10, max: 20 }));
    const reportedProductSkus = reportedProducts.map((p) => p.sku);

    // 4. Create report + task
    await prisma.report.create({
      data: {
        posId: pos.id,
        date: faker.date.recent({ days: 30 }),
        userId: user!.id,
        tasks: {
          create: {
            type: TaskType.LINEUP_SAMPLE_PLACEMENT,
            data: {
              reported: reportedProductSkus,
              lineup: lineupProductSkus,
            },
          },
        },
      },
    });
  }
}

async function populateTradeMarketingActivityReport() {
  const activityTypes = ['stand', 'leaflet', 'screen', 'banner'];

  const allProducts = await prisma.product.findMany();
  const productSkus = allProducts.map((p) => p.sku);
  const brands = await prisma.brand.findMany();
  const posList = await prisma.pOS.findMany({ take: 2 });
  const user = await prisma.user.findFirst();

  for (let i = 0; i < 12; i++) {
    const date = new Date(2024, i, 1);

    for (const pos of posList) {
      await prisma.report.create({
        data: {
          date,
          posId: pos.id,
          userId: user!.id,
          tasks: {
            create: {
              type: TaskType.TRADE_MARKETING_ACTIVITY,
              data: faker.helpers.multiple(
                () => ({
                  type: faker.helpers.arrayElement(activityTypes),
                  brand: faker.helpers.arrayElement(brands),
                  isPresent: faker.datatype.boolean(),
                  productSku: faker.helpers.arrayElement(productSkus),
                }),
                { count: { min: 2, max: 5 } },
              ),
            },
          },
        },
      });
    }
  }
}

async function populateBrandShareReports() {
  const categories = await prisma.category.findMany({
    include: {
      brand: true,
      subcategories: {
        include: {
          products: true,
        },
      },
    },
  });
  const posList = await prisma.pOS.findMany();
  const user = await prisma.user.findFirst();

  if (!user || posList.length === 0 || categories.length === 0) {
    console.error('Missing user, POS, or category data');
    return;
  }

  for (let i = 0; i < 12; i++) {
    const reportDate = subMonths(new Date(2024, 11, 1), 11 - i); // Jan to Dec 2024
    for (const pos of posList) {
      const brandShareData: any[] = [];

      for (const category of categories) {
        for (const sub of category.subcategories) {
          const brandExposure = faker.number.int({ min: 10, max: 50 });

          // All products in the subcategory are assumed to belong to the same brand (via category)
          brandShareData.push({
            brand: category.brand.name,
            category: category.name,
            subcategory: sub.name,
            exposure: brandExposure,
          });
        }
      }

      await prisma.report.create({
        data: {
          userId: user.id,
          posId: pos.id,
          date: reportDate,
          tasks: {
            create: {
              type: TaskType.BRAND_SHARE,
              submitted: true,
              data: brandShareData,
            },
          },
        },
      });
    }
  }
}

async function main() {
  await populateUsers();
  await populateBrandsAndProducts();
  await populateRetailers();
  await populatePosForRetailer();
  await populateSalesReports();
  await populateStockStatusReport();
  await populateLineupSamplePlacementReport();
  await populateTradeMarketingActivityReport();
  await populateBrandShareReports();
}

main()
  .then(() => {
    console.log('Seeding completed.');
  })
  .catch((e) => {
    console.error('Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
