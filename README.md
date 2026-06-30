# High Society MN - Premium Cannabis Dispensary Web Application

## ✅ Current Live Demo Scope (Implemented)

This repository now includes a working Next.js 16 live demo with:

- Product catalog (`/products`) + product detail (`/products/[id]`)
- Cart (`/cart`) with Minnesota tax calculation (6.875%)
- Checkout (`/checkout`) with pickup/delivery scheduling
- Order history (`/orders`)
- Persistent Budtender AI chat widget with chat APIs
- Community forum page (`/community`) + forum/blog/marketing API endpoints
- Blog pages (`/blog`, `/blog/[id]`)
- Loyalty pages (`/loyalty`, `/loyalty/redeem`, `/loyalty/games`, `/loyalty/leaderboard`)
- Referral dashboard (`/referral`)

> Note: Current persistence is in-memory for live demo speed. Restarting the server resets cart/orders/forum/chat state.

A luxury, full-stack cannabis dispensary web application featuring modern eCommerce, customer accounts, AI-powered product discovery, inventory management, a dual-token point system, loyalty rewards, and an administrative dashboard.

## 🎯 Vision

Build a luxury, mobile-first dispensary website that feels like Apple meets Nike. Prioritize speed, accessibility, and an exceptional user experience while maintaining compliance with Minnesota cannabis regulations.

## ✨ Core Features (MVP)

### Customer Experience
- 🔞 21+ Age Verification
- 📱 Mobile-First Responsive Design
- ♿ ADA Accessibility Compliance
- 🚀 Optimized Performance (Core Web Vitals)
- 🔍 SEO Fundamentals
- 🔐 Secure Authentication & Customer Accounts

### Product Management
- 📦 Product Catalog (Flower, Edibles, Vapes, Concentrates, Beverages, Accessories)
- 🔎 Search, Sorting & Basic Filtering
- 📊 Inventory Management (Add, Update, Organize, Bulk Import)
- 📥 Bulk Ingestion from highsocietymn.com (with data mapping workflow)
- 🏪 Store Pickup Functionality

### Shopping & Checkout
- 🛒 Shopping Cart
- 💳 Secure Stripe Integration (compliant payments)
- 📦 Order Management System
- 📋 Order Tracking for Customers

### Admin Dashboard
- 📦 Product Management & Bulk Import Tools
- 📊 Inventory Management & Analytics
- 👥 Customer Management
- 📋 Order Management
- 📈 Basic Analytics & Reporting

## ✨ Nice-to-Have Features

- ⭐ Product Reviews & Ratings
- 💝 Wishlist Functionality
- 🎁 Dual-Token Loyalty Rewards System
- 📚 Educational Blog
- 👥 Community Forum
- 🤖 AI Agent for Blog Publishing & Forum Moderation
- 🤖 AI-Powered Product Recommendations
- 🌙 Dark Mode Support
- 📊 Advanced Analytics Dashboard

## 🚀 Future Roadmap

- 🚚 Delivery (where legally available)
- 🔄 Expanded Inventory Workflows
- 🤖 Advanced Order Automation
- 💡 Enhanced Personalization & Merchandising
- 📱 Mobile App (React Native)

## 🛠️ Technology Stack

### Frontend
- **Framework**: Next.js 15
- **UI Library**: React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Component Library**: Custom components with shadcn/ui patterns

### Backend
- **Runtime**: Node.js (via Vercel)
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: Auth.js (NextAuth.js)
- **File Storage**: Cloudinary
- **Payments**: Stripe API

### DevOps & Deployment
- **Deployment**: Vercel
- **Containerization**: Docker & Docker Compose (for local development)
- **CI/CD**: GitHub Actions
- **Code Quality**: ESLint, Prettier

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm/pnpm
- Docker & Docker Compose (optional, for containerized development)
- PostgreSQL 14+ (or use Docker Compose)

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/cornerstonemarketingus/highsocietyMN.git
   cd highsocietyMN
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Set up the database**
   ```bash
   # Using Docker Compose
   docker-compose up -d
   
   # Run migrations
   pnpm prisma migrate dev
   ```

5. **Seed the database (optional)**
   ```bash
   pnpm prisma db seed
   ```

6. **Start the development server**
   ```bash
   pnpm dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

**Built with ❤️ for High Society MN**
