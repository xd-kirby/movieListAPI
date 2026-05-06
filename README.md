# 🎬 MovieListAPI

A simple REST API built with **Node.js, Express, and SQLite** for managing a list of movies.
Supports full CRUD functionality with input validation.

---

## 🚀 Features

* Get all movies
* Get a movie by ID
* Add a new movie
* Update an existing movie
* Delete a movie
* Built-in validation for all inputs
* SQLite database (auto-created)

---

## 🛠️ Tech Stack

* Node.js
* Express
* SQLite3

---

## 📦 Installation

Clone the repository:

```bash
git clone https://github.com/xd-kirby/movieListAPI.git
cd movieListAPI
```

Install dependencies:

```bash
npm install
```

---

## ▶️ Running the Server

```bash
node server.js
```

Server runs on:

```
http://localhost:3000
```

---

## 🗄️ Database

* File: `movies.db`
* Automatically created on startup

### Schema

```sql
CREATE TABLE movies (
  id INTEGER PRIMARY KEY,
  title TEXT NOT NULL,
  genre TEXT NOT NULL,
  watched BOOLEAN NOT NULL,
  rating INTEGER NOT NULL,
  year INTEGER NOT NULL
);
```

---

## 📡 API Endpoints

### GET /movies

Get all movies

**Response:**

```json
[
  {
    "id": 1,
    "title": "Inception",
    "genre": "Sci-Fi",
    "watched": true,
    "rating": 9,
    "year": 2010
  }
]
```

If no movies exist:

```json
{
  "message": "No movies found"
}
```

---

### GET /movies/:id

Get a specific movie by ID

**Errors:**

* `404` – Movie not found

---

### POST /movies

Create a new movie

**Request body:**

```json
{
  "title": "Inception",
  "genre": "Sci-Fi",
  "watched": true,
  "rating": 9,
  "year": 2010
}
```

**Validation rules:**

* All fields are required
* `title`, `genre` must be non-empty strings
* `watched` must be boolean
* `rating` must be a number between 0–10
* `year` must be an integer

---

### PUT /movies/:id

Update an existing movie (replaces all fields)

**Request body:**
Same as POST

**Errors:**

* `400` – Invalid input
* `404` – Movie not found

---

### DELETE /movies/:id

Delete a movie

**Errors:**

* `404` – Movie not found

---

## 🧪 Testing (Postman)

A Postman collection JSON file is included in the repository.

### How to use:

1. Open Postman
2. Click **Import**
3. Select the JSON file
4. Run requests directly

---

## 📁 Project Structure

```
movieListAPI/
├── server.js
├── movies.db
├── package.json
├── package-lock.json
├── .gitignore
├── postman_collection.json
└── README.md
```

---

## ⚠️ Notes

* `node_modules/` is excluded via `.gitignore`
* Duplicate movies are currently allowed
* SQLite stores booleans as `0` and `1`
* Quary parameter for the genre is case sensitive (first letter needs to be capitalised. E.g. "Sci-Fi" or "Horror")
* PUT requires all fields (no PATCH for partial updates)

---

## 📄 License

This project is not licensed. All rights reserved.
