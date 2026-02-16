if (process.env.NODE_ENV !== "PRODUCTION") {
    require('dotenv').config({
        path: 'config/.env'
    })
}

const app = require('./App')

// Handling uncaught exceptions
process.on("uncaughtException", (err) => {
    console.log(`Error: ${err.message}`)
    console.log(`Shutting down the server for handling uncaught exception`)
    process.exit(1)
})

// Create server
const PORT = process.env.PORT || 8000;
const server = app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})

// Unhandled promise rejection
process.on("unhandledRejection", (err) => {
    console.log(`Error: ${err.message}`)
    console.log(`Shutting down the server for unhandled promise rejection`)
    server.close(() => {
        process.exit(1)
    })
})