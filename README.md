# High Society MN - Premium Cannabis Dispensary Web Application

A luxury, full-stack cannabis dispensary web application built with **Next.js 16**, **React 19**, **TypeScript**, **Tailwind CSS**, **Prisma v7**, and **Auth.js**.

## 🎯 Vision

Build a luxury, mobile-first dispensary website that feels like Apple meets Nike. Prioritize speed, accessibility, and an exceptional user experience while maintaining compliance with Minnesota cannabis regulations.

## ✨ Core Features (MVP)

### Customer Experience
- 🔞 21+ Age Verification gate
- 📱 Mobile-First Responsive Design
- ♿ ADA Accessibility Compliance
- 🚀 Optimized Performance (Core Web Vitals)
- 🔍 SEO Fundamentals
- 🔐 Secure Authentication & Customer Accounts

### Product Management
- 📦 Product Catalog (Flower, Edibles, Vapes, Concentrates, Beverages, Accessories)
- 🔎 Search, Sorting & Category Filtering
- 📊 Inventory Management

### Shopping & Checkout
- 🛒 Shopping Cart
- 💳 Secure Stripe Integration
- 📦 Order Management System
- 📋 Order Tracking for Customers

### Admin Dashboard
- 📦 Product Management
- 📊 Inventory & Order Management
- 👥 Customer Management
- 📈 Basic Analytics

## 🛠️ Technology Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| UI | React 19 + Tailwind CSS v4 |
| Language | TypeScript 5 |
| Database | PostgreSQL |
| ORM | Prisma v7 + `@prisma/adapter-pg` |
| Auth | Auth.js v5 (NextAuth) |
| Payments | Stripe |
| Icons | Lucide React |
| Deployment | Vercel |

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 14+ (or a hosted provider like Neon, Supabase, Railway)

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

```bash
cp .env.example .env.local
```

Edit `.env.local` with your values:

```env
DATABASE_URL="******localhost:5432/highsocietymn"
NEXTAUTH_SECRET="run: openssl rand -base64 32"
NEXTAUTH_URL="http://localhost:3000"
STRIPE_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
```

### 3. Set up the database

```bash
npm run db:push    # Push schema to DB
npm run db:seed    # Seed categories, products, admin user
```

Default admin credentials after seed:
- Email: `admin@highsocietymn.com`
- Password: `admin1234`

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## 🚀 Deploying to Vercel (Live Hosting)

1. **Push this branch to GitHub** (done via PR)

2. **Create a Vercel project** at [vercel.com/new](https://vercel.com/new)
   - Import the `cornerstonemarketingus/HighsocietyMN` repository
   - Framework preset: **Next.js** (auto-detected)

3. **Add Environment Variables** in Vercel dashboard → Settings → Environment Variables:
   ```
   DATABASE_URL          (your PostgreSQL connection string)
   NEXTAUTH_SECRET       (openssl rand -base64 32)
   NEXTAUTH_URL          (https://your-domain.vercel.app)
   STRIPE_SECRET_KEY
   STRIPE_WEBHOOK_SECRET
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
   ```

4. **Deploy** — Vercel will run `prisma generate && next build` automatically

5. **Run migrations** (one-time, after first deploy):
   ```bash
   DATABASE_URL="..." npx prisma db push
   DATABASE_URL="..." npx tsx prisma/seed.ts
   ```

6. **Configure Stripe webhook** in Stripe Dashboard → Webhooks:
   - Endpoint URL: `https://your-domain.vercel.app/api/stripe/webhook`
   - Events: `checkout.session.completed`

### Recommended PostgreSQL Providers (free tiers available)
- **[Neon](https://neon.tech)** — Serverless PostgreSQL, generous free tier
- **[Supabase](https://supabase.com)** — PostgreSQL with extras
- **[Railway](https://railway.app)** — Simple, developer-friendly

---

## 📁 Project Structure

```
src/
├── app/
│   ├── (auth)/login       # Login page
│   ├── (auth)/register    # Register page
│   ├── (shop)/products    # Product catalog + detail
│   ├── (shop)/cart        # Shopping cart
│   ├── (shop)/checkout    # Checkout flow
│   ├── admin/             # Admin dashboard
│   └── api/               # API routes (auth, products, cart, orders, stripe)
├── components/
│   ├── layout/            # Header, Footer
│   ├── products/          # ProductCard
│   ├── ui/                # Button, Input, Badge
│   └── AgeVerification.tsx
├── lib/
│   ├── auth.ts            # Auth.js config
│   ├── db.ts              # Prisma client
│   ├── stripe.ts          # Stripe client
│   └── utils.ts           # Helpers
└── types/                 # TypeScript declarations
prisma/
├── schema.prisma          # Database schema
└── seed.ts                # Seed data
```

---

**Built with ❤️ for High Society MN** · Licensed Minnesota Cannabis Retailer
