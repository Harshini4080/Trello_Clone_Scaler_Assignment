const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();

app.use(cors());
app.use(express.json());

// ---------------------- SERVER ----------------------
app.listen(5000, () => {
  console.log("🚀 Server running on port 5000");
});

// ---------------------- TEST DB ----------------------
app.get("/", (req, res) => {
  res.send("Trello Clone Backend is running!");
});

// ---------------------- BOARDS ----------------------

// Get all boards
app.get("/boards", (req, res) => {
  db.query("SELECT * FROM boards", (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

// Create a new board
app.post("/boards", (req, res) => {
  const { title } = req.body;

  db.query(
    "INSERT INTO boards (title) VALUES (?)",
    [title],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ id: result.insertId, title });
    }
  );
});

// ---------------------- LISTS ----------------------

// Get lists for a board
app.get("/boards/:boardId/lists", (req, res) => {
  const { boardId } = req.params;

  db.query(
    "SELECT * FROM lists WHERE board_id = ? ORDER BY position",
    [boardId],
    (err, results) => {
      if (err) return res.status(500).json(err);
      res.json(results);
    }
  );
});

// Create a list
app.post("/lists", (req, res) => {
  const { board_id, title, position } = req.body;

  db.query(
    "INSERT INTO lists (board_id, title, position) VALUES (?, ?, ?)",
    [board_id, title, position],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ id: result.insertId, board_id, title, position });
    }
  );
});

// Update list title
app.put("/lists/:id", (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  db.query(
    "UPDATE lists SET title = ? WHERE id = ?",
    [title, id],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "List updated successfully" });
    }
  );
});

// Delete list
app.delete("/lists/:id", (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM lists WHERE id = ?", [id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "List deleted successfully" });
  });
});

// ---------------------- CARDS ----------------------

// Get cards for a list
app.get("/lists/:listId/cards", (req, res) => {
  const { listId } = req.params;

  db.query(
    "SELECT * FROM cards WHERE list_id = ? ORDER BY position",
    [listId],
    (err, results) => {
      if (err) return res.status(500).json(err);
      res.json(results);
    }
  );
});

// Create a card
app.post("/cards", (req, res) => {
  const { list_id, title, description, position } = req.body;

  db.query(
    "INSERT INTO cards (list_id, title, description, position) VALUES (?, ?, ?, ?)",
    [list_id, title, description || "", position],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({
        id: result.insertId,
        list_id,
        title,
        description,
        position
      });
    }
  );
});

// Update card
app.put("/cards/:id", (req, res) => {
  const { id } = req.params;
  const { title, description, due_date, is_archived } = req.body;

  db.query(
    "UPDATE cards SET title = ?, description = ?, due_date = ?, is_archived = ? WHERE id = ?",
    [title, description, due_date, is_archived, id],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Card updated successfully" });
    }
  );
});

// Delete card
app.delete("/cards/:id", (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM cards WHERE id = ?", [id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Card deleted successfully" });
  });
});

// ---------------------- DRAG & DROP (MOVE CARD) ----------------------
app.put("/cards/move", (req, res) => {
  const { cardId, newListId, newPosition } = req.body;

  db.query(
    "UPDATE cards SET list_id = ?, position = ? WHERE id = ?",
    [newListId, newPosition, cardId],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Card moved successfully" });
    }
  );
});
