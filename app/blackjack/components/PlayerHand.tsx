import { CardDTO } from "@/app/_types/card";

interface PlayerHandProps {
  cards: CardDTO[];
}

// Component to render the player's hand at the bottom of the screen
export default function PlayerHand({ cards }: PlayerHandProps) {
  return (
    <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
      {cards.map((card, index) => (
        <img
          key={index}
          src={card.imagePath} // Path to the card image
          alt={`${card.value} of ${card.suit}`}
          style={{ width: "80px", height: "120px" }}
        />
      ))}
    </div>
  );
}
