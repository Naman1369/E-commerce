/**
 * Final re-seed — uses hardcoded Pexels CDN URLs (no API key needed)
 * for relevant product imagery. Also removes original test product.
 *
 * Usage:  node reseed-final.js
 */

const { MongoClient } = require("mongodb");
const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");
const https = require("https");

dotenv.config({ path: path.join(__dirname, "config", ".env") });

const DB_URL = process.env.DB_URL;
const SEED_EMAIL = "demo@shopnest.com";
const PRODUCTS_DIR = path.join(__dirname, "products");

// Direct Pexels CDN URLs — public, reliable, relevant to each product
const PRODUCT_IMAGES = [
    { name: "Nebula Pro Wireless Headphones", url: "https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=640&h=640&fit=crop" },
    { name: "Titan X Smartwatch", url: "https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=640&h=640&fit=crop" },
    { name: "AuraGlow LED Desk Lamp", url: "https://images.pexels.com/photos/1112598/pexels-photo-1112598.jpeg?auto=compress&cs=tinysrgb&w=640&h=640&fit=crop" },
    { name: "CloudStep Ultra Running Shoes", url: "https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=640&h=640&fit=crop" },
    { name: "Obsidian Leather Messenger Bag", url: "https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=640&h=640&fit=crop" },
    { name: "ZenBrew Ceramic Pour-Over Set", url: "https://images.pexels.com/photos/324028/pexels-photo-324028.jpeg?auto=compress&cs=tinysrgb&w=640&h=640&fit=crop" },
    { name: "Pixel 4K Action Camera", url: "https://images.pexels.com/photos/51383/photo-camera-subject-photographer-51383.jpeg?auto=compress&cs=tinysrgb&w=640&h=640&fit=crop" },
    { name: "Verdant Indoor Plant Kit", url: "https://images.pexels.com/photos/1084199/pexels-photo-1084199.jpeg?auto=compress&cs=tinysrgb&w=640&h=640&fit=crop" },
    { name: "Solaris Portable Solar Charger", url: "https://images.pexels.com/photos/356036/pexels-photo-356036.jpeg?auto=compress&cs=tinysrgb&w=640&h=640&fit=crop" },
    { name: "Midnight Denim Jacket", url: "https://images.pexels.com/photos/1124468/pexels-photo-1124468.jpeg?auto=compress&cs=tinysrgb&w=640&h=640&fit=crop" },
    { name: "Harmony Bluetooth Speaker", url: "https://images.pexels.com/photos/1279107/pexels-photo-1279107.jpeg?auto=compress&cs=tinysrgb&w=640&h=640&fit=crop" },
    { name: "Alpine Insulated Water Bottle", url: "https://images.pexels.com/photos/1000084/pexels-photo-1000084.jpeg?auto=compress&cs=tinysrgb&w=640&h=640&fit=crop" },
    { name: "The Art of Modern Design", url: "https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=640&h=640&fit=crop" },
    { name: "Swift Mechanical Keyboard", url: "https://images.pexels.com/photos/1772123/pexels-photo-1772123.jpeg?auto=compress&cs=tinysrgb&w=640&h=640&fit=crop" },
    { name: "Terra Hiking Backpack 40L", url: "https://images.pexels.com/photos/2905959/pexels-photo-2905959.jpeg?auto=compress&cs=tinysrgb&w=640&h=640&fit=crop" },
    { name: "Luma Smart Home Hub", url: "https://images.pexels.com/photos/4219862/pexels-photo-4219862.jpeg?auto=compress&cs=tinysrgb&w=640&h=640&fit=crop" },
    { name: "Cashmere Blend Scarf", url: "https://images.pexels.com/photos/45982/pexels-photo-45982.jpeg?auto=compress&cs=tinysrgb&w=640&h=640&fit=crop" },
    { name: "Origami Wooden Puzzle Set", url: "https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg?auto=compress&cs=tinysrgb&w=640&h=640&fit=crop" },
    { name: "ProFlex Resistance Band Kit", url: "https://images.pexels.com/photos/4397840/pexels-photo-4397840.jpeg?auto=compress&cs=tinysrgb&w=640&h=640&fit=crop" },
    { name: "Monochrome Minimalist Watch", url: "https://images.pexels.com/photos/190819/pexels-photo-190819.jpeg?auto=compress&cs=tinysrgb&w=640&h=640&fit=crop" },
];

function download(url, dest, maxRedirects = 5) {
    return new Promise((resolve, reject) => {
        if (maxRedirects <= 0) return reject(new Error("Too many redirects"));
        https.get(url, { timeout: 20000, headers: { "User-Agent": "Mozilla/5.0" } }, (res) => {
            if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
                res.resume();
                return download(res.headers.location, dest, maxRedirects - 1).then(resolve).catch(reject);
            }
            if (res.statusCode !== 200) {
                res.resume();
                return reject(new Error(`HTTP ${res.statusCode}`));
            }
            const file = fs.createWriteStream(dest);
            res.pipe(file);
            file.on("finish", () => file.close(resolve));
            file.on("error", (err) => { fs.unlink(dest, () => { }); reject(err); });
        }).on("error", reject);
    });
}

async function main() {
    console.log("Connecting...");
    const client = new MongoClient(DB_URL);
    await client.connect();
    const db = client.db();
    console.log("Connected!\n");

    if (!fs.existsSync(PRODUCTS_DIR)) fs.mkdirSync(PRODUCTS_DIR, { recursive: true });

    // Delete any non-seed products (the original "Ip 15")
    const del = await db.collection("products").deleteMany({ email: { $ne: SEED_EMAIL } });
    if (del.deletedCount > 0) console.log(`Removed ${del.deletedCount} non-seed product(s).`);

    // Get seed products
    const products = await db.collection("products")
        .find({ email: SEED_EMAIL })
        .sort({ createdAt: 1 })
        .toArray();

    console.log(`Updating ${products.length} products with relevant images...\n`);

    let ok = 0, fail = 0;
    for (let i = 0; i < products.length; i++) {
        const product = products[i];
        const imgInfo = PRODUCT_IMAGES.find(p => p.name === product.name);
        if (!imgInfo) { console.log(`  [${i + 1}] ${product.name} — no URL, skip`); continue; }

        const fname = `prod-${i + 1}-${Date.now()}.jpg`;
        const fpath = path.join(PRODUCTS_DIR, fname);
        const dbPath = `/products/${fname}`;

        process.stdout.write(`  [${String(i + 1).padStart(2)}/${products.length}] ${product.name.padEnd(38)} `);

        try {
            await download(imgInfo.url, fpath);
            const size = fs.existsSync(fpath) ? fs.statSync(fpath).size : 0;
            if (size > 2000) {
                await db.collection("products").updateOne(
                    { _id: product._id },
                    { $set: { images: [dbPath] } }
                );
                ok++;
                process.stdout.write(`OK (${Math.round(size / 1024)}KB)\n`);
            } else {
                fail++;
                process.stdout.write(`too small (${size}B)\n`);
            }
        } catch (err) {
            fail++;
            process.stdout.write(`FAIL: ${err.message}\n`);
        }

        await new Promise(r => setTimeout(r, 200));
    }

    console.log(`\nDone! ${ok} updated, ${fail} failed.`);
    console.log(`Total products: ${await db.collection("products").countDocuments()}`);

    await client.close();
    process.exit(0);
}

main().catch(err => { console.error(err.message); process.exit(1); });
