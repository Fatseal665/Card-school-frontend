"use client";

import { useState } from "react";
import styles from "./BlackjackPage.module.css";

import { CardDTO } from "@/app/_types/card";
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
      const initialDeal = await newGame();

      setPlayerCards(initialDeal.playerCards);
      setDealerCards(initialDeal.dealerCards);
      setPlayerPoints(initialDeal.playerPoints);

      setDealerPoints(null);
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
    <div className={styles.page}>
      {/* Page title */}
      <h1 className={styles.title}>Blackjack</h1>

      {/* Table wrapper */}
      <div className={styles.table}>
        {/* Dealer cards */}
        <DealerHand cards={dealerCards} />

        {/* Player cards */}
        <PlayerHand cards={playerCards} />

        {/* Points and messages */}
        <div className={styles.info}>
          {/* Dealer points */}
          {dealerCards.length > 0 && (
            <p>
              <strong>Dealer points:</strong> {dealerPointsDisplay()}
            </p>
          )}

          {/* Blackjack message */}
          {playerPoints !== null && gameOver && playerPoints === 21 && (
            <p className={styles.blackjack}>BLACKJACK</p>
          )}

          {/* Bust message */}
          {playerPoints !== null && playerPoints > 21 && (
            <p className={styles.bust}>BUST</p>
          )}

          {/* Player points */}
          {playerPoints !== null && (
            <p>
              <strong>Your points:</strong> {playerPoints}
            </p>
          )}
        </div>

        {/* Buttons for game actions */}
        <div className={styles.controls}>
          <button onClick={handleNewGame}>New</button>
          <button onClick={handleHit} disabled={gameOver}>
            Hit
          </button>
          <button onClick={handleStay} disabled={gameOver}>
            Stay
          </button>
        </div>
      </div>

      {/* General game messages */}
      {message && <p className={styles.message}>{message}</p>}
    </div>
  );
}
