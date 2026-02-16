# ShopNest — Full-Stack MERN E-Commerce Application

A modern e-commerce platform built with the **MERN** stack (MongoDB, Express.js, React, Node.js). Browse products, manage your cart, place orders with Cash on Delivery or PayPal, and manage your profile with multiple shipping addresses.

## Features

- **Authentication** — Signup with avatar upload, login with JWT cookies
- **Product Management** — Create, edit, delete products with multiple image uploads
- **Shopping Cart** — Add to cart, adjust quantities, persistent per-user
- **Order Flow** — Select shipping address → choose payment → confirm order
- **Payment** — Cash on Delivery or PayPal integration
- **Profile** — View details, manage multiple shipping addresses
- **Responsive UI** — Mobile-friendly with Tailwind CSS

## Tech Stack

| Layer     | Technology                           |
|-----------|--------------------------------------|
| Frontend  | React 18, Vite, Tailwind CSS, Redux  |
| Backend   | Node.js, Express.js                  |
| Database  | MongoDB (Mongoose ODM)               |
| Auth      | JWT, bcrypt                          |
| Payments  | PayPal SDK                           |
| Uploads   | Multer                               |

## Project Structure

```
E-commerce/
├── backend/
│   ├── config/          # .env and .env.example
│   ├── controller/      # Route handlers (user, product, order)
│   ├── db/              # MongoDB connection
│   ├── middleware/       # Error handling, auth
│   ├── model/           # Mongoose schemas (User, Product, Order)
│   ├── utils/           # ErrorHandler, JWT helpers, email
│   ├── uploads/         # User avatar uploads
│   ├── products/        # Product image uploads
│   ├── App.js           # Express app setup
│   ├── server.js        # Entry point
│   └── multer.js        # File upload config
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Route pages
│   │   ├── api.js       # Centralized API base URL
│   │   ├── App.jsx      # Router setup
│   │   └── main.jsx     # Entry point with Redux Provider
│   ├── store/           # Redux store and actions
│   └── validation.js    # Form validation helpers
├── render.yaml          # Render deployment config
└── package.json         # Root scripts
```

## Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **MongoDB** Atlas cluster (or local MongoDB)
- **npm** ≥ 9

### 1. Clone the Repository

```bash
git clone https://github.com/Naman1369/E-commerce.git
cd E-commerce
```

### 2. Configure Environment Variables

**Backend** — copy the example and fill in your values:
```bash
cp backend/config/.env.example backend/config/.env
```

Edit `backend/config/.env`:
```env
PORT=8000
DB_URL=mongodb+srv://your-connection-string
JWT_SECRET=your_jwt_secret
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

**Frontend** — copy the example:
```bash
cp frontend/.env.example frontend/.env
```

Edit `frontend/.env`:
```env
VITE_API_URL=http://localhost:8000
VITE_PAYPAL_CLIENT_ID=your_paypal_client_id
```

### 3. Install Dependencies

```bash
# From the root directory
npm run install:backend
npm run install:frontend
```

### 4. Run in Development

Start **backend** and **frontend** in separate terminals:

```bash
# Terminal 1 — Backend (port 8000)
npm run dev:backend

# Terminal 2 — Frontend (port 5173)
npm run dev:frontend
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### 5. Build for Production

```bash
npm run build     # Builds frontend into frontend/dist/
npm start         # Starts backend, serves frontend from dist/
```

## API Endpoints

### User Routes (`/api/v2/user`)
| Method | Endpoint         | Description              |
|--------|------------------|--------------------------|
| POST   | `/create-user`   | Register new user        |
| POST   | `/login`         | Login and get JWT cookie |
| GET    | `/profile`       | Get user profile         |
| POST   | `/add-address`   | Add shipping address     |
| GET    | `/addresses`     | List user addresses      |

### Product Routes (`/api/v2/product`)
| Method | Endpoint                    | Description                |
|--------|-----------------------------|----------------------------|
| POST   | `/create-product`           | Create product (with images)|
| GET    | `/get-products`             | Get all products           |
| GET    | `/my-products`              | Get products by user email |
| GET    | `/product/:id`              | Get single product         |
| PUT    | `/update-product/:id`       | Update product             |
| DELETE | `/delete-product/:id`       | Delete product             |
| POST   | `/cart`                     | Add product to cart        |
| GET    | `/cartproducts`             | Get cart items             |
| PUT    | `/cartproduct/quantity`     | Update cart item quantity  |

### Order Routes (`/api/v2/orders`)
| Method | Endpoint              | Description           |
|--------|-----------------------|-----------------------|
| POST   | `/place-order`        | Place new order       |
| GET    | `/my-orders`          | Get user's orders     |
| PUT    | `/cancel-order/:id`   | Cancel an order       |

## Deployment (Render)

This project includes a `render.yaml` for one-click deployment on [Render](https://render.com):

1. Push to GitHub
2. Connect your repo on Render
3. Render auto-detects `render.yaml`
4. Set environment variables in Render dashboard:
   - `DB_URL` — your MongoDB connection string
   - `JWT_SECRET` — a strong secret key
   - `NODE_ENV` — `PRODUCTION`
5. Deploy!

## License

ISC