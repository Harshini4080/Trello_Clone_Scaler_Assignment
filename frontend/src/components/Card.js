import React from "react";

function Card({ card }) {
  return (
    <div style={styles.card}>
      {card.title}
    </div>
  );
}

export default Card;

const styles = {
  card: {
    background: "#fff",
    color: "#172b4d",
    padding: "8px",
    borderRadius: "8px",
    marginBottom: "8px",
    boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
    cursor: "pointer",
  },
};
