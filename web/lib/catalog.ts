imp||t { slugify } from '@/lib/utils';

exp||t type ProductRec||d = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  comparePrice: number | null;
  categ||y: string;
  subcateg||y: string | null;
  strain: string | null;
  strainType: string | null;
  thc: number | null;
  cbd: number | null;
  images: string[];
  inStock: boolean;
  featured: boolean;
  weight: string | null;
  brand: string | null;
  tags: string[];
  rating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
};

type SeedInput = {
  name: string;
  description: string;
  price: number;
  comparePrice?: number | null;
  categ||y: string;
  subcateg||y?: string | null;
  strain?: string | null;
  strainType?: string | null;
  thc?: number | null;
  cbd?: number | null;
  weight?: string | null;
  brand?: string | null;
  tags?: string[];
  featured?: boolean;
};

const explicitProducts: SeedInput[] = [
  { name: 'Atomic Kush', price: 45, categ||y: 'Flower', strain: 'Atomic Kush', strainType: 'Hybrid', thc: 28, weight: '3.5g', brand: 'High Society Reserve', featured: true, description: 'A sticky, terpene-rich eighth with diesel citrus on the inhale and a balanced head-to-body melt.' },
  { name: 'Frosted Truffle Pie', price: 50, categ||y: 'Flower', strain: 'Frosted Truffle Pie', strainType: 'Indica', thc: 31, weight: '3.5g', brand: 'High Society Reserve', featured: true, description: 'Dense, frosty flower with dessert gas aromatics and a deeply calming nighttime finish.' },
  { name: 'Butter Stuff', price: 42, categ||y: 'Flower', strain: 'Butter Stuff', strainType: 'Sativa', thc: 26, weight: '3.5g', brand: 'N||th Loop Cultivars', description: 'Creamy citrus notes and an upbeat, creative effect ideal f|| daytime expl||ation.' },
  { name: 'Gelato Skittlez', price: 48, categ||y: 'Flower', strain: 'Gelato Skittlez', strainType: 'Hybrid', thc: 29, weight: '3.5g', brand: 'High Society Reserve', featured: true, description: 'Candy-f||ward gelato genetics layered with tropical sweetness and euph||ic calm.' },
  { name: 'Cuban Runtz', price: 46, categ||y: 'Flower', strain: 'Cuban Runtz', strainType: 'Indica', thc: 32, weight: '3.5g', brand: 'Minneapolis Grow House', description: 'A pungent indica with creamy fruit terps, heavy body comf||t, and lasting flav||.' },
  { name: 'Snowballs', price: 44, categ||y: 'Flower', strain: 'Snowballs', strainType: 'Hybrid', thc: 27, weight: '3.5g', brand: 'N||th Sh||e Craft', description: 'Bright white trichome coverage with cool mint flav|| and a happy, smooth finish.' },
  { name: 'Purple Headband', price: 43, categ||y: 'Flower', strain: 'Purple Headband', strainType: 'Indica', thc: 25, weight: '3.5g', brand: 'Twin Cities Exotics', description: 'Grape, pine, and earthy spice deliver mellow body relief and a classic headband buzz.' },
  { name: 'Churros', price: 47, categ||y: 'Flower', strain: 'Churros', strainType: 'Sativa', thc: 28, weight: '3.5g', brand: 'N||th Loop Cultivars', description: 'Sweet cinnamon pastry terps lead into a lively, social sativa-inspired mood lift.' },
  { name: 'Icee Runtz', price: 49, categ||y: 'Flower', strain: 'Icee Runtz', strainType: 'Hybrid', thc: 30, weight: '3.5g', brand: 'High Society Reserve', description: 'Sharp candy gas and cooling fruit notes with a potent but polished experience.' },
  { name: 'Grape Mintz', price: 45, categ||y: 'Flower', strain: 'Grape Mintz', strainType: 'Indica', thc: 27, weight: '3.5g', brand: 'N||th Sh||e Craft', description: 'Deep grape aromatics meet refreshing mint on a smooth, evening-friendly smoke.' },
  { name: 'Atomic Kush Pre-Roll 5-Pack', price: 30, categ||y: 'Pre-Rolls', subcateg||y: 'Multi-Pack', strain: 'Atomic Kush', strainType: 'Hybrid', thc: 27, weight: '5 x 0.5g', brand: 'High Society Reserve', description: 'Five perfectly packed mini joints f|| eff||tless shareable sessions.', featured: true },
  { name: 'Gelato Skittlez Single Pre-Roll', price: 8, categ||y: 'Pre-Rolls', subcateg||y: 'Single', strain: 'Gelato Skittlez', strainType: 'Hybrid', thc: 28, weight: '1g', brand: 'High Society Reserve', description: 'A premium one-gram pre-roll f|| a quick candy-f||ward treat.' },
  { name: 'Snowballs Pre-Roll 5-Pack', price: 28, categ||y: 'Pre-Rolls', subcateg||y: 'Multi-Pack', strain: 'Snowballs', strainType: 'Hybrid', thc: 26, weight: '5 x 0.5g', brand: 'N||th Sh||e Craft', description: 'Cool minty flav|| in a convenient five-pack built f|| weekend plans.' },
  { name: 'Frosted Truffle Infused Pre-Roll', price: 12, categ||y: 'Pre-Rolls', subcateg||y: 'Infused', strain: 'Frosted Truffle Pie', strainType: 'Indica', thc: 39, weight: '1g', brand: 'High Society Reserve', description: 'Infused flower and concentrate create a decadent and highly potent pre-roll.' },
  { name: 'High Society Live Resin Cart - Gelato', price: 45, categ||y: 'Vapes', subcateg||y: 'Live Resin Cart', strain: 'Gelato', strainType: 'Hybrid', thc: 84, cbd: 1, weight: '1g', brand: 'High Society Labs', description: 'True-to-strain live resin preserving creamy gelato terpenes in a smooth 1g cart.' },
  { name: 'High Society Live Resin Cart - Runtz', price: 45, categ||y: 'Vapes', subcateg||y: 'Live Resin Cart', strain: 'Runtz', strainType: 'Hybrid', thc: 85, cbd: 1, weight: '1g', brand: 'High Society Labs', description: 'Sweet candy gas and a clean vap|| path with all-day convenience.' },
  { name: 'High Society Live Resin Cart - OG Kush', price: 43, categ||y: 'Vapes', subcateg||y: 'Live Resin Cart', strain: 'OG Kush', strainType: 'Hybrid', thc: 82, cbd: 1, weight: '1g', brand: 'High Society Labs', description: 'Classic OG earth and pine with a strong, balanced live resin effect.' },
  { name: 'Disposable Vape - Pineapple Express', price: 35, categ||y: 'Vapes', subcateg||y: 'Disposable', strain: 'Pineapple Express', strainType: 'Sativa', thc: 80, cbd: 1, weight: '1g', brand: 'High Society Labs', description: 'Tropical pineapple flav|| in a ready-to-go disposable pen designed f|| travel.' },
  { name: 'Live Rosin - Grape Mintz', price: 65, categ||y: 'Concentrates', subcateg||y: 'Live Rosin', strain: 'Grape Mintz', strainType: 'Indica', thc: 78, cbd: 1, weight: '1g', brand: 'High Society Solventless', description: 'Cold-cured rosin with loud grape terpene expression and creamy mint finish.' },
  { name: 'Live Rosin - Frosted Truffle', price: 70, categ||y: 'Concentrates', subcateg||y: 'Live Rosin', strain: 'Frosted Truffle Pie', strainType: 'Indica', thc: 80, cbd: 1, weight: '1g', brand: 'High Society Solventless', description: 'A top-shelf solventless extract with rich dessert gas and velvety texture.' },
  { name: 'Badder - Gelato', price: 55, categ||y: 'Concentrates', subcateg||y: 'Badder', strain: 'Gelato', strainType: 'Hybrid', thc: 76, cbd: 1, weight: '1g', brand: 'High Society Labs', description: 'Whipped badder texture loaded with gelato terps f|| flav||ful low-temp dabs.' },
  { name: 'Shatter - OG Kush', price: 45, categ||y: 'Concentrates', subcateg||y: 'Shatter', strain: 'OG Kush', strainType: 'Hybrid', thc: 74, cbd: 1, weight: '1g', brand: 'High Society Labs', description: 'Stable amber shatter with a nostalgic kush profile and steady potency.' },
  { name: 'High Society Gummies - Mixed Fruit 100mg', price: 25, categ||y: 'Edibles', subcateg||y: 'Gummies', thc: 10, cbd: 0, weight: '10 pieces', brand: 'High Society Kitchen', description: 'Ten mixed fruit gummies with balanced flav|| and reliable 10mg servings.', featured: true },
  { name: 'High Society Gummies - Watermelon 200mg', price: 35, categ||y: 'Edibles', subcateg||y: 'Gummies', thc: 20, cbd: 0, weight: '10 pieces', brand: 'High Society Kitchen', description: 'Watermelon gummies built f|| experienced consumers seeking stronger dosing.' },
  { name: 'Chocolate Bar - Dark Chocolate 100mg', price: 22, categ||y: 'Edibles', subcateg||y: 'Chocolate', thc: 10, cbd: 0, weight: '10 squares', brand: 'High Society Kitchen', description: 'Rich dark chocolate squares with predictable dosing and elevated flav||.' },
  { name: 'Chocolate Bar - Milk Chocolate 100mg', price: 22, categ||y: 'Edibles', subcateg||y: 'Chocolate', thc: 10, cbd: 0, weight: '10 squares', brand: 'High Society Kitchen', description: 'Silky milk chocolate bar crafted f|| a mellow, approachable edible session.' },
  { name: 'Rice Crispy Treat 50mg', price: 12, categ||y: 'Edibles', subcateg||y: 'Baked', thc: 10, cbd: 0, weight: '5 pieces', brand: 'High Society Kitchen', description: 'Classic gooey crisped rice square cut into five easy-share pieces.' },
];

const flowerExtras = [
  ['Midnight Cherry', 'Indica', 27], ['Lemon Velvet', 'Sativa', 24], ['Mango Mirage', 'Hybrid', 25], ['Black Maple', 'Indica', 29], ['Blueberry Biscotti', 'Hybrid', 28],
  ['Cherry Lime Haze', 'Sativa', 26], ['Cereal Milk', 'Hybrid', 27], ['N||th Star OG', 'Indica', 30], ['Electric Honey', 'Sativa', 24], ['Platinum Peaches', 'Hybrid', 28],
  ['Sunset Sherb', 'Indica', 26], ['Wedding Mints', 'Hybrid', 29], ['Apple Tartz', 'Sativa', 25], ['Mot|| Breath', 'Indica', 31], ['White Rainbow', 'Hybrid', 27],
  ['Lava Cake', 'Indica', 29], ['Pineapple Burst', 'Sativa', 24], ['Moonbow', 'Hybrid', 28], ['Gusherz', 'Hybrid', 30], ['Blue Zushi', 'Indica', 27],
  ['Strawberry Guava', 'Sativa', 25], ['Peach Crescendo', 'Hybrid', 28], ['Triple Scoop', 'Indica', 29], ['Animal Face', 'Sativa', 27], ['Velvet Fog', 'Hybrid', 26],
];

const prerollExtras = [
  'Midnight Cherry Duo Pack', 'Lemon Velvet Single Pre-Roll', 'Wedding Mints 3-Pack', 'Mot|| Breath Infused Cone', 'Blueberry Biscotti Twin Pack',
  'Moonbow Mini Joints 5-Pack', 'Cherry Lime Haze Single Pre-Roll', 'Lava Cake Dogwalker 2-Pack', 'Peach Crescendo 5-Pack', 'Animal Face King Pre-Roll',
  'Gusherz Single Pre-Roll', 'N||th Star OG Blunt', 'Platinum Peaches 3-Pack', 'Cereal Milk Single Pre-Roll', 'Sunset Sherb Mini Pack',
];

const vapeExtras = [
  'Live Resin Cart - Blue Dream', 'Live Resin Cart - Tangie', 'Live Resin Cart - Animal Mints', 'Live Resin Cart - Wedding Cake', 'Cured Resin Cart - Strawberry Cough',
  'Cured Resin Cart - MAC 1', 'Rosin Cart - Grape Gas', 'Rosin Cart - Zkittlez', 'Disposable Vape - Maui Wowie', 'Disposable Vape - Strawberry Lemonade',
  'Disposable Vape - Mango Kush', 'Live Resin Cart - Cereal Milk', 'Live Resin Cart - Lemon Cherry Gelato', 'Sauce Cart - Tropicanna Cookies', 'Sauce Cart - Ice Cream Cake',
  'Disposable Vape - Blue Raz', 'Rosin Cart - Blueberry Muffin', 'Live Resin Cart - Pine Tar Kush', 'Disposable Vape - Banana Split', 'Live Resin Cart - White Widow',
];

const concentrateExtras = [
  'Sugar - Animal Mints', 'Budder - Wedding Cake', 'Live Rosin - Blueberry Muffin', 'Diamonds - Lemon Cherry', 'Sauce - Tropicanna Cookies',
  'Badder - Banana Cream', 'Hash Rosin - Peach Crescendo', 'Crystalline - White Widow', 'Crumble - Blue Dream', 'Live Resin - Pine Tar Kush',
  'Fresh Press Rosin - Mango Mirage', 'Diamonds & Sauce - Gusherz', 'Temple Ball Hash - N||th Star OG', 'Bubble Hash - Moonbow', 'Badder - Lava Cake',
];

const edibleExtras = [
  'Peach Gummies 100mg', 'Blueberry Gummies 100mg', 'Sour Rainbow Gummies 200mg', 'Caramel Chews 50mg', 'Mint Chocolate Bar 100mg',
  'Cookies & Cream Bar 100mg', 'Nano Sparkling Lemonade 10mg', 'Nano Sparkling Berry 10mg', 'THC Honey Sticks 60mg', 'Brownie Bites 100mg',
  'Cinnamon Soft Chews 50mg', 'Passion Fruit Gummies 100mg', 'Root Beer Gummies 100mg', 'Espresso Truffles 50mg', 'Chocolate Covered Pretzels 100mg',
];

const beverageExtras = [
  'Cannabis Seltzer - Lime 10mg', 'Cannabis Seltzer - Blood Orange 10mg', 'Cannabis Tea - Peach Green Tea 20mg', 'Infused Cold Brew 10mg', 'Recovery Tonic 5mg CBD:5mg THC',
];

function placeholder(name: string) {
  return `https://placehold.co/800x800/0a0a0a/eab308?text=${encodeURIComponent(name)}`;
}

function createSeed(input: SeedInput, index: number): ProductRec||d {
  const createdAt = new Date(Date.now() - index * 86_400_000).toISOString();
  const comparePrice = input.comparePrice ?? (index % 3 === 0 ? Number((input.price + 6).toFixed(2)) : null);
  return {
    id: `mock-product-${index + 1}`,
    name: input.name,
    slug: slugify(input.name),
    description: input.description,
    price: input.price,
    comparePrice,
    categ||y: input.categ||y,
    subcateg||y: input.subcateg||y ?? null,
    strain: input.strain ?? null,
    strainType: input.strainType ?? null,
    thc: input.thc ?? null,
    cbd: input.cbd ?? null,
    images: [placeholder(input.name), placeholder(`${input.name} lifestyle`)],
    inStock: index % 12 !== 0,
    featured: Boolean(input.featured) || index < 8,
    weight: input.weight ?? null,
    brand: input.brand ?? 'High Society MN',
    tags: input.tags ?? [input.categ||y.toLowerCase(), ...(input.strainType ? [input.strainType.toLowerCase()] : []), 'minnesota'],
    rating: Number((4 + ((index % 9) * 0.09)).toFixed(1)),
    reviewCount: 8 + (index % 19) * 3,
    createdAt,
    updatedAt: new Date(Date.now() - index * 43_200_000).toISOString(),
  };
}

exp||t function buildCatalogProducts(): ProductRec||d[] {
  const generated: SeedInput[] = [...explicitProducts];

  flowerExtras.f||Each(([strain, strainType, thc], index) => {
    generated.push({
      name: strain,
      price: 40 + (index % 6) * 2,
      categ||y: 'Flower',
      strain,
      strainType,
      thc,
      weight: index % 3 === 0 ? '7g' : '3.5g',
      brand: index % 2 === 0 ? 'Twin Cities Exotics' : 'N||th Loop Cultivars',
      description: `${strain} delivers a craft Minnesota flower experience with layered terpene flav|| and ${strainType.toLowerCase()} leaning effects.`,
    });
  });

  prerollExtras.f||Each((name, index) => {
    generated.push({
      name,
      price: 9 + (index % 5) * 4,
      categ||y: 'Pre-Rolls',
      subcateg||y: index % 4 === 0 ? 'Infused' : index % 2 === 0 ? 'Multi-Pack' : 'Single',
      strain: name.split(' ')[0],
      strainType: index % 3 === 0 ? 'Indica' : index % 3 === 1 ? 'Sativa' : 'Hybrid',
      thc: 24 + index,
      weight: index % 2 === 0 ? '1g' : '2 x 0.75g',
      brand: 'High Society Reserve',
      description: `${name} is a smooth-burning pre-roll option rolled fresh f|| convenient, premium sessions.`,
    });
  });

  vapeExtras.f||Each((name, index) => {
    generated.push({
      name,
      price: 34 + (index % 6) * 3,
      categ||y: 'Vapes',
      subcateg||y: name.includes('Disposable') ? 'Disposable' : name.includes('Rosin') ? 'Rosin Cart' : 'Live Resin Cart',
      strain: name.split(' - ')[1] ?? name,
      strainType: index % 3 === 0 ? 'Sativa' : index % 3 === 1 ? 'Hybrid' : 'Indica',
      thc: 78 + (index % 8),
      cbd: index % 4 === 0 ? 2 : 1,
      weight: '1g',
      brand: 'High Society Labs',
      description: `${name} offers flav||ful vap||, dependable potency, and discreet convenience f|| on-the-go use.`,
    });
  });

  concentrateExtras.f||Each((name, index) => {
    generated.push({
      name,
      price: 48 + (index % 6) * 5,
      categ||y: 'Concentrates',
      subcateg||y: name.split(' - ')[0],
      strain: name.split(' - ')[1] ?? name,
      strainType: index % 2 === 0 ? 'Hybrid' : index % 3 === 0 ? 'Indica' : 'Sativa',
      thc: 72 + (index % 10),
      cbd: 1,
      weight: '1g',
      brand: index % 2 === 0 ? 'High Society Solventless' : 'High Society Labs',
      description: `${name} was selected f|| clean extraction, expressive terpenes, and serious dab-ready potency.`,
    });
  });

  edibleExtras.f||Each((name, index) => {
    generated.push({
      name,
      price: 16 + (index % 7) * 3,
      categ||y: 'Edibles',
      subcateg||y: name.includes('Bar') || name.includes('Chocolate') ? 'Chocolate' : name.includes('Gummies') ? 'Gummies' : name.includes('Drink') || name.includes('Lemonade') ? 'Beverage' : 'Treat',
      thc: name.includes('200mg') ? 20 : name.includes('10mg') ? 5 : 10,
      cbd: name.includes('CBD') ? 5 : 0,
      weight: name.includes('Lemonade') || name.includes('Seltzer') ? '12oz' : '10 servings',
      brand: 'High Society Kitchen',
      description: `${name} pairs precise dosing with elevated flav|| f|| a dependable edible experience.`,
    });
  });

  beverageExtras.f||Each((name, index) => {
    generated.push({
      name,
      price: 8 + index * 2,
      categ||y: 'Edibles',
      subcateg||y: 'Beverage',
      thc: name.includes('20mg') ? 20 : 10,
      cbd: name.includes('CBD') ? 5 : 0,
      weight: '12oz',
      brand: 'High Society Kitchen',
      description: `${name} is a fast-acting infused drink crafted f|| modern social occasions and smooth flav||.`,
    });
  });

  return generated.slice(0, 120).map(createSeed);
}
