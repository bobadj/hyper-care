import { subMonths } from 'date-fns';
import { faker } from '@faker-js/faker';
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

    // 3. Calculate metrics (for optional logging)
    // const intersectionCount = reportedProductSkus.filter((id) =>
    //   lineupProductSkus.includes(id),
    // ).length;
    // const samplePlacement = reportedProductSkus.length / lineup.length;
    // const lineupSamplePlacement = intersectionCount / lineup.length;

    // console.log(`POS: ${pos.name}`);
    // console.log(`Sample Placement: ${(samplePlacement * 100).toFixed(2)}%`);
    // console.log(
    //   `Lineup Sample Placement: ${(lineupSamplePlacement * 100).toFixed(2)}%`,
    // );

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

async function main() {
  await populateUsers();
  await populateBrandsAndProducts();
  await populateRetailers();
  await populatePosForRetailer();
  await populateSalesReports();
  await populateStockStatusReport();
  await populateLineupSamplePlacementReport();
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
