import { CardDTO } from "./card";

export interface BlackJackStateDTO {
  playerCards: CardDTO[];
  dealerCards: CardDTO[];
  playerPoints: number;
  dealerPoints?: number | null;
  gameOver: boolean;
}
