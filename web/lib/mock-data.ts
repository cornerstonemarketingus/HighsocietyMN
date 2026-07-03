import { buildCatalogProducts, type ProductRecord } from '@/lib/catalog';
import { calculateTax } from '@/lib/utils';

export type ReviewRecord = {
  id: string;
  userName: string;
  rating: number;
  title: string;
  body: string;
  createdAt: string;
};

export type ForumCommentRecord = {
  id: string;
  userName: string;
  body: string;
  likes: number;
  createdAt: string;
};

export type ForumPostRecord = {
  id: string;
  userName: string;
  title: string;
  body: string;
  category: string;
  likes: number;
  createdAt: string;
  comments: ForumCommentRecord[];
};

export type BlogPostRecord = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  category: string;
  tags: string[];
  imageUrl: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
};

export type OrderRecord = {
  id: string;
  status: string;
  subtotal: number;
  tax: number;
  total: number;
  fulfillmentType: string;
  scheduledTime: string;
  createdAt: string;
  items: Array<{ productId: string; productName: string; quantity: number; price: number }>;
};

export type LoyaltyRecord = {
  memberName: string;
  points: number;
  tier: string;
  nextRewardAt: number;
  perks: string[];
  leaderboard: Array<{ name: string; points: number }>;
};

export type ReferralRecord = {
  code: string;
  referrals: number;
  rewardsEarned: number;
  pendingRewards: number;
};

export const mockProducts: ProductRecord[] = buildCatalogProducts();

export const mockReviews: Record<string, ReviewRecord[]> = Object.fromEntries(
  mockProducts.slice(0, 18).map((product, index) => [
    product.slug,
    [
      {
        id: `${product.id}-review-1`,
        userName: 'Jordan M.',
        rating: 5,
        title: 'Exactly what I hoped for',
        body: `${product.name} arrived fresh and flavorful. The staff recommendation was spot-on for my evening routine.`,
        createdAt: new Date(Date.now() - (index + 1) * 86_400_000).toISOString(),
      },
      {
        id: `${product.id}-review-2`,
        userName: 'Taylor S.',
        rating: 4,
        title: 'Great value',
        body: 'Excellent potency, clean presentation, and a smooth checkout experience from order to pickup.',
        createdAt: new Date(Date.now() - (index + 2) * 172_800_000).toISOString(),
      },
    ],
  ]),
);

export const mockForumPosts: ForumPostRecord[] = [
  {
    id: 'forum-1',
    userName: 'NorthLoopNate',
    title: 'Best strains for a winter movie night?',
    body: 'Looking for a cozy indica or hybrid that hits smooth and pairs well with an at-home theater setup. What is everyone loving lately?',
    category: 'Reviews',
    likes: 34,
    createdAt: new Date(Date.now() - 2 * 86_400_000).toISOString(),
    comments: [
      { id: 'forum-1-comment-1', userName: 'MplsMia', body: 'Frosted Truffle Pie all day. Heavy dessert flavor and total couch-mode.', likes: 12, createdAt: new Date(Date.now() - 86_400_000).toISOString() },
      { id: 'forum-1-comment-2', userName: 'LakeStreetLeo', body: 'Cuban Runtz if you want a little more potency.', likes: 7, createdAt: new Date(Date.now() - 70_000_000).toISOString() },
    ],
  },
  {
    id: 'forum-2',
    userName: 'GreenThumbMN',
    title: 'Terpene-rich carts that actually taste like flower',
    body: 'I have been chasing carts that stay true to the cultivar instead of tasting overly sweet. Any standouts from the current menu?',
    category: 'General',
    likes: 21,
    createdAt: new Date(Date.now() - 4 * 86_400_000).toISOString(),
    comments: [
      { id: 'forum-2-comment-1', userName: 'RosinRae', body: 'The Gelato live resin cart is super clean and creamy.', likes: 10, createdAt: new Date(Date.now() - 3 * 86_400_000).toISOString() },
    ],
  },
  {
    id: 'forum-3',
    userName: 'StPaulSage',
    title: 'Anyone going to the local advocacy event this weekend?',
    body: 'Would love to organize a meet-up for fellow High Society members before the panel starts.',
    category: 'Events',
    likes: 16,
    createdAt: new Date(Date.now() - 5 * 86_400_000).toISOString(),
    comments: [
      { id: 'forum-3-comment-1', userName: 'PolicyPat', body: 'I am in. Great chance to learn more about local policy updates.', likes: 4, createdAt: new Date(Date.now() - 4 * 86_400_000).toISOString() },
    ],
  },
  {
    id: 'forum-4',
    userName: 'HomeGrowHaley',
    title: 'Favorite beginner-friendly grow resources?',
    body: 'Minnesota is full of new growers. Share the books, videos, or local workshops that helped you the most.',
    category: 'Growing',
    likes: 19,
    createdAt: new Date(Date.now() - 7 * 86_400_000).toISOString(),
    comments: [
      { id: 'forum-4-comment-1', userName: 'CanopyChris', body: 'Local hydro shops have been fantastic and surprisingly welcoming.', likes: 6, createdAt: new Date(Date.now() - 6 * 86_400_000).toISOString() },
    ],
  },
];

export const mockBlogPosts: BlogPostRecord[] = [
  {
    id: 'blog-1',
    title: 'How Minnesota Cannabis Laws Shape the Modern Shopping Experience',
    slug: 'minnesota-cannabis-shopping-experience',
    excerpt: 'A clear guide to pickup, delivery, verification, and what customers can expect from a premium compliant dispensary.',
    body: 'Minnesota cannabis customers want convenience without sacrificing safety or compliance. High Society MN blends licensed ordering workflows, clear age verification, and educational retail support to make each purchase feel effortless. From scheduled pickup windows to terpene-led discovery tools, the future of dispensary commerce is premium, transparent, and deeply local.',
    category: 'Education',
    tags: ['minnesota', 'compliance', 'shopping'],
    imageUrl: 'https://placehold.co/1200x700/0a0a0a/eab308?text=Minnesota+Cannabis+Guide',
    published: true,
    createdAt: new Date(Date.now() - 12 * 86_400_000).toISOString(),
    updatedAt: new Date(Date.now() - 10 * 86_400_000).toISOString(),
  },
  {
    id: 'blog-2',
    title: 'Indica, Sativa, and Hybrid: What Actually Matters Today',
    slug: 'indica-sativa-hybrid-what-matters',
    excerpt: 'A modern perspective on how strain labels, terpenes, and cannabinoid percentages all work together.',
    body: 'While indica, sativa, and hybrid remain helpful shorthand, seasoned shoppers increasingly focus on terpene profile, cultivation quality, and total cannabinoid makeup. Understanding limonene, myrcene, and caryophyllene can help you discover effects that align with your goals more consistently than category labels alone.',
    category: 'Wellness',
    tags: ['strains', 'terpenes', 'wellness'],
    imageUrl: 'https://placehold.co/1200x700/0a0a0a/eab308?text=Strain+Guide',
    published: true,
    createdAt: new Date(Date.now() - 18 * 86_400_000).toISOString(),
    updatedAt: new Date(Date.now() - 16 * 86_400_000).toISOString(),
  },
  {
    id: 'blog-3',
    title: 'Edibles 101: Dosing Confidently for a Better Experience',
    slug: 'edibles-dosing-confidence',
    excerpt: 'Why low-and-slow still wins, plus how to build a comfortable edible routine.',
    body: 'Edibles reward patience. Start with a low dose, wait at least two hours, and keep a consistent environment. When you shop for premium edible brands, accuracy and repeatability matter. The right product should make the experience predictable, delicious, and approachable whether you are brand new or simply dialing in your sweet spot.',
    category: 'Education',
    tags: ['edibles', 'dosage', 'beginners'],
    imageUrl: 'https://placehold.co/1200x700/0a0a0a/eab308?text=Edibles+101',
    published: true,
    createdAt: new Date(Date.now() - 24 * 86_400_000).toISOString(),
    updatedAt: new Date(Date.now() - 23 * 86_400_000).toISOString(),
  },
  {
    id: 'blog-4',
    title: 'Why Live Rosin Has Become the Luxury Standard',
    slug: 'why-live-rosin-is-luxury-standard',
    excerpt: 'Solventless extraction, expressive flavor, and what separates premium rosin from the rest.',
    body: 'Live rosin has earned a cult following because it preserves both potency and cultivar character without the use of solvents. Consumers willing to invest in top-tier concentrates often choose rosin for its texture, terpene brightness, and a clean finish that feels artisan from start to finish.',
    category: 'Concentrates',
    tags: ['rosin', 'concentrates', 'premium'],
    imageUrl: 'https://placehold.co/1200x700/0a0a0a/eab308?text=Live+Rosin',
    published: true,
    createdAt: new Date(Date.now() - 30 * 86_400_000).toISOString(),
    updatedAt: new Date(Date.now() - 28 * 86_400_000).toISOString(),
  },
  {
    id: 'blog-5',
    title: 'Community, Loyalty, and the Next Era of Dispensary Retail',
    slug: 'community-loyalty-next-era-dispensary-retail',
    excerpt: 'How forums, referrals, and rewards turn a store into a destination.',
    body: 'Retail is no longer just transactional. The dispensaries that win long term create community around education, discovery, and rewards. A modern loyalty program should feel entertaining, transparent, and genuinely valuable, while referral systems encourage trusted word-of-mouth growth in regulated markets.',
    category: 'Culture',
    tags: ['loyalty', 'community', 'retail'],
    imageUrl: 'https://placehold.co/1200x700/0a0a0a/eab308?text=Loyalty+Program',
    published: true,
    createdAt: new Date(Date.now() - 36 * 86_400_000).toISOString(),
    updatedAt: new Date(Date.now() - 34 * 86_400_000).toISOString(),
  },
  {
    id: 'blog-6',
    title: 'Budtender Tips for Building a Balanced Weekend Stash',
    slug: 'budtender-tips-balanced-weekend-stash',
    excerpt: 'A curated approach to pairing flower, vapes, and edibles for different moments.',
    body: 'The best weekend stash has range: one social flower, one comfort-forward bedtime option, something discreet for mobility, and an edible for longer arcs. High Society MN recommends shopping by occasion rather than category alone so each product plays a clear role in your routine.',
    category: 'Lifestyle',
    tags: ['budtender', 'shopping', 'weekend'],
    imageUrl: 'https://placehold.co/1200x700/0a0a0a/eab308?text=Weekend+Stash',
    published: true,
    createdAt: new Date(Date.now() - 42 * 86_400_000).toISOString(),
    updatedAt: new Date(Date.now() - 41 * 86_400_000).toISOString(),
  },
];

export const mockOrders: OrderRecord[] = [
  {
    id: 'HSMN-10021',
    status: 'ready for pickup',
    subtotal: 94,
    tax: calculateTax(94),
    total: 94 + calculateTax(94),
    fulfillmentType: 'pickup',
    scheduledTime: new Date(Date.now() + 2 * 3_600_000).toISOString(),
    createdAt: new Date(Date.now() - 18 * 3_600_000).toISOString(),
    items: [
      { productId: mockProducts[0].id, productName: mockProducts[0].name, quantity: 1, price: mockProducts[0].price },
      { productId: mockProducts[14].id, productName: mockProducts[14].name, quantity: 1, price: mockProducts[14].price },
      { productId: mockProducts[22].id, productName: mockProducts[22].name, quantity: 2, price: mockProducts[22].price },
    ],
  },
  {
    id: 'HSMN-10004',
    status: 'completed',
    subtotal: 57,
    tax: calculateTax(57),
    total: 57 + calculateTax(57),
    fulfillmentType: 'delivery',
    scheduledTime: new Date(Date.now() - 72 * 3_600_000).toISOString(),
    createdAt: new Date(Date.now() - 96 * 3_600_000).toISOString(),
    items: [
      { productId: mockProducts[3].id, productName: mockProducts[3].name, quantity: 1, price: mockProducts[3].price },
      { productId: mockProducts[10].id, productName: mockProducts[10].name, quantity: 1, price: mockProducts[10].price },
    ],
  },
];

export const mockLoyalty: LoyaltyRecord = {
  memberName: 'High Society Member',
  points: 1280,
  tier: 'Gold Leaf',
  nextRewardAt: 1500,
  perks: ['2x points on Mondays', 'Priority drops access', 'Birthday reward', 'Members-only community events'],
  leaderboard: [
    { name: 'NorthLoopNate', points: 4120 },
    { name: 'MplsMia', points: 3675 },
    { name: 'RosinRae', points: 3100 },
    { name: 'You', points: 1280 },
  ],
};

export const mockReferral: ReferralRecord = {
  code: 'HIGHSOCIETY-MN-VIP',
  referrals: 7,
  rewardsEarned: 140,
  pendingRewards: 20,
};
