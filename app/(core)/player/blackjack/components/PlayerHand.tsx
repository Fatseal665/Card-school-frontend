import { CardDTO } from "@/app/_types/card";
import styles from "./PlayerHand.module.css";

interface Props {
  cards: CardDTO[];
}

export default function PlayerHand({ cards }: Props) {
  return (
    <div className={styles.playerHand}>
      {cards.map((card, i) => (
        <img
          key={i}
          src={card.imagePath}
          alt={card.displayName}
          className={styles.card}
        />
      ))}
    </div>
  );
}
