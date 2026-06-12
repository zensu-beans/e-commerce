const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./store.db", (err) => {
    if (err) {
        console.error(err.message);
    } else {
        console.log("Connected to SQLite.");
    }
});

db.serialize(() => {
    db.run(`
CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    price REAL NOT NULL,
    stock INTEGER DEFAULT 0,
    image_url TEXT,
    category TEXT
)
    `);

    db.run("ALTER TABLE products ADD COLUMN category TEXT", (err) => {
        if (err && !/duplicate column name/i.test(err.message)) {
            console.error("Failed to add category column:", err.message);
        }
    });

    db.get("SELECT COUNT(*) AS count FROM products", (err, row) => {
        if (err) {
            console.error("Failed to count products:", err.message);
            return;
        }

        if (!row || row.count === 0) {
            const products = [
                {
                    name: "iPhone 17 Pro",
                    description: "Apple iPhone 17 Pro smartphone with 256GB storage and advanced camera.",
                    price: 1199.99,
                    stock: 25,
                    category: "Smartphones",
                    image_url: "assets/apple-iphone.jpg"
                },
                {
                    name: "PlayStation 5 Console",
                    description: "Sony PlayStation 5 gaming console with DualSense controller.",
                    price: 499.99,
                    stock: 15,
                    category: "Gaming",
                    image_url: "assets/ps5.jpg"
                },
                {
                    name: "MacBook Air M3",
                    description: "Apple MacBook Air with M3 chip, 16GB RAM, and 512GB SSD.",
                    price: 1299.99,
                    stock: 10,
                    category: "Laptops",
                    image_url: "assets/laptop.jpg"
                }
            ];

            const stmt = db.prepare(`
INSERT INTO products (name, description, price, stock, image_url, category)
VALUES (?, ?, ?, ?, ?, ?)
            `);

            products.forEach(p => {
                stmt.run(p.name, p.description, p.price, p.stock, p.image_url, p.category);
            });

            stmt.finalize(() => {
                console.log("Seeded default products.");
            });
        }
    });
});

module.exports = db;