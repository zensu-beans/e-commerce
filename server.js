const path = require("path");
const express = require("express");
const cors = require("cors");
const db = require("./database");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

app.get("/", (req, res) => {
    res.send("E-commerce API is running");
});

app.get("/products", (req, res) => {
    db.all("SELECT * FROM products", [], (err, rows) => {
        if (err) {
            return res.status(500).json(err);
        }

        res.json(rows);
    });
});

app.post("/products", (req, res) => {
    const { name, price } = req.body;

    db.run(
        "INSERT INTO products(name, price) VALUES (?, ?)",
        [name, price],
        function(err) {
            if (err) {
                return res.status(500).json(err);
            }

            res.json({
                id: this.lastID,
                name,
                price
            });
        }
    );
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});