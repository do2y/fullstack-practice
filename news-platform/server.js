const express = require("express");
const mysql = require("mysql2/promise");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = 3000;

app.use(express.json());
app.use("/public", express.static(path.join(__dirname, "public")));

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "news_db",
  waitForConnections: true,
  connectionLimit: 5,
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "templates", "index.html"));
});

app.get("/api/news", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, title, category, author FROM news ORDER BY id DESC",
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "error" });
  }
});

app.post("/api/news", async (req, res) => {
  try {
    const { title, category, content, author } = req.body;

    await pool.query(
      "INSERT INTO news (title, category, content, author) VALUES (?, ?, ?, ?)",
      [title, category, content, author],
    );

    res.json({ message: "ok" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "error" });
  }
});

app.get("/api/news/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.query("SELECT * FROM news WHERE id = ?", [id]);

    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "error" });
  }
});

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
