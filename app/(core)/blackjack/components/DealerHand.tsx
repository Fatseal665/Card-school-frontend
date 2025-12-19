import { CardDTO } from "@/app/_types/card";

interface Props {
  cards: CardDTO[];
}

export default function DealerHand({ cards }: Props) {
  return (
    <div style={{ display: "flex", gap: 8 }}>
      {cards.map((card, i) => (
        <img
          key={i}
          src={card.imagePath}
          alt={card.faceDown ? "Hidden card" : card.displayName}
          style={{ width: 80 }}
        />
      ))}
    </div>
  );
}
