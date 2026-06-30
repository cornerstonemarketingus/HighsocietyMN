/* eslint-disable @typescript-eslint/no-require-imports */
const { PrismaClient, Category } = require('@prisma/client');

const prisma = new PrismaClient();

const categoryNames = {
  FLOWER: ['Northern Lights', 'Blue Dream', 'Gelato', 'Wedding Cake', 'Pineapple Express'],
  EDIBLES: ['Gummy Bites', 'Dark Chocolate', 'Caramel Chews', 'Fruit Drops', 'Mint Tablets'],
  VAPES: ['Live Resin Cart', 'Rosin Pod', 'Sativa Cartridge', 'Indica Cartridge', 'Hybrid Cartridge'],
  CONCENTRATES: ['Live Rosin', 'Wax Crumble', 'Shatter', 'Badder', 'Hash Rosin'],
  ACCESSORIES: ['Premium Grinder', 'Glass Pipe', 'Storage Jar', 'Rolling Tray', 'Hemp Cones'],
};

const terpeneSets = [
  ['Myrcene', 'Limonene', 'Pinene'],
  ['Caryophyllene', 'Linalool', 'Humulene'],
  ['Terpinolene', 'Ocimene', 'Bisabolol'],
  ['Limonene', 'Caryophyllene', 'Myrcene'],
];

const effectsSets = [
  ['Relaxed', 'Happy', 'Calm'],
  ['Euphoric', 'Creative', 'Uplifted'],
  ['Focused', 'Clear', 'Balanced'],
  ['Sleepy', 'Body High', 'Mellow'],
];

function randomFrom(arr, idx) {
  return arr[idx % arr.length];
}

async function main() {
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.review.deleteMany();
  await prisma.product.deleteMany();

  const categories = Object.values(Category);
  const products = [];

  for (let i = 0; i < 60; i += 1) {
    const category = categories[i % categories.length];
    const baseName = randomFrom(categoryNames[category], i);
    const product = await prisma.product.create({
      data: {
        name: `${baseName} ${i + 1}`,
        description: `Craft ${category.toLowerCase()} product with premium quality and compliance-friendly messaging for adult consumers.`,
        category,
        priceCents: 1500 + (i % 12) * 500,
        thcPercent: Number((5 + (i % 24) * 1.4).toFixed(1)),
        cbdPercent: Number((0.1 + (i % 10) * 0.3).toFixed(1)),
        terpeneProfile: randomFrom(terpeneSets, i),
        effects: randomFrom(effectsSets, i),
        images: [
          `https://picsum.photos/seed/hsmn-${i}-1/800/800`,
          `https://picsum.photos/seed/hsmn-${i}-2/800/800`,
          `https://picsum.photos/seed/hsmn-${i}-3/800/800`,
        ],
        stock: (i * 3) % 25,
        createdAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000),
      },
    });

    products.push(product);
  }

  for (let i = 0; i < products.length; i += 1) {
    const product = products[i];
    await prisma.review.createMany({
      data: [
        {
          productId: product.id,
          author: `Verified Guest ${i + 1}`,
          rating: 4 + (i % 2),
          comment: 'Great quality, smooth experience, and clear labeling.',
        },
        {
          productId: product.id,
          author: `Local Customer ${i + 1}`,
          rating: 3 + (i % 3),
          comment: 'Consistent effects and premium presentation.',
        },
      ],
    });
  }

  console.log(`Seeded ${products.length} products with reviews.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
