import { CardDTO } from "@/app/_types/card";
import { BlackJackInitialDealDTO } from "@/app/_types/blackjack-initial-deal";
import { BlackJackResultDTO } from "@/app/_types/blackjack-result";

const BASE_URL = "http://localhost:8080/blackjack";

export async function newGame(): Promise<BlackJackInitialDealDTO> {
  const res = await fetch(`${BASE_URL}/new-game`);
  if (!res.ok) throw new Error("Failed to start new game");
  return res.json();
}

export async function playerHit(): Promise<CardDTO> {
  const res = await fetch(`${BASE_URL}/player-hit`, { method: "POST" });
  if (!res.ok) throw new Error("Hit failed");
  return res.json();
}

export async function stay(): Promise<BlackJackResultDTO> {
  const res = await fetch(`${BASE_URL}/stay`, { method: "POST" });
  if (!res.ok) throw new Error("Stay failed");
  return res.json();
}
