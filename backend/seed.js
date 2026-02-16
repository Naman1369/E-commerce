/**
 * Seed Script — 20 products with images from picsum.photos
 * Uses raw MongoDB driver (no Mongoose models) to avoid validation side-effects.
 *
 * Usage:  node seed.js
 */

const { MongoClient } = require("mongodb");
const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");
const https = require("https");
const http = require("http");

dotenv.config({ path: path.join(__dirname, "config", ".env") });

const DB_URL = process.env.DB_URL;
const SEED_EMAIL = "demo@shopnest.com";

const PRODUCTS = [
    { name: "Nebula Pro Wireless Headphones", description: "Premium over-ear noise-canceling headphones with 40-hour battery life, Hi-Res Audio support, and ultra-soft memory foam cushions. Perfect for immersive music and distraction-free work.", category: "Electronics", tags: ["headphones", "wireless"], price: 249.99, stock: 45 },
    { name: "Titan X Smartwatch", description: "Advanced fitness smartwatch with AMOLED display, heart rate monitoring, GPS tracking, and 7-day battery life. Water-resistant to 50 meters with 100+ workout modes.", category: "Electronics", tags: ["smartwatch", "fitness"], price: 329.99, stock: 30 },
    { name: "AuraGlow LED Desk Lamp", description: "Modern adjustable LED desk lamp with 5 color temperatures, touch dimming, wireless charging base, and USB-C port. Sleek aluminum design for the modern workspace.", category: "Home & Garden", tags: ["lamp", "desk"], price: 79.99, stock: 100 },
    { name: "CloudStep Ultra Running Shoes", description: "Lightweight performance running shoes with responsive foam midsole, breathable knit upper, and carbon-fiber plate for maximum energy return.", category: "Sports", tags: ["shoes", "running"], price: 179.99, stock: 60 },
    { name: "Obsidian Leather Messenger Bag", description: "Handcrafted full-grain leather messenger bag with padded laptop compartment fits up to 15 inch, brass hardware, and adjustable crossbody strap.", category: "Fashion", tags: ["bag", "leather"], price: 189.99, stock: 25 },
    { name: "ZenBrew Ceramic Pour-Over Set", description: "Artisan ceramic pour-over coffee set with double-wall glass carafe, stainless steel mesh filter, and wooden stand. Brew the perfect cup every morning.", category: "Home & Garden", tags: ["coffee", "kitchen"], price: 64.99, stock: 80 },
    { name: "Pixel 4K Action Camera", description: "Ultra-compact 4K action camera with 60fps recording, electronic image stabilization, waterproof to 30m, and voice control.", category: "Electronics", tags: ["camera", "4k"], price: 299.99, stock: 35 },
    { name: "Verdant Indoor Plant Kit", description: "Complete indoor gardening kit with 6 herb seed pods, self-watering planter, grow lights, and nutrient solution. Grow fresh herbs year-round.", category: "Home & Garden", tags: ["plant", "indoor"], price: 49.99, stock: 120 },
    { name: "Solaris Portable Solar Charger", description: "Foldable 28W solar panel charger with dual USB ports and smart IC technology. Powers your devices anywhere the sun shines.", category: "Electronics", tags: ["solar", "charger"], price: 89.99, stock: 55 },
    { name: "Midnight Denim Jacket", description: "Premium selvedge denim jacket in midnight indigo wash. Features copper rivets, corduroy collar, and a comfortable relaxed fit.", category: "Fashion", tags: ["jacket", "denim"], price: 149.99, stock: 40 },
    { name: "Harmony Bluetooth Speaker", description: "Portable 360 degree surround-sound Bluetooth speaker with deep bass, 20-hour playback, IPX7 waterproof rating, and built-in microphone.", category: "Electronics", tags: ["speaker", "bluetooth"], price: 99.99, stock: 70 },
    { name: "Alpine Insulated Water Bottle", description: "Triple-insulated stainless steel water bottle keeps drinks cold for 24h or hot for 12h. 32oz capacity with leak-proof lid.", category: "Sports", tags: ["bottle", "insulated"], price: 34.99, stock: 150 },
    { name: "The Art of Modern Design", description: "A beautifully illustrated hardcover exploring the evolution of design from Bauhaus to the digital age. 320 pages of stunning photography.", category: "Books", tags: ["book", "design"], price: 44.99, stock: 90 },
    { name: "Swift Mechanical Keyboard", description: "Ultra-low-latency mechanical gaming keyboard with hot-swappable switches, per-key RGB lighting, and aircraft-grade aluminum frame.", category: "Electronics", tags: ["keyboard", "gaming"], price: 159.99, stock: 50 },
    { name: "Terra Hiking Backpack 40L", description: "Technical 40-liter hiking backpack with ventilated back panel, rain cover, and hydration sleeve. Designed for multi-day trails.", category: "Sports", tags: ["backpack", "hiking"], price: 129.99, stock: 35 },
    { name: "Luma Smart Home Hub", description: "Central smart home controller compatible with Zigbee, Z-Wave, WiFi, and Thread devices. Control everything from a single touchscreen.", category: "Electronics", tags: ["smart-home", "hub"], price: 199.99, stock: 40 },
    { name: "Cashmere Blend Scarf", description: "Luxuriously soft cashmere-wool blend scarf in heather grey. 200cm length with hand-rolled edges and subtle herringbone weave.", category: "Fashion", tags: ["scarf", "cashmere"], price: 89.99, stock: 65 },
    { name: "Origami Wooden Puzzle Set", description: "Set of 6 hand-crafted interlocking wooden puzzles in a bamboo box. Challenges range from beginner to expert. A perfect gift.", category: "Toys", tags: ["puzzle", "wooden"], price: 39.99, stock: 110 },
    { name: "ProFlex Resistance Band Kit", description: "Complete 11-piece resistance training kit with 5 latex bands 10-50 lbs, door anchor, ankle straps, handles, and carry bag.", category: "Sports", tags: ["fitness", "bands"], price: 29.99, stock: 200 },
    { name: "Monochrome Minimalist Watch", description: "Japanese quartz watch with 40mm brushed steel case, sapphire crystal glass, and Italian leather strap. Clean understated design.", category: "Fashion", tags: ["watch", "minimalist"], price: 219.99, stock: 30 },
];

function download(url, dest) {
    return new Promise((resolve, reject) => {
        const client = url.startsWith("https") ? https : http;
        const req = client.get(url, { timeout: 15000 }, (res) => {
            if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
                res.resume();
                return download(res.headers.location, dest).then(resolve).catch(reject);
            }
            if (res.statusCode !== 200) {
                res.resume();
                return reject(new Error(`HTTP ${res.statusCode}`));
            }
            const file = fs.createWriteStream(dest);
            res.pipe(file);
            file.on("finish", () => file.close(resolve));
            file.on("error", (err) => { fs.unlink(dest, () => { }); reject(err); });
        });
        req.on("error", reject);
        req.on("timeout", () => { req.destroy(); reject(new Error("timeout")); });
    });
}

async function seed() {
    console.log("Connecting to MongoDB...");
    const client = new MongoClient(DB_URL);
    await client.connect();
    const db = client.db();
    console.log("Connected!\n");

    const productsDir = path.join(__dirname, "products");
    if (!fs.existsSync(productsDir)) fs.mkdirSync(productsDir, { recursive: true });

    // Remove previous seed products
    const delResult = await db.collection("products").deleteMany({ email: SEED_EMAIL });
    console.log(`Cleared ${delResult.deletedCount} previous seed products.\n`);

    // Download images & build docs
    const docs = [];
    for (let i = 0; i < PRODUCTS.length; i++) {
        const p = PRODUCTS[i];
        const fname = `seed-${i + 1}-${Date.now()}.jpg`;
        const fpath = path.join(productsDir, fname);

        process.stdout.write(`  [${String(i + 1).padStart(2)}/${PRODUCTS.length}] ${p.name.padEnd(38)} `);

        let hasImg = false;
        try {
            await download(`https://picsum.photos/seed/shopnest${i}/640/640`, fpath);
            hasImg = fs.existsSync(fpath) && fs.statSync(fpath).size > 1000;
            process.stdout.write(hasImg ? "OK\n" : "skip\n");
        } catch (err) {
            process.stdout.write(`skip (${err.message})\n`);
        }

        docs.push({
            name: p.name,
            description: p.description,
            category: p.category,
            tags: p.tags,
            price: p.price,
            stock: p.stock,
            email: SEED_EMAIL,
            images: hasImg ? [`/products/${fname}`] : [],
            createdAt: new Date(),
            updatedAt: new Date(),
        });
    }

    const result = await db.collection("products").insertMany(docs);
    console.log(`\nInserted ${result.insertedCount} products!\n`);

    await client.close();
    process.exit(0);
}

seed().catch((err) => {
    console.error("Seed failed:", err.message);
    process.exit(1);
});
