import { CardDTO } from "./card";

export interface BlackJackResultDTO {
  dealerCards: CardDTO[];
  playerPoints: number;
  dealerPoints: number;
  playerWins: boolean;
}
