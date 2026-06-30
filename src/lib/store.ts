import { blogPosts, products } from "@/lib/data";

type CartItem = { productId: string; quantity: number };
type Order = {
  id: string;
  userId: string;
  items: CartItem[];
  tax: number;
  subtotal: number;
  total: number;
  status: "PENDING" | "CONFIRMED" | "PREPARING" | "READY" | "COMPLETED" | "CANCELLED";
  fulfillmentType: "PICKUP" | "DELIVERY";
  scheduledFor: string;
  createdAt: string;
};

type ForumPost = {
  id: string;
  title: string;
  content: string;
  category: string;
  likes: number;
  createdAt: string;
};

const carts = new Map<string, CartItem[]>();
const chatMessages = new Map<string, Array<{ role: "user" | "assistant"; content: string; createdAt: string }>>();
const orders: Order[] = [];
const forumPosts: ForumPost[] = [
  {
    id: "1",
    title: "Favorite evening products?",
    content: "What products help you unwind while keeping clarity?",
    category: "Strains",
    likes: 8,
    createdAt: new Date().toISOString(),
  },
];
const forumComments: Array<{ id: string; postId: string; content: string; likes: number }> = [];
const blogs = [...blogPosts];
const marketingDrafts: Array<{ id: string; title: string; content: string; published: boolean }> = [];
let emailStats = { opens: 210, clicks: 92, unsubscribes: 3 };

export const getProducts = () => products;
export const getCart = (userId: string) => carts.get(userId) ?? [];

export const setCartItem = (userId: string, productId: string, quantity: number) => {
  const current = getCart(userId);
  const next = current.filter((item) => item.productId !== productId);
  if (quantity > 0) {
    next.push({ productId, quantity });
  }
  carts.set(userId, next);
  return next;
};

export const clearCartItem = (userId: string, productId: string) => {
  const next = getCart(userId).filter((item) => item.productId !== productId);
  carts.set(userId, next);
  return next;
};

export const createOrder = (input: Omit<Order, "id" | "createdAt" | "status">) => {
  const order: Order = {
    ...input,
    id: String(orders.length + 1),
    status: "PENDING",
    createdAt: new Date().toISOString(),
  };
  orders.unshift(order);
  return order;
};

export const listOrders = (userId: string) => orders.filter((order) => order.userId === userId);
export const getOrder = (orderId: string) => orders.find((order) => order.id === orderId);

export const addChat = (userId: string, role: "user" | "assistant", content: string) => {
  const bucket = chatMessages.get(userId) ?? [];
  bucket.push({ role, content, createdAt: new Date().toISOString() });
  chatMessages.set(userId, bucket);
  return bucket;
};

export const getChat = (userId: string) => chatMessages.get(userId) ?? [];

export const getForumPosts = () => forumPosts;
export const createForumPost = (title: string, content: string, category: string) => {
  const post = { id: String(forumPosts.length + 1), title, content, category, likes: 0, createdAt: new Date().toISOString() };
  forumPosts.unshift(post);
  return post;
};
export const updateForumPost = (id: string, patch: Partial<Pick<ForumPost, "title" | "content">>) => {
  const post = forumPosts.find((entry) => entry.id === id);
  if (!post) return null;
  if (patch.title) post.title = patch.title;
  if (patch.content) post.content = patch.content;
  return post;
};
export const deleteForumPost = (id: string) => {
  const index = forumPosts.findIndex((entry) => entry.id === id);
  if (index === -1) return false;
  forumPosts.splice(index, 1);
  return true;
};

export const createForumComment = (postId: string, content: string) => {
  const comment = { id: String(forumComments.length + 1), postId, content, likes: 0 };
  forumComments.push(comment);
  return comment;
};

export const updateForumComment = (id: string, content: string) => {
  const comment = forumComments.find((entry) => entry.id === id);
  if (!comment) return null;
  comment.content = content;
  return comment;
};

export const deleteForumComment = (id: string) => {
  const index = forumComments.findIndex((entry) => entry.id === id);
  if (index === -1) return false;
  forumComments.splice(index, 1);
  return true;
};

export const listBlogs = () => blogs;
export const getBlog = (id: string) => blogs.find((entry) => entry.id === id);
export const createBlog = (title: string, content: string) => {
  const blog = { id: String(blogs.length + 1), slug: title.toLowerCase().replaceAll(/[^a-z0-9]+/g, "-"), title, excerpt: content.slice(0, 120), content, tags: ["ai"] };
  blogs.unshift(blog);
  return blog;
};

export const generateDraft = () => {
  const id = String(marketingDrafts.length + 1);
  const draft = {
    id,
    title: `AI Weekly Spotlight ${id}`,
    content: "Automated draft featuring trending products, loyalty updates, and community highlights.",
    published: false,
  };
  marketingDrafts.unshift(draft);
  return draft;
};

export const listDrafts = () => marketingDrafts;
export const publishDraft = (id: string) => {
  const draft = marketingDrafts.find((entry) => entry.id === id);
  if (!draft) return null;
  draft.published = true;
  createBlog(draft.title, draft.content);
  return draft;
};

export const sendEmailCampaign = () => {
  emailStats = {
    opens: emailStats.opens + 15,
    clicks: emailStats.clicks + 7,
    unsubscribes: emailStats.unsubscribes,
  };
  return { status: "sent", at: new Date().toISOString() };
};

export const getEmailStats = () => emailStats;
