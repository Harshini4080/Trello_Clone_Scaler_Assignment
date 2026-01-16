import { useEffect, useState } from "react";
import { getCards, createCard } from "../services/api";
import Card from "./Card";

function List({ list }) {
  const [cards, setCards] = useState([]);
  const [newCard, setNewCard] = useState("");

  useEffect(() => {
    fetchCards();
  }, []);

  const fetchCards = async () => {
    const res = await getCards(list.id);
    setCards(res.data);
  };

  const addCard = async () => {
    if (!newCard) return;

    await createCard({
      list_id: list.id,
      title: newCard,
      description: "",
      position: cards.length + 1,
    });

    setNewCard("");
    fetchCards();
  };

  return (
    <div style={styles.list}>
      <h4>{list.title}</h4>

      {cards.map((card) => (
        <Card key={card.id} card={card} />
      ))}

      <input
        value={newCard}
        onChange={(e) => setNewCard(e.target.value)}
        placeholder="+ Add a card"
        style={styles.input}
      />
      <button onClick={addCard} style={styles.btn}>Add</button>
    </div>
  );
}

const styles = {
  list: {
    background: "#ebecf0",
    padding: "10px",
    width: "260px",
    borderRadius: "8px",
  },
  input: {
    width: "100%",
    padding: "6px",
    marginTop: "6px",
  },
  btn: {
    width: "100%",
    marginTop: "4px",
    cursor: "pointer",
  },
};

export default List;
