const express = require('express')
const connectDatabase = require('./db/Database')
const ErrorHandler = require('./middleware/error')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const app = express()
const cors = require('cors')
const path = require('path')

// Config
if (process.env.NODE_ENV !== "PRODUCTION") {
    require('dotenv').config({
        path: 'config/.env'
    })
}

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }))

// CORS - environment aware
const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:5174",
    process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
    origin: allowedOrigins,
    credentials: true
}));

// Static file serving for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/products', express.static(path.join(__dirname, 'products')));

// Import routers
const user = require('./controller/user')
const product = require("./controller/product")
const orders = require('./controller/order')

app.use("/api/v2/user", user)
app.use("/api/v2/product", product)
app.use("/api/v2/orders", orders)

// Connect to database
connectDatabase()

// Serve frontend in production
if (process.env.NODE_ENV === "PRODUCTION") {
    app.use(express.static(path.join(__dirname, '../frontend/dist')));

    // SPA fallback - serve index.html for all non-API routes
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, '../frontend/dist/index.html'));
    });
}

// Error handling middleware (must be last)
app.use(ErrorHandler)

module.exports = app