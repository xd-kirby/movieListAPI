const express = require("express");
const sqlite3 = require("sqlite3");
const app = express();
const PORT = 3000;
app.use(express.json());

const db = new sqlite3.Database("./movies.db");
db.run(`CREATE TABLE IF NOT EXISTS movies (
  id INTEGER PRIMARY KEY,
  title TEXT NOT NULL,
  genre TEXT NOT NULL,
  watched BOOLEAN NOT NULL,
  rating INTEGER NOT NULL,
  year INTEGER NOT NULL
);
`);

// app.get("/", (req, res) => {
//   res.send("Hello, from the express app that will soon be handed in!");
// });

app.get("/movies", (req, res) => {
  db.all("SELECT * from movies", (error, rows) => {
    if (rows.length === 0) {
      res.status(200).json({ message: "No movies found" });
      return;
    }
    res.json(rows);
  });
});

app.get("/movies/:id", (req, res) => {
  const movieId = req.params.id;
  db.get("SELECT * FROM movies WHERE id = ?", [movieId], (error, row) => {
    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }
    if (!row) {
      res.status(404).json({ message: "Movie not found" });
      return;
    }
    res.json(row);
  });
});

app.post("/movies", (req, res) => {
  const title = req.body.title;
  const genre = req.body.genre;
  const watched = req.body.watched;
  const rating = req.body.rating;
  const year = req.body.year;

  console.log(title, genre, watched, rating, year);

  if (!title) {
    res.status(400).json({ error: "Title is required" });
    return;
  }
  if (!year) {
    res.status(400).json({ error: "Year is required" });
    return;
  }

  //fix the issue with the same movie being added multiple times
  db.run(
    "INSERT INTO movies (title, genre, watched, rating, year) VALUES (?, ?, ?, ?, ?)",
    [title, genre, watched, rating, year],
    function (error) {
      if (error) {
        res.status(500).json({ error: error.message });
        return;
      }
      res.status(201).json({ message: "Movie created successfully!" });
    },
  );
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
