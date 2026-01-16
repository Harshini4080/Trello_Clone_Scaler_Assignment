import { useEffect, useState, useCallback } from "react";
import { getCards, createCard } from "../services/api";

function List({ list }) {
  const [cards, setCards] = useState([]);
  const [showInput, setShowInput] = useState(false);
  const [title, setTitle] = useState("");

  const fetchCards = useCallback(async () => {
    try {
      const res = await getCards(list.id);
      setCards(res.data);
    } catch (err) {
      console.error("Error fetching cards:", err);
    }
  }, [list.id]);

  useEffect(() => {
    fetchCards();
  }, [fetchCards]);

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

  return (
    <div className={`trello-list ${list.color}`}>
      <div className="list-header">
        <span className="list-title">{list.title}</span>
        <div className="list-icons">
          <span className="list-icon">⇄</span>
          <span className="list-icon">⋯</span>
        </div>
      </div>

      <div className="list-cards">
        {cards.map((card) => (
          <div key={card.id} className="card-item">
            {card.title}
          </div>
        ))}
      </div>

      {showInput ? (
        <div className="add-card-area">
          <textarea
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter a title for this card..."
          />
          <button onClick={addCard}>Add card</button>
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
