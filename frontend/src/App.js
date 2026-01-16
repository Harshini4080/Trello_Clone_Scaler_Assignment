import { useEffect, useState } from "react";
import Board from "./components/Board";
import { getBoards } from "./services/api";
import "./index.css";

function App() {
  const [board, setBoard] = useState(null);

  // Inbox states
  const [showInboxInput, setShowInboxInput] = useState(false);
  const [inboxTitle, setInboxTitle] = useState("");
  const [inboxCards, setInboxCards] = useState([]);
  const [activeInboxCard, setActiveInboxCard] = useState(null);

  useEffect(() => {
    fetchBoard();
  }, []);

  const fetchBoard = async () => {
    try {
      const res = await getBoards();
      setBoard(res.data[0]);
    } catch (err) {
      console.error("Error fetching board:", err);
    }
  };

  // Add Inbox Card
  const handleAddInboxCard = () => {
    if (!inboxTitle.trim()) return;

    setInboxCards((prev) => [
      ...prev,
      {
        title: inboxTitle,
        completed: false,
        description: "",
        comments: [],
      },
    ]);

    setInboxTitle("");
    setShowInboxInput(false);
  };

  // Toggle Complete
  const toggleComplete = (index) => {
    setInboxCards((prev) =>
      prev.map((card, i) =>
        i === index ? { ...card, completed: !card.completed } : card
      )
    );
  };

  // Edit Card
  const editInboxCard = (index) => {
    const updatedTitle = prompt("Edit card title", inboxCards[index].title);
    if (!updatedTitle) return;

    setInboxCards((prev) =>
      prev.map((card, i) =>
        i === index ? { ...card, title: updatedTitle } : card
      )
    );
  };

  // Add Comment
  const addComment = (text) => {
    if (!text.trim()) return;

    setInboxCards((prev) =>
      prev.map((card, i) =>
        i === activeInboxCard
          ? { ...card, comments: [...card.comments, text] }
          : card
      )
    );
  };

  return (
    <div className="app-root">
      {/* -------- Trello Navbar -------- */}
      <div className="trello-navbar">
        <div className="nav-left">
          <div className="nav-grid">☷</div>
          <div className="nav-logo">
            <span className="logo-icon">▮▮</span>
            <span className="logo-text">Trello</span>
          </div>
        </div>

        <div className="nav-center">
          <div className="search-container">
            <span className="search-icon">🔍</span>
            <input className="nav-search" placeholder="Search" />
          </div>
        </div>

        <div className="nav-right">
          <button className="create-btn">Create 🎉</button>
          <div className="days-badge">14 days left</div>
          <span className="nav-icon">🔔</span>
          <span className="nav-icon">❓</span>
          <div className="profile-circle">HR</div>
        </div>
      </div>

      <div className="main-layout">
        {/* -------- Sidebar -------- */}
        <div className="sidebar">
          <div className="sidebar-header">
            <span className="inbox-icon">📥</span>
            <h2>Inbox</h2>
          </div>

          {/* Add Card Section */}
          {!showInboxInput ? (
            <button
              className="add-card-btn"
              onClick={() => setShowInboxInput(true)}
            >
              Add a card
            </button>
          ) : (
            <div className="inbox-input-box">
              <input
                className="inbox-input"
                placeholder="Enter a title"
                value={inboxTitle}
                onChange={(e) => setInboxTitle(e.target.value)}
                autoFocus
              />
              <div className="inbox-actions">
                <button className="inbox-add-btn" onClick={handleAddInboxCard}>
                  Add card
                </button>
                <button
                  className="inbox-cancel-btn"
                  onClick={() => {
                    setShowInboxInput(false);
                    setInboxTitle("");
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Inbox Cards */}
          <div className="inbox-cards">
            {inboxCards.map((card, index) => (
              <div
                key={index}
                className={`inbox-card-item ${
                  card.completed ? "completed" : ""
                }`}
              >
                {/* Complete Circle */}
                <div
                  className={`inbox-circle ${
                    card.completed ? "checked" : ""
                  }`}
                  onClick={() => toggleComplete(index)}
                  title={
                    card.completed ? "Marked as completed" : "Mark complete"
                  }
                />

                {/* Card Text */}
                <span className="inbox-card-text">{card.title}</span>

                {/* Edit Button */}
                <button
                  className="inbox-edit-btn"
                  onClick={() => editInboxCard(index)}
                >
                  ✎
                </button>

                {/* Plus Button */}
                <div
                  className="inbox-plus-btn"
                  onClick={() => setActiveInboxCard(index)}
                >
                  +
                </div>
              </div>
            ))}
          </div>

          <div className="sidebar-footer">
            🔒 Inbox is only visible to you
          </div>
        </div>

        {/* -------- Board Area -------- */}
        <div className="board-area">
          {board ? <Board board={board} /> : <p>Loading...</p>}
        </div>
      </div>

      {/* -------- CARD MODAL -------- */}
      {activeInboxCard !== null && (
        <div
          className="modal-overlay"
          onClick={() => setActiveInboxCard(null)}
        >
          <div className="card-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-badge">IN YOUR INBOX</span>
              <button
                className="modal-close"
                onClick={() => setActiveInboxCard(null)}
              >
                ✕
              </button>
            </div>

            <h2 className="modal-title">
              {inboxCards[activeInboxCard].title}
            </h2>

            <div className="modal-body">
              <div className="modal-left">
                <div className="modal-actions">
                  <button>+ Add</button>
                  <button>Dates</button>
                  <button>Checklist</button>
                  <button>Attachment</button>
                </div>

                <div className="modal-section">
                  <h4>Description</h4>
                  <textarea
                    placeholder="Add a more detailed description..."
                    value={inboxCards[activeInboxCard].description}
                    onChange={(e) => {
                      const updated = [...inboxCards];
                      updated[activeInboxCard].description = e.target.value;
                      setInboxCards(updated);
                    }}
                  />
                </div>
              </div>

              <div className="modal-right">
                <h4>Comments and activity</h4>
                <input
                  placeholder="Write a comment..."
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      addComment(e.target.value);
                      e.target.value = "";
                    }
                  }}
                />

                <div className="modal-comments">
                  {inboxCards[activeInboxCard].comments.map((c, i) => (
                    <div key={i} className="comment-item">
                      <strong>HR</strong> {c}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
