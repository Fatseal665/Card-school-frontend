"use client";

import { useState, useEffect } from "react";

import styles from "./BlackjackPage.module.css";

import { CardDTO } from "@/app/_types/card";
import { BlackJackStateDTO } from "@/app/_types/blackjack-state-dto";
import { newGame, playerHit, stay } from "@/app/_services/blackjackApi";
import PlayerHand from "./components/PlayerHand";
import DealerHand from "./components/DealerHand";
import { useRouter } from "next/navigation";

export default function BlackjackPage() {
  const [playerCards, setPlayerCards] = useState<CardDTO[]>([]);
  const [dealerCards, setDealerCards] = useState<CardDTO[]>([]);
  const [playerPoints, setPlayerPoints] = useState<number | null>(null);
  const [dealerPoints, setDealerPoints] = useState<number | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const [message, setMessage] = useState("");
  const [paused, setPaused] = useState(false);
  const router = useRouter();

  // Applies game state
  const applyState = (state: BlackJackStateDTO) => {
    setPlayerCards(state.playerCards ?? []);
    setDealerCards(state.dealerCards ?? []);
    setGameOver(state.gameOver);
    setPlayerPoints(state.playerPoints);
    setDealerPoints(state.dealerPoints ?? null);

    if (state.playerPoints > 21) {
      setMessage("You went bust\nDealer wins!");
    } else if (state.dealerPoints && state.dealerPoints > 21) {
      setMessage("Dealer went bust\nYou win!");
    } else if (state.gameOver) {
      setMessage(
        state.playerPoints >= (state.dealerPoints ?? 0)
          ? "You win!"
          : "Dealer wins!"
      );
    } else {
      setMessage("");
    }
  };

  // New game
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

  useEffect(() => {
    handleNewGame();
  }, []);

  // Hit
  const handleHit = async () => {
    if (gameOver || playerCards.length === 0) return; // disable before game start
    const state = await playerHit();
    applyState(state);
  };

  // Stay
  const handleStay = async () => {
    if (gameOver || playerCards.length === 0) return; // disable before game start
    const state = await stay();
    applyState(state);
  };

  // Display dealer points + hidden card
  const dealerPointsDisplay = () => {
    if (!gameOver && dealerCards.length > 1) {
      return `${dealerCards[0].blackjackValue} + ?`;
    }
    return dealerPoints !== null ? dealerPoints : "";
  };

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Blackjack</h1>

      {/* Table wrapper */}
      <div className={styles.table}>
        <button
          className={styles.pauseButton}
          onClick={() => setPaused(true)}
          disabled={paused}
          aria-label="Pause game"
        >
          ❚❚
        </button>
        {/* Dealer cards */}
        <DealerHand cards={dealerCards} />

        {/* Player cards */}
        <PlayerHand cards={playerCards} />

        {/* Score info between dealer and player */}
        <div className={styles.info}>
          {dealerCards.length > 0 && (
            <p>
              <strong>Dealer points:</strong> {dealerPointsDisplay()}
            </p>
          )}

          {playerPoints !== null && gameOver && playerPoints === 21 && (
            <p className={styles.blackjack}>BLACKJACK</p>
          )}

          {playerPoints !== null && playerPoints > 21 && (
            <p className={styles.bust}>BUST</p>
          )}

          {playerPoints !== null && (
            <p>
              <strong>Your points:</strong> {playerPoints}
            </p>
          )}
        </div>

        {/* Card deck behind buttons */}
        <img
          src="/cards/hidden_card.svg"
          alt="Deck"
          className={styles.cardDeck}
        />

        {/* Buttons for game actions */}
        <div className={styles.controls}>
          <button
            onClick={handleHit}
            disabled={gameOver || paused || playerCards.length === 0}
          >
            Hit
          </button>

          <button onClick={handleNewGame} disabled={paused || !gameOver}>
            New
          </button>

          <button
            onClick={handleStay}
            disabled={gameOver || paused || playerCards.length === 0}
          >
            Stay
          </button>
        </div>

        {/* General game messages */}
        {message && <p className={styles.message}>{message}</p>}

        {paused && (
          <div className={styles.pauseOverlay}>
            <div className={styles.pauseMenu}>
              <h2>Paused</h2>

              <button onClick={() => setPaused(false)}>Resume</button>
              <button
                onClick={() => {
                  setPaused(false);
                  handleNewGame();
                }}
              >
                New Game
              </button>
              <button onClick={() => router.push("/")}>Exit</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
