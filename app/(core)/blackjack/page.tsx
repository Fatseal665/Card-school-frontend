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
  const [playerPoints, setPlayerPoints] = useState<number | null>(null);
  const [dealerPoints, setDealerPoints] = useState<number | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const [message, setMessage] = useState("");

  // Applies a full Blackjack game state from the backend:
  // - updates player/dealer cards
  // - updates gameOver flag
  // - determines and sets the correct UI message (bust, win, lose)
  // Applies the current state from the backend to the frontend.
  // Updates player/dealer cards, points, gameOver, and messages.

  const applyState = (state: BlackJackStateDTO) => {
    // Update cards
    setPlayerCards(state.playerCards ?? []);
    setDealerCards(state.dealerCards ?? []);

    // Update game state
    setGameOver(state.gameOver);

    // Update points
    setPlayerPoints(state.playerPoints);
    setDealerPoints(state.dealerPoints ?? null);

    // Update message based on bust or winner
    if (state.playerPoints > 21) {
      setMessage("You went bust\nDealer wins!");
    } else if (state.dealerPoints && state.dealerPoints > 21) {
      setMessage("Dealer went bust\nYou win!");
    } else if (state.gameOver) {
      // Game is over but nobody went bust
      setMessage(
        state.playerPoints >= (state.dealerPoints ?? 0)
          ? "You win!"
          : "Dealer wins!"
      );
    } else {
      // Game ongoing
      setMessage("");
    }
  };

  // Start new game
  const handleNewGame = async () => {
  try {
    const initialDeal: BlackJackInitialDealDTO = await newGame();

    // Skapa ett state-objekt som frontend kan använda
    const initialState: BlackJackStateDTO = {
      playerCards: initialDeal.playerCards ?? [],
      dealerCards: initialDeal.dealerCards ?? [],
      playerPoints: initialDeal.playerPoints,
      dealerPoints: initialDeal.dealerPoints,
      gameOver: false,
    };

    applyState(initialState);
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

  // Displays dealer card + hidden card
  const dealerPointsDisplay = () => {
  if (!gameOver && dealerCards.length > 1) {
    // First card's blackjack value + hidden
    return `${dealerCards[0].blackjackValue} + ?`;
  }
  return dealerPoints !== null ? dealerPoints : "";
};


  // Game page visuals
  return (
    <div style={{ padding: 20 }}>
      <h1>Blackjack</h1>

      <DealerHand cards={dealerCards} />
      <PlayerHand cards={playerCards} />

      <div style={{ marginBottom: 12 }}>
        {/* Dealer points */}
        {dealerCards.length > 0 && (
          <p>
            <strong>Dealer points:</strong> {dealerPointsDisplay()}
          </p>
        )}

        {/* Blackjack message */}
        {playerPoints !== null && gameOver && playerPoints === 21 && (
          <p style={{ color: "green", fontWeight: "bold" }}>BLACKJACK</p>
        )}

        {/* Bust message */}
        {playerPoints !== null && playerPoints > 21 && (
          <p style={{ color: "red", fontWeight: "bold" }}>BUST</p>
        )}

        {/* Player points */}
        {playerPoints !== null && (
          <p>
            <strong>Your points:</strong> {playerPoints}
          </p>
        )}
      </div>

      <div style={{ marginTop: 20 }}>
        <button onClick={handleNewGame} style={{ marginRight: 10 }}>
          New Game
        </button>
        <button
          onClick={handleHit}
          disabled={gameOver}
          style={{ marginRight: 10 }}
        >
          Hit
        </button>
        <button onClick={handleStay} disabled={gameOver}>
          Stay
        </button>
      </div>

      {message && (
        <p style={{ marginTop: 20, whiteSpace: "pre-line" }}>{message}</p>
      )}
    </div>
  );
}
