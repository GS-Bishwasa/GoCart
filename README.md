# 🛒 GoCart — Multi-Vendor E-Commerce Platform

**Live Site:** [https://go-cart-umber.vercel.app](https://go-cart-umber.vercel.app)  

GoCart is a **full-stack, multi-vendor e-commerce platform** built with **Next.js**.  
It allows users to **create their own online store**, manage products, track orders, and receive payments securely through Stripe.  
The platform also includes a **powerful admin panel** to manage all vendors, stores, and users.

---

## 🚀 Key Features

- 🏬 **Multi-Vendor System:** Anyone can create their personal store and start selling online.  
- 💳 **Stripe Payment Integration:** Secure and reliable online transactions.  
- 🧑‍💼 **Admin Dashboard:** Manage all stores, users, and products from a single place.  
- 📦 **Store Management:** Add, edit, delete, and track products easily.  
- 📊 **Sales Analytics:** Visual insights using interactive charts (Recharts).  
- 🔐 **Authentication:** Seamless login and signup via **Clerk**.  
- ☁️ **Image Uploads:** Fast image optimization with **ImageKit**.  
- 🧠 **AI Integration:** Uses **OpenAI API** for smart features like product name suggestions or descriptions.  
- ⚡ **Serverless & Scalable:** Deployed on **Vercel** with a Neon PostgreSQL serverless database.  
- 🎨 **Modern UI:** Built with Tailwind CSS for responsive, minimal, and modern design.

---

## 🌐 Live Pages

| Page | Description | URL |
|------|--------------|-----|
| 🏠 **Homepage** | Main site landing page | [https://go-cart-umber.vercel.app](https://go-cart-umber.vercel.app) |
| 🛍️ **Create Store** | Create your personal store | [https://go-cart-umber.vercel.app/create-store](https://go-cart-umber.vercel.app/create-store) |
| 🏪 **Store Dashboard** | Manage your store products | [https://go-cart-umber.vercel.app/store](https://go-cart-umber.vercel.app/store) |
| ⚙️ **Admin Panel** | Manage all users, stores, and sales (restricted) | [https://go-cart-umber.vercel.app/admin](https://go-cart-umber.vercel.app/admin) |

---

## 🧩 Tech Stack

| Category | Technology |
|-----------|-------------|
| **Frontend** | Next.js 15, React 19, Tailwind CSS 4 |
| **Backend** | Next.js API Routes, Prisma ORM |
| **Database** | Neon (PostgreSQL Serverless) |
| **Authentication** | Clerk |
| **Payments** | Stripe |
| **Image Management** | ImageKit |
| **State Management** | Redux Toolkit |
| **Data Visualization** | Recharts |
| **Notifications** | React Hot Toast |
| **Deployment** | Vercel |

---

## ⚙️ Dependencies Explanation

### 🧱 Core Frameworks
- **next:** React-based framework for full-stack web apps.
- **react / react-dom:** Core React libraries for UI rendering.

### 🪄 Styling
- **tailwindcss:** Utility-first CSS framework for rapid UI development.
- **@tailwindcss/postcss:** Tailwind plugin for PostCSS integration.

### 🔐 Authentication
- **@clerk/nextjs:** Authentication and user management solution integrated with Next.js.

### 💾 Database & ORM
- **@neondatabase/serverless:** Neon serverless PostgreSQL driver.
- **@prisma/client:** Prisma ORM client for database operations.
- **@prisma/adapter-neon:** Connects Prisma with Neon database.
- **prisma:** Prisma CLI for schema generation and migrations.

### ⚡ API & Backend Tools
- **axios:** Promise-based HTTP client for API requests.
- **inngest:** Event-driven background jobs and workflows.
- **ws / @types/ws:** WebSocket support for real-time features.
- **openai:** For AI-powered features (like product description generation).

### 💳 Payments
- **stripe:** Integration for handling secure payments.

### 🖼️ Media
- **imagekit:** Handles image uploading, compression, and CDN optimization.

### 🗓️ Utilities & Charts
- **date-fns:** Utility library for handling and formatting dates.
- **recharts:** Charting library used for displaying analytics.
- **lucide-react:** Beautiful icon library for UI icons.

### 🔥 State & UI Feedback
- **@reduxjs/toolkit / react-redux:** For global state management across the app.
- **react-hot-toast:** Displays user-friendly toast notifications.

---

## 🛠️ Environment Variables

Create a `.env` file in the root of your project and add the following:

```env
DATABASE_URL="your_neon_postgres_url"
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="your_clerk_public_key"
CLERK_SECRET_KEY="your_clerk_secret_key"
STRIPE_SECRET_KEY="your_stripe_secret_key"
STRIPE_WEBHOOK_SECRET="your_stripe_webhook_secret"
IMAGEKIT_PUBLIC_KEY="your_imagekit_public_key"
IMAGEKIT_PRIVATE_KEY="your_imagekit_private_key"
IMAGEKIT_URL_ENDPOINT="your_imagekit_endpoint"
OPENAI_API_KEY="your_openai_api_key"
OPENAI_BASE_URL="your_openai_base_url"
OPENAI_MODEL="gpt-4o-mini"
