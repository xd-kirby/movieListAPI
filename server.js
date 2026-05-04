const express = require("express");
//const sqlite3 = require("sqlite3");
const app = express();
const PORT = 3000;
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello, from the express app that will soon be handed in!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
