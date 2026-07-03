import { db } from '@/lib/db';
import { type ProductRecord } from '@/lib/catalog';
import {
  mockBlogPosts,
  mockForumPosts,
  mockLoyalty,
  mockOrders,
  mockProducts,
  mockReferral,
  mockReviews,
} from '@/lib/mock-data';

type ProductFilters = {
  category?: string;
  strainType?: string;
  search?: string;
  sort?: string;
  minPrice?: number;
  maxPrice?: number;
  minThc?: number;
  maxThc?: number;
  featured?: boolean;
  limit?: number;
  excludeSlug?: string;
};

function sortProducts(products: ProductRecord[], sort = 'popular') {
  const copy = [...products];
  switch (sort) {
    case 'newest':
      return copy.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
    case 'price-low':
      return copy.sort((a, b) => a.price - b.price);
    case 'price-high':
      return copy.sort((a, b) => b.price - a.price);
    case 'thc':
      return copy.sort((a, b) => (b.thc ?? 0) - (a.thc ?? 0));
    default:
      return copy.sort((a, b) => b.rating * b.reviewCount - a.rating * a.reviewCount);
  }
}

export function applyProductFilters(products: ProductRecord[], filters: ProductFilters = {}) {
  const filtered = products.filter((product) => {
    if (filters.category && filters.category !== 'All' && product.category !== filters.category) return false;
    if (filters.strainType && filters.strainType !== 'All' && product.strainType !== filters.strainType) return false;
    if (filters.excludeSlug && product.slug === filters.excludeSlug) return false;
    if (filters.featured && !product.featured) return false;
    if (typeof filters.minPrice === 'number' && product.price < filters.minPrice) return false;
    if (typeof filters.maxPrice === 'number' && product.price > filters.maxPrice) return false;
    if (typeof filters.minThc === 'number' && (product.thc ?? 0) < filters.minThc) return false;
    if (typeof filters.maxThc === 'number' && (product.thc ?? 0) > filters.maxThc) return false;
    if (filters.search) {
      const haystack = `${product.name} ${product.description} ${product.category} ${product.strain ?? ''}`.toLowerCase();
      if (!haystack.includes(filters.search.toLowerCase())) return false;
    }
    return true;
  });

  const sorted = sortProducts(filtered, filters.sort);
  return typeof filters.limit === 'number' ? sorted.slice(0, filters.limit) : sorted;
}

function mapDbProduct(product: Record<string, unknown>): ProductRecord {
  return {
    id: String(product.id),
    name: String(product.name),
    slug: String(product.slug),
    description: String(product.description),
    price: Number(product.price),
    comparePrice: product.comparePrice ? Number(product.comparePrice) : null,
    category: String(product.category),
    subcategory: product.subcategory ? String(product.subcategory) : null,
    strain: product.strain ? String(product.strain) : null,
    strainType: product.strainType ? String(product.strainType) : null,
    thc: typeof product.thc === 'number' ? product.thc : product.thc ? Number(product.thc) : null,
    cbd: typeof product.cbd === 'number' ? product.cbd : product.cbd ? Number(product.cbd) : null,
    images: Array.isArray(product.images) ? (product.images as string[]) : [],
    inStock: Boolean(product.inStock),
    featured: Boolean(product.featured),
    weight: product.weight ? String(product.weight) : null,
    brand: product.brand ? String(product.brand) : null,
    tags: Array.isArray(product.tags) ? (product.tags as string[]) : [],
    rating: Number(product.rating ?? 0),
    reviewCount: Number(product.reviewCount ?? 0),
    createdAt: new Date(String(product.createdAt)).toISOString(),
    updatedAt: new Date(String(product.updatedAt)).toISOString(),
  };
}

export async function getProducts(filters: ProductFilters = {}) {
  try {
    const products = await db.product.findMany();
    return applyProductFilters(products.map((product) => mapDbProduct(product as unknown as Record<string, unknown>)), filters);
  } catch {
    return applyProductFilters(mockProducts, filters);
  }
}

export async function getFeaturedProducts(limit = 4) {
  return getProducts({ featured: true, limit, sort: 'popular' });
}

export async function getProductBySlug(slug: string) {
  try {
    const product = await db.product.findUnique({ where: { slug } });
    return product ? mapDbProduct(product as unknown as Record<string, unknown>) : null;
  } catch {
    return mockProducts.find((product) => product.slug === slug) ?? null;
  }
}

export async function getProductById(id: string) {
  try {
    const product = await db.product.findUnique({ where: { id } });
    return product ? mapDbProduct(product as unknown as Record<string, unknown>) : null;
  } catch {
    return mockProducts.find((product) => product.id === id) ?? null;
  }
}

export async function getRelatedProducts(slug: string, category: string) {
  const products = await getProducts({ category, excludeSlug: slug, limit: 4, sort: 'popular' });
  return products.length ? products : getProducts({ excludeSlug: slug, limit: 4, sort: 'popular' });
}

export async function getProductReviews(slug: string) {
  try {
    const product = await db.product.findUnique({ where: { slug }, include: { reviews: { include: { user: true } } } });
    if (!product) return [];
    return product.reviews.map((review) => ({
      id: review.id,
      userName: review.user.name ?? review.user.email,
      rating: review.rating,
      title: review.title ?? 'Verified review',
      body: review.body,
      createdAt: review.createdAt.toISOString(),
    }));
  } catch {
    return mockReviews[slug] ?? [];
  }
}

export async function getForumPosts() {
  try {
    const posts = await db.forumPost.findMany({ include: { user: true, comments: { include: { user: true } } }, orderBy: { createdAt: 'desc' } });
    return posts.map((post) => ({
      id: post.id,
      userName: post.user.name ?? post.user.email,
      title: post.title,
      body: post.body,
      category: post.category,
      likes: post.likes,
      createdAt: post.createdAt.toISOString(),
      comments: post.comments.map((comment) => ({
        id: comment.id,
        userName: comment.user.name ?? comment.user.email,
        body: comment.body,
        likes: comment.likes,
        createdAt: comment.createdAt.toISOString(),
      })),
    }));
  } catch {
    return mockForumPosts;
  }
}

export async function getBlogPosts() {
  try {
    const posts = await db.blogPost.findMany({ where: { published: true }, orderBy: { createdAt: 'desc' } });
    return posts.map((post) => ({
      ...post,
      imageUrl: post.imageUrl ?? 'https://placehold.co/1200x700/0a0a0a/eab308?text=High+Society+MN',
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
    }));
  } catch {
    return mockBlogPosts;
  }
}

export async function getBlogPostBySlug(slug: string) {
  try {
    const post = await db.blogPost.findUnique({ where: { slug } });
    if (!post) return null;
    return {
      ...post,
      imageUrl: post.imageUrl ?? 'https://placehold.co/1200x700/0a0a0a/eab308?text=High+Society+MN',
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
    };
  } catch {
    return mockBlogPosts.find((post) => post.slug === slug) ?? null;
  }
}

export async function getOrders() {
  try {
    const orders = await db.order.findMany({ include: { items: { include: { product: true } } }, orderBy: { createdAt: 'desc' }, take: 10 });
    return orders.map((order) => ({
      id: order.id,
      status: order.status,
      subtotal: order.subtotal,
      tax: order.tax,
      total: order.total,
      fulfillmentType: order.fulfillmentType,
      scheduledTime: order.scheduledTime?.toISOString() ?? order.createdAt.toISOString(),
      createdAt: order.createdAt.toISOString(),
      items: order.items.map((item) => ({
        productId: item.productId,
        productName: item.product.name,
        quantity: item.quantity,
        price: item.price,
      })),
    }));
  } catch {
    return mockOrders;
  }
}

export async function getLoyaltyData() {
  return mockLoyalty;
}

export async function getReferralData() {
  return mockReferral;
}
