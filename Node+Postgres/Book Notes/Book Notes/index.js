import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import pg from "pg";

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// Database connection
const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "book_notes",
  password: "12345678",
  port: "5432",
});
db.connect();

/* The Google Books API doesn’t have a “random” endpoint —
so we fake randomness by searching for different popular keywords
and taking a few books from each. */
const randomKeywords = [
  "history",
  "science",
  "love",
  "war",
  "music",
  "art",
  "technology",
  "fiction",
  "philosophy",
  "nature",
  "psychology",
  "travel",
  "space",
  "culture",
  "education",
  "health",
  "leadership",
  "biography",
  "business",
  "adventure",
];

app.get("/", async (req, res) => {
  try {
    // 1️⃣ Check how many books are currently stored
    const countResult = await db.query("SELECT COUNT(*) FROM books");
    const currentCount = parseInt(countResult.rows[0].count);

    // 2️⃣ If already 50 or more, skip inserting new books
    if (currentCount >= 50) {
      console.log("Database limit reached (50 books). No new books added.");
    } else {
      const selectedKeywords = randomKeywords
        .sort(() => 0.5 - Math.random())
        .slice(0, 5); // pick 5 random topics
      let allBooks = [];

      for (const keyword of selectedKeywords) {
        const API_URL = `https://www.googleapis.com/books/v1/volumes?q=${keyword}&maxResults=5`;
        const response = await axios.get(API_URL);

        if (response.data.items) {
          const books = response.data.items.map((item) => {
            const info = item.volumeInfo;
            return {
              title: info.title || "No title",
              authors: info.authors ? info.authors.join(", ") : "Unknown",
              thumbnail: info.imageLinks?.thumbnail || "",
              published_date: info.publishedDate || null,
              keyword,
            };
          });
          allBooks = allBooks.concat(books);
        }
      }

      // Store into PostgreSQL
      for (const book of allBooks) {
        await db.query(
          `INSERT INTO books (title, authors, thumbnail, published_date, keyword)
         VALUES ($1, $2, $3, $4, $5);`,
          [
            book.title,
            book.authors,
            book.thumbnail,
            book.published_date,
            book.keyword,
          ]
        );
      }
    }
    // Render Index.ejs
    console.log("Render index.ejs");
    const result = await db.query("SELECT * FROM books");
    let books = result.rows;
    res.render("index.ejs", { books: books });
  } catch (error) {
    console.error("Error fetching books:", error.message);
    res.status(500).json({ error: "Failed to fetch random books" });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
