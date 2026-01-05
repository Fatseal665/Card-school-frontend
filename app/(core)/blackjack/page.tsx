"use client";

import { useState } from "react";
import { CardDTO } from "@/app/_types/card";
import { BlackJackInitialDealDTO } from "@/app/_types/blackjack-initial-deal";
import { BlackJackStateDTO } from "@/app/_types/blackjack-state-dto";
import { newGame, playerHit, stay } from "@/app/_services/blackjackApi";
import PlayerHand from "./components/PlayerHand";
import DealerHand from "./components/DealerHand";

export default function BlackjackPage() {
  const [playerCards, setPlayerCards] = useState<CardDTO[]>([]);
  const [dealerCards, setDealerCards] = useState<CardDTO[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [message, setMessage] = useState("");


// Applies a full Blackjack game state from the backend:
// - updates player/dealer cards
// - updates gameOver flag
// - determines and sets the correct UI message (bust, win, lose)
  const applyState = (state: BlackJackStateDTO) => {
  setPlayerCards(state.playerCards);
  setDealerCards(state.dealerCards);
  setGameOver(state.gameOver);

  if (state.playerPoints > 21) {
    setMessage("You went bust\nDealer wins!");
  } else if (state.gameOver) {
    if (state.dealerPoints && state.dealerPoints > 21) {
      setMessage("Dealer went bust\nYou win!");
    } else {
      setMessage(
        state.playerPoints >= (state.dealerPoints ?? 0)
          ? "You win!"
          : "Dealer wins!"
      );
    }
  } else {
    setMessage("");
  }
};


  // Start new game
  const handleNewGame = async () => {
    try {
      const initialDeal: BlackJackInitialDealDTO = await newGame();

      setPlayerCards(initialDeal.playerCards ?? []);
      setDealerCards(initialDeal.dealerCards ?? []);
      setGameOver(false);
      setMessage("");
    } catch (error) {
      console.error("Failed to start new game", error);
    }
  };

  // Player hits
  const handleHit = async () => {
  if (gameOver) return;

  const state = await playerHit();
  applyState(state);
};


  // Player stays
  const handleStay = async () => {
  if (gameOver) return;

  const state = await stay();
  applyState(state);
};


  return (
    <div style={{ padding: 20 }}>
      <h1>Blackjack</h1>

      <DealerHand cards={dealerCards} />
      <PlayerHand cards={playerCards} />

      <div style={{ marginTop: 20 }}>
        <button onClick={handleNewGame} style={{ marginRight: 10 }}>
          New Game
        </button>
        <button onClick={handleHit} disabled={gameOver} style={{ marginRight: 10 }}>
          Hit
        </button>
        <button onClick={handleStay} disabled={gameOver}>
          Stay
        </button>
      </div>

      {message && (
        <p style={{ marginTop: 20, whiteSpace: "pre-line" }}>
          {message}
        </p>
      )}
    </div>
  );
}
