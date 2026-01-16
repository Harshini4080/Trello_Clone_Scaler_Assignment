import { useEffect, useState } from "react";
import { getCards, createCard } from "../services/api";

function List({ list }) {
  const [cards, setCards] = useState([]);
  const [showInput, setShowInput] = useState(false);
  const [title, setTitle] = useState("");

  useEffect(() => {
    fetchCards();
  }, [list.id]);

  const fetchCards = async () => {
    try {
      const res = await getCards(list.id);
      setCards(res.data);
    } catch (err) {
      console.error("Error fetching cards:", err);
    }
  };

  const addCard = async () => {
    if (!title.trim()) return;

    try {
      await createCard({
        list_id: list.id,
        title,
        description: "",
        position: cards.length + 1,
      });

      setTitle("");
      setShowInput(false);
      fetchCards();
    } catch (err) {
      console.error("Error creating card:", err);
    }
  };

 
  const getListClass = () => {
    const name = list.title.toLowerCase();
    if (name.includes("today")) return "today";
    if (name.includes("week")) return "this-week";
    if (name.includes("later")) return "later";
    return "";
  };

  return (
    <div className={`trello-list ${getListClass()}`}>
      {/* -------- List Header -------- */}
      <div className="list-header">
        <span className="list-title">{list.title}</span>

        <div className="list-actions">
          <span>⇄</span>
          <span>⋯</span>
        </div>
      </div>

      {/* -------- Cards -------- */}
      <div className="list-cards">
  {cards.map((card, index) => (
    <div
      key={card.id}
      className={`card-item ${index === 0 ? "first-card" : ""}`}
    >
      <div className="card-circle"></div>
      <span className="card-text">{card.title}</span>
      <span className="card-edit">✎</span>
    </div>
  ))}
</div>


      {/* -------- Add Card -------- */}
      {showInput ? (
        <div className="add-card-area">
          <textarea
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter a title for this card..."
            autoFocus
          />
          <div>
            <button onClick={addCard}>Add card</button>
            <button
              style={{ marginLeft: "8px", background: "transparent", color: "#fff" }}
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
        <div className="add-card-btn" onClick={() => setShowInput(true)}>
          + Add a card
        </div>
      )}
    </div>
  );
}

export default List;
