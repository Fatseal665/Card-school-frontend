import { CardDTO } from "@/app/_types/card";
import styles from "./DealerHand.module.css";

interface Props {
  cards: CardDTO[];
}

export default function DealerHand({ cards }: Props) {
  return (
    <div className={styles.dealerHand}>
      {cards.map((card, i) => {
        const imgSrc = card.faceDown ? "/cards/hidden_card.svg" : card.imagePath;
        return (
          <img
            key={i}
            src={imgSrc}
            alt={card.faceDown ? "Hidden card" : card.displayName}
            className={styles.card}
          />
        );
      })}
    </div>
  );
}
