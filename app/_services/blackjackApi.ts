import { CardDTO } from "@/app/_types/card";
import { BlackJackResultDTO } from "@/app/_types/blackjack-result";

const BASE_URL = "http://localhost:8080/blackjack";

export async function newGame(): Promise<void> {
  await fetch(`${BASE_URL}/new-game`, {
    method: "GET",
    credentials: "include",
  });
}

export async function hit(): Promise<CardDTO> {
  const res = await fetch(`${BASE_URL}/player-hit`, {
    method: "POST",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Hit failed");
  }

  return res.json();
}

export async function stay(): Promise<BlackJackResultDTO> {
  const res = await fetch(`${BASE_URL}/stay`, {
    method: "POST",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Stay failed");
  }

  return res.json();
}
