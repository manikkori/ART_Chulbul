# Chulbul's Art — Custom Art Commission & Showcase Platform

> **Chulbul's Art** is a full-stack, production-ready MERN web application engineered for professional visual artists specializing in custom, made-to-order artworks (portraits, watercolors, oils, acrylics, and charcoal sketches).

---

## 1. Overview & Business Model

Unlike standard e-commerce stores that sell ready-made paintings, **Chulbul's Art** operates on a **bespoke, made-to-order commission workflow**:

1. **Portfolio Showcase:** Customers browse the artist's showcase gallery and categorized mediums.
2. **Multi-Step Commission Request:** The customer uploads up to 5 reference photographs, selects medium and dimensions, and specifies subject count, background preferences, and target deadlines.
3. **Custom Quotation:** The artist personally reviews the references in the Admin Studio and sends an exact quote in INR (`₹`) along with an estimated handcrafting timeline.
4. **Acceptance & Creation:** The customer can accept, decline, or negotiate directly via the per-order chat thread.
5. **Work-in-Progress Snaps:** The artist shares real-time creation photos with stage notes in the customer's order timeline.
6. **Insured Courier Dispatch:** When completed, the artist inputs courier tracking details, moving the order to **Shipped** and finally **Delivered**.
7. **Post-Delivery Review:** Verified customers can rate (1-5 stars) and review the piece. Reviews appear publicly only after admin moderation.
8. **In-Platform Communication:** There is **no WhatsApp, phone, or third-party messaging flow**. All queries and order discussions happen securely within the website.

---

## 2. Tech Stack & Architecture

### **Decoupled Architecture**
- `/client`: Frontend Single Page Application deployed on **Vercel**.
- `/server`: RESTful API backend deployed on **Render**.

### **Frontend**
- **Framework:** React 18 (Vite, plain JavaScript)
- **Styling:** Tailwind CSS with custom design tokens recreating the warm "art diary" feel of [artdiarium.com](https://artdiarium.com/)
- **Animation:** Framer Motion (page transitions, spring modals, smooth status indicators)
- **Icons:** `lucide-react` (**strictly zero emojis in UI**)
- **State & Context:** React Context API (`AuthContext`, `SettingsContext`, `NotificationContext`)
- **HTTP Client:** Axios with `withCredentials: true` and Authorization header fallback
- **Notifications:** `react-hot-toast`

### **Backend**
- **Runtime:** Node.js (ES Modules)
- **Web Framework:** Express 4
- **Database & ODM:** MongoDB with Mongoose (with embedded persistent MongoDB fallback for instant local dev without external daemons)
- **Authentication:** JSON Web Tokens (JWT) stored in `httpOnly` secure cookies with Bearer token header fallback
- **Security:** Helmet, CORS with credential handling, `express-mongo-sanitize`, `express-rate-limit`
- **File Uploads:** Multer (memory storage) + Cloudinary (with automatic fallback to base64 data URIs in local dev)
- **Email:** Nodemailer (with graceful console fallback if SMTP credentials are unset)

---

## 3. Design Tokens & Visual Language

Faithfully inspired by the warm, handcrafted aesthetic of **artdiarium.com**:
- **Cream Canvas Palette:** `#fdf7f1` (base background), `#f4ede4` (secondary surfaces), `#ebdcd0` (subtle borders).
- **Terracotta Brand Accent:** `#c86d51` (primary CTA buttons, highlights, active states).
- **Typography:** Classical serif (`Playfair Display`) for headings and quotes; clean geometric sans (`Plus Jakarta Sans`) for body text; handwritten (`Caveat`) for personal artist tags.
- **Eyebrow Headers:** Uppercase tracking-widest subtitle labels (`.eyebrow`) above every section.
- **Organic Radii & Soft Shadows:** Generous `rounded-3xl` and `rounded-2xl` corners with soft multi-layer box shadows.

---

## 4. Directory Structure

```
artChulbul/
├── client/
│   ├── public/
│   │   └── palette.svg             # Favicon
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   ├── Badge.jsx       # Status and medium chips
│   │   │   │   ├── Button.jsx      # Reusable styled buttons with loading states
│   │   │   │   ├── ConfirmDialog.jsx
│   │   │   │   ├── EmptyState.jsx
│   │   │   │   ├── ImageUploader.jsx # Drag-and-drop 5-file uploader with live preview
│   │   │   │   ├── Input.jsx
│   │   │   │   ├── Modal.jsx       # Framer Motion animated popover
│   │   │   │   ├── Pagination.jsx
│   │   │   │   ├── Skeleton.jsx
│   │   │   │   └── StatusTimeline.jsx # Visual 7-step order pipeline
│   │   │   └── layout/
│   │   │       ├── AdminLayout.jsx # Protected studio layout with sidebar
│   │   │       ├── Footer.jsx      # Dynamic branding & links
│   │   │       ├── MainLayout.jsx
│   │   │       └── Navbar.jsx      # Sticky header with notifications & account menu
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   ├── NotificationContext.jsx
│   │   │   └── SettingsContext.jsx # SiteSettings provider (siteName never hardcoded)
│   │   ├── pages/
│   │   │   ├── admin/
│   │   │   │   ├── AdminAboutManager.jsx
│   │   │   │   ├── AdminArtworks.jsx
│   │   │   │   ├── AdminCategories.jsx
│   │   │   │   ├── AdminCustomers.jsx
│   │   │   │   ├── AdminDashboard.jsx
│   │   │   │   ├── AdminOrderDetail.jsx
│   │   │   │   ├── AdminOrders.jsx
│   │   │   │   ├── AdminQueries.jsx
│   │   │   │   ├── AdminReviews.jsx
│   │   │   │   └── AdminSiteSettings.jsx
│   │   │   ├── customer/
│   │   │   │   ├── CustomOrderForm.jsx # 4-step commission wizard
│   │   │   │   ├── MyOrders.jsx
│   │   │   │   ├── OrderDetail.jsx     # Timeline, quote handling, order chat
│   │   │   │   ├── Profile.jsx         # Profile edit & address CRUD
│   │   │   │   └── Wishlist.jsx
│   │   │   ├── About.jsx
│   │   │   ├── ArtworkDetail.jsx
│   │   │   ├── Categories.jsx
│   │   │   ├── CategoryDetail.jsx
│   │   │   ├── Contact.jsx
│   │   │   ├── ForgotPassword.jsx
│   │   │   ├── Gallery.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── NotFound.jsx
│   │   │   ├── PricingGuide.jsx
│   │   │   ├── RefundPolicy.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── ResetPassword.jsx
│   │   │   └── Terms.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── utils/
│   │   │   └── formatters.js       # Intl.NumberFormat INR & date formatters
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── package.json
│   ├── tailwind.config.js
│   ├── vercel.json
│   └── vite.config.js
├── server/
│   ├── config/
│   │   ├── cloudinary.js
│   │   └── db.js
│   ├── controllers/
│   │   ├── adminController.js
│   │   ├── artworkController.js
│   │   ├── authController.js
│   │   ├── categoryController.js
│   │   ├── messageController.js
│   │   ├── notificationController.js
│   │   ├── orderController.js
│   │   ├── queryController.js
│   │   ├── reviewController.js
│   │   ├── settingsController.js
│   │   └── userController.js
│   ├── middleware/
│   │   ├── auth.js                 # protect, authorize, optionalProtect
│   │   ├── error.js
│   │   └── upload.js
│   ├── models/
│   │   ├── ArtistProfile.js
│   │   ├── Artwork.js
│   │   ├── Category.js
│   │   ├── CustomOrder.js
│   │   ├── Message.js
│   │   ├── Notification.js
│   │   ├── Query.js
│   │   ├── Review.js
│   │   ├── SiteSettings.js
│   │   └── User.js
│   ├── routes/
│   │   ├── adminRoutes.js
│   │   ├── artworkRoutes.js
│   │   ├── authRoutes.js
│   │   ├── categoryRoutes.js
│   │   ├── messageRoutes.js
│   │   ├── notificationRoutes.js
│   │   ├── orderRoutes.js
│   │   ├── queryRoutes.js
│   │   ├── reviewRoutes.js
│   │   ├── settingsRoutes.js
│   │   └── userRoutes.js
│   ├── seed/
│   │   └── seed.js
│   ├── utils/
│   │   ├── apiResponse.js
│   │   ├── asyncHandler.js
│   │   ├── email.js
│   │   └── orderNumber.js
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── render.yaml
└── README.md
```

---

## 5. Local Setup & Installation

### Prerequisites
- Node.js `v18+` or `v20+` (tested on Node v24)
- npm `v9+` or `v11+`

### Step 1: Clone Repository
```bash
git clone <your-repo-url>
cd artChulbul
```

### Step 2: Configure & Start Server
```bash
cd server
npm install
cp .env.example .env
```

Edit `server/.env` if you wish to configure custom MongoDB Atlas or Cloudinary credentials. By default, the server runs an embedded persistent database in `server/data/db` out-of-the-box!

Run the database seed script to populate the Admin user, 5 categories, sample showcase artworks, and default SiteSettings:
```bash
npm run seed
```

Start the backend server:
```bash
npm run dev
# Server will listen on http://localhost:5000
```

### Step 3: Configure & Start Client
Open a second terminal:
```bash
cd client
npm install
npm run dev
# Client will be live at http://localhost:5173
```

---

## 6. Seed Credentials

After running `npm run seed`:

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `admin@artchulbul.com` | `Admin@123456` |
| **Customer** | `customer@example.com` | `Customer@123456` |

*Note: You can change the admin seed credentials in `server/.env` before running the seed script.*

---

## 7. Deployment Guide

### A. Deploy Backend on Render
1. Create a new **Web Service** on [Render](https://render.com).
2. Connect your Git repository.
3. Configure the following settings:
   - **Root Directory:** `server`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
4. Set Environment Variables in the Render dashboard:
   - `NODE_ENV`: `production`
   - `PORT`: `10000`
   - `CLIENT_URL`: `https://your-frontend-app.vercel.app`
   - `MONGODB_URI`: `mongodb+srv://<user>:<password>@cluster0.mongodb.net/artchulbul?retryWrites=true&w=majority`
   - `JWT_SECRET`: `<generate-a-strong-random-key>`
   - `ADMIN_NAME`: `Chulbul Admin`
   - `ADMIN_EMAIL`: `admin@artchulbul.com`
   - `ADMIN_PASSWORD`: `<your-admin-password>`
   - `CLOUDINARY_CLOUD_NAME`: `<your-cloudinary-cloud-name>`
   - `CLOUDINARY_API_KEY`: `<your-cloudinary-api-key>`
   - `CLOUDINARY_API_SECRET`: `<your-cloudinary-api-secret>`
5. In the Render Shell or via a one-off job, run:
   ```bash
   node seed/seed.js
   ```

### B. Deploy Frontend on Vercel
1. Go to [Vercel](https://vercel.com) and click **Add New Project**.
2. Select your repository.
3. Set **Root Directory** to `client`.
4. Framework Preset: **Vite**.
5. Build Command: `npm run build`.
6. Output Directory: `dist`.
7. Add Environment Variable:
   - `VITE_API_URL`: `https://your-render-backend.onrender.com/api`
8. Click **Deploy**. SPA routing rewrites are already handled by `client/vercel.json`.

---

## 8. REST API Endpoints Reference

### Authentication (`/api/auth`)
- `POST /api/auth/register` — Register a customer account
- `POST /api/auth/login` — Sign in and receive httpOnly cookie + Bearer token
- `POST /api/auth/logout` — Clear session cookie
- `GET /api/auth/me` — Get current logged-in user details
- `POST /api/auth/forgot-password` — Request password reset email
- `PUT /api/auth/reset-password/:token` — Set new password
- `PUT /api/auth/update-profile` — Update name & avatar
- `PUT /api/auth/update-password` — Change password

### Custom Orders (`/api/orders`)
- `POST /api/orders` — Submit custom order with up to 5 reference photos
- `GET /api/orders/my` — Get logged-in customer's orders
- `GET /api/orders/:id` — Get full order details & status timeline
- `POST /api/orders/:id/accept-quote` — Customer accepts artist quote
- `POST /api/orders/:id/decline-quote` — Customer declines quote
- `POST /api/orders/:id/cancel` — Cancel order (allowed before `In Progress`)

### Order Chat (`/api/messages`)
- `GET /api/messages/:orderId` — Fetch messages for order
- `POST /api/messages/:orderId` — Post message with optional attachments

### Inquiries (`/api/queries`)
- `POST /api/queries` — Submit inquiry directly to the artist
- `GET /api/queries/my` — View customer's past queries and artist replies

### Categories & Showcase (`/api/categories`, `/api/artworks`)
- `GET /api/categories` — List active mediums
- `GET /api/categories/:slug` — Category details & linked artworks
- `GET /api/artworks` — Search, filter, and paginate showcase gallery
- `GET /api/artworks/featured` — Featured artworks on homepage
- `GET /api/artworks/:slug` — Artwork details and related pieces

### Admin Studio (`/api/admin`)
- `GET /api/admin/dashboard` — Metric tiles, orders by status, and recent orders
- `GET /api/admin/orders` — Filtered orders list
- `POST /api/admin/orders/:id/quote` — Send/update quote
- `PUT /api/admin/orders/:id/status` — Advance order status
- `POST /api/admin/orders/:id/reject` — Reject commission with reason
- `POST /api/admin/orders/:id/progress` — Upload work-in-progress photo
- `PUT /api/admin/orders/:id/shipping` — Add courier tracking & mark Shipped
- `PUT /api/admin/orders/:id/notes` — Save internal studio notes
- `GET /api/admin/customers` — Customer list & order counts
- `PATCH /api/admin/customers/:id/toggle-block` — Deactivate / reactivate user

### Site Settings & About (`/api/settings`)
- `GET /api/settings` — Read global settings (siteName, hero, FAQs, pricing, policies)
- `PUT /api/settings` — Update branding, logos, FAQs, and policies
- `GET /api/settings/artist-profile` — Get artist story, photo, and timeline
- `PUT /api/settings/artist-profile` — Update artist bio, timeline, and achievements

---

## 9. License & Credits

- Crafted with care for **Chulbul's Art**.
- Design language inspired by [artdiarium.com](https://artdiarium.com/).
- © 2026 Chulbul's Art. All rights reserved.
