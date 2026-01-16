import React, { useEffect, useState } from "react";
import { getLists, createList } from "../services/api";
import List from "./List";

function Board({ board }) {
  const [lists, setLists] = useState([]);
  const [showInput, setShowInput] = useState(false);
  const [title, setTitle] = useState("");

  useEffect(() => {
    if (board?.id) {
      fetchLists();
    }
  }, [board?.id]);

  const fetchLists = async () => {
    try {
      const res = await getLists(board.id);
      setLists(res.data);
    } catch (err) {
      console.error("Error fetching lists:", err);
    }
  };

  const addList = async () => {
    if (!title.trim()) return;

    try {
      await createList({
        board_id: board.id,
        title,
        position: lists.length + 1,
      });

      setTitle("");
      setShowInput(false);
      fetchLists();
    } catch (err) {
      console.error("Error creating list:", err);
    }
  };

  return (
    <div className="board-container">
      <h2 className="board-title">{board.title}</h2>

      <div className="board-row">
        {lists.map((list) => (
          <List key={list.id} list={list} />
        ))}

        {/* Add List Column */}
        <div className="add-list-container">
          {showInput ? (
            <div className="add-list-box">
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter list title..."
                className="add-list-input"
                autoFocus
              />
              <div>
                <button className="add-list-btn" onClick={addList}>
                  Add list
                </button>
                <button
                  className="add-list-cancel"
                  onClick={() => {
                    setShowInput(false);
                    setTitle("");
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowInput(true)}
              className="add-list-btn-alt"
            >
              + Add another list
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Board;
