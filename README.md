# 🛒 QuickCart — Full-Stack MERN E-Commerce

A production-ready e-commerce store built with MongoDB, Express, React (Vite), and Node.js.

## ✨ Features

- 🔐 **JWT Authentication** — Register, login with bcrypt hashed passwords
- 🛍️ **Product Catalog** — Search, filter by category, pagination
- 🛒 **Shopping Cart** — Persistent cart with localStorage
- 📦 **Order Management** — Place orders, view order history
- 👤 **Admin Dashboard** — Manage products (CRUD), orders, users
- 📱 **Responsive UI** — Dark glassmorphism design, mobile-friendly

## 📁 Project Structure

```
quick cart/
├── client/          # React (Vite) frontend
│   ├── src/
│   │   ├── api/         # Axios API layer
│   │   ├── context/     # AuthContext, CartContext
│   │   ├── components/  # Navbar, ProductCard, etc.
│   │   └── pages/       # All page components
│   └── .env
├── server/          # Express backend
│   ├── src/
│   │   ├── config/      # MongoDB connection
│   │   ├── controllers/ # Route controllers
│   │   ├── middleware/  # Auth, error handler
│   │   ├── models/      # Mongoose schemas
│   │   ├── routes/      # API routes
│   │   ├── index.js     # Server entry point
│   │   └── seed.js      # Database seeder
│   └── .env
└── package.json     # Root scripts (concurrently)
```

## 🚀 Setup & Running

### 1. Prerequisites
- Node.js v18+
- MongoDB Atlas account (free tier works)

### 2. Clone & install dependencies

```bash
# Install all dependencies
npm run install-all
```

### 3. Configure environment variables

**Server** — Create `server/.env`:
```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/quickcart
JWT_SECRET=your_secure_secret_here
NODE_ENV=development
```

**Client** — Create `client/.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

### 4. Seed the database

```bash
npm run seed
```

This inserts **10 sample products** and **2 users**:

| Role  | Email                    | Password   |
|-------|--------------------------|------------|
| Admin | admin@quickcart.com      | admin123   |
| User  | john@example.com         | password123|

### 5. Run in development

```bash
npm run dev
```

This starts:
- 🟢 Backend: http://localhost:5000
- 🔵 Frontend: http://localhost:5173

## 🔌 API Endpoints

| Method | Route                      | Access       |
|--------|----------------------------|--------------|
| POST   | /api/auth/register         | Public       |
| POST   | /api/auth/login            | Public       |
| GET    | /api/auth/profile          | Private      |
| GET    | /api/auth/users            | Admin        |
| GET    | /api/products              | Public       |
| GET    | /api/products/:id          | Public       |
| POST   | /api/products              | Admin        |
| PUT    | /api/products/:id          | Admin        |
| DELETE | /api/products/:id          | Admin        |
| POST   | /api/orders                | Private      |
| GET    | /api/orders/myorders       | Private      |
| GET    | /api/orders                | Admin        |
| PUT    | /api/orders/:id/status     | Admin        |

## 🛠️ Tech Stack

| Layer     | Technology                    |
|-----------|-------------------------------|
| Frontend  | React 18, Vite, React Router  |
| State     | Context API (Auth + Cart)     |
| HTTP      | Axios                         |
| UI        | Vanilla CSS (dark theme)      |
| Backend   | Node.js, Express              |
| Auth      | JWT + bcryptjs                |
| Database  | MongoDB + Mongoose            |
| Dev Tools | Nodemon, Concurrently         |
