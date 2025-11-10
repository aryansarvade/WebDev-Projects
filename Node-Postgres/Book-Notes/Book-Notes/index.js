// index.js
import express from "express";
import axios from "axios";
import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Serve static files from public/
app.use(express.static("public"));
app.set("view engine", "ejs");

// PostgreSQL connection (Render-ready)
const db = new pg.Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT || 5432,
  ssl: { rejectUnauthorized: false },
});

// Connect to DB
async function connectDB() {
  try {
    await db.connect();
    console.log("✅ Connected to PostgreSQL successfully!");

    // Create table if not exists
    await db.query(`
      CREATE TABLE IF NOT EXISTS books (
        id SERIAL PRIMARY KEY,
        title TEXT,
        authors TEXT,
        thumbnail TEXT,
        published_date TEXT,
        keyword TEXT,
        rating NUMERIC,
        summary TEXT
      );
    `);
    console.log("✅ Verified or created 'books' table successfully!");
  } catch (err) {
    console.error("❌ Database connection/setup error:", err.message);
    process.exit(1);
  }
}

// Fetch 20 random books using Google Books API
async function fetchRandomBooks(keyword = "fiction") {
  const url = `https://www.googleapis.com/books/v1/volumes?q=${keyword}&maxResults=20&key=${process.env.GOOGLE_API_KEY}`;
  const response = await axios.get(url);
  return response.data.items || [];
}

// Home route: fetch, insert, and display books
app.get("/", async (req, res) => {
  try {
    const countResult = await db.query("SELECT COUNT(*) FROM books");
    const currentCount = parseInt(countResult.rows[0].count);

    if (currentCount >= 50) {
      console.log(
        "⚠️ Database limit reached (50 books). Displaying existing books."
      );
    } else {
      const keywords = [
        "science",
        "history",
        "psychology",
        "fiction",
        "art",
        "philosophy",
      ];
      const randomKeyword =
        keywords[Math.floor(Math.random() * keywords.length)];
      const books = await fetchRandomBooks(randomKeyword);

      for (const book of books) {
        const volume = book.volumeInfo;
        if (!volume.title || !volume.authors || !volume.imageLinks) continue;

        const query = `
          INSERT INTO books (title, authors, thumbnail, published_date, keyword, rating, summary)
          VALUES ($1, $2, $3, $4, $5, $6, $7)
          ON CONFLICT DO NOTHING;
        `;
        await db.query(query, [
          volume.title,
          volume.authors.join(", "),
          volume.imageLinks.thumbnail,
          volume.publishedDate || "Unknown",
          randomKeyword,
          (Math.random() * 5).toFixed(1), // random rating 0–5
          "A compelling narrative that explores human ideas deeply.", // placeholder summary
        ]);
      }
      console.log("✅ Books fetched and inserted successfully!");
    }

    const allBooks = await db.query(
      "SELECT * FROM books ORDER BY id DESC LIMIT 50"
    );
    res.render("index", { books: allBooks.rows });
  } catch (err) {
    console.error("❌ Error fetching or displaying books:", err.message);
    res.status(500).send("Error fetching books.");
  }
});

// Start server after DB connection
connectDB().then(() => {
  app.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
  });
});
