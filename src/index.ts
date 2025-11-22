import express from "express";
import sqlite3 from "sqlite3";
import { open } from "sqlite";

const app = express();
app.use(express.json());
app.use(express.static("public"));

let db: any;

async function initDB() {
  db = await open({
    filename: "todolist.db",
    driver: sqlite3.Database,
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS todos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      text TEXT NOT NULL
    )
  `);
}

app.get("/api/todos", async (req, res) => {
  const todos = await db.all("SELECT * FROM todos");
  res.json(todos);
});

app.post("/api/todos", async (req, res) => {
  const { text } = req.body;
  await db.run("INSERT INTO todos (text) VALUES (?)", [text]);
  res.json({ success: true });
});

app.delete("/api/todos/:id", async (req, res) => {
  const { id } = req.params;
  await db.run("DELETE FROM todos WHERE id = ?", [id]);
  res.json({ success: true });
});

initDB().then(() => {
  app.listen(3000, () => console.log("Server running at http://localhost:3000"));
});