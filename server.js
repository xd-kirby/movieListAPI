const express = require("express");
const sqlite3 = require("sqlite3");
const app = express();
const PORT = 3000;
app.use(express.json());

const db = new sqlite3.Database("./movies.db");

function validateMovie({ title, genre, watched, rating, year }) {
  if (!title) return "Title is required";
  if (typeof title !== "string") return "Title must be a string";
  if (!genre) return "Genre is required";
  if (typeof genre !== "string") return "Genre must be a string";
  if (watched === undefined || watched === null)
    return "Watched status is required";
  if (typeof watched !== "boolean")
    return "Watched must be a boolean value (true or false)";
  if (rating === undefined || rating === null)
    return "Rating is required (input 0 if not watched yet)";
  if (typeof rating !== "number") return "Rating must be a number";
  if (rating < 0 || rating > 10) return "Rating must be between 0 and 10";
  if (!year) return "Year is required";
  if (typeof year !== "number") return "Year must be a number";
  return null;
}

db.run(`CREATE TABLE IF NOT EXISTS movies (
  id INTEGER PRIMARY KEY,
  title TEXT NOT NULL,
  genre TEXT NOT NULL,
  watched BOOLEAN NOT NULL,
  rating INTEGER NOT NULL,
  year INTEGER NOT NULL
);
`);

app.get("/movies", (req, res) => {
  db.all("SELECT * from movies", (error, rows) => {
    if (rows.length === 0) {
      res.status(200).json({ message: "No movies found" });
      return;
    }
    if (error) {
      res.status(500).json({ error: error.message });
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

  const validationError = validateMovie(req.body);
  if (validationError) {
    res.status(400).json({ error: validationError });
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

app.put("/movies/:id", (req, res) => {
  const movieId = req.params.id;
  const title = req.body.title;
  const genre = req.body.genre;
  const watched = req.body.watched;
  const rating = req.body.rating;
  const year = req.body.year;

  const validationError = validateMovie(req.body);
  if (validationError) {
    res.status(400).json({ error: validationError });
    return;
  }

  db.get("SELECT id FROM movies WHERE id = ?", [movieId], (error, row) => {
    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }
    if (!row) {
      res.status(404).json({ message: "Movie not found" });
      return;
    }
    db.run(
      "UPDATE movies SET title = ?, genre = ?, watched = ?, rating = ?, year = ? WHERE id = ?",
      [title, genre, watched, rating, year, movieId],
      function (error) {
        if (error) {
          res.status(500).json({ error: error.message });
          return;
        }

        res.json({ message: "Movie updated successfully!" });
      },
    );
  });
});

app.delete("/movies/:id", (req, res) => {
  const movieId = req.params.id;
  db.get("SELECT id FROM movies WHERE id = ?", [movieId], (error, row) => {
    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }
    if (!row) {
      res.status(404).json({ message: "Movie not found" });
      return;
    }
    db.run("DELETE FROM movies WHERE id = ?", [movieId], function (error) {
      if (error) {
        res.status(500).json({ error: error.message });
        return;
      }
      res.json({ message: "Movie deleted successfully!" });
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
