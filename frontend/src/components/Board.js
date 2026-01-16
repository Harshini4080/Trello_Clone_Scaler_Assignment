import React, { useEffect, useState, useCallback } from "react";
import { getLists, createList } from "../services/api";
import List from "./List";

function Board({ board }) {
  const [lists, setLists] = useState([]);
  const [showInput, setShowInput] = useState(false);
  const [title, setTitle] = useState("");

  const fetchLists = useCallback(async () => {
    try {
      const res = await getLists(board.id);
      setLists(res.data);
    } catch (err) {
      console.error("Error fetching lists:", err);
    }
  }, [board?.id]);

  useEffect(() => {
    if (board?.id) {
      fetchLists();
    }
  }, [board?.id, fetchLists]);

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

        <div className="add-list-container">
          {showInput ? (
            <>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter list title..."
                className="add-list-input"
              />
              <button className="add-list-btn" onClick={addList}>
                Add list
              </button>
            </>
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
