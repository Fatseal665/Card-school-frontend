"use client";

import styles from "./StartPage.module.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getMe } from "@/app/_services/auth/authApi";
import { UserMeDTO } from "@/app/_types/auth/me";

export default function StartPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserMeDTO | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMe()
      .then((me) => setUser(me))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className={`${styles.page} bg-felt`}>
        <p>Laddar...</p>
      </div>
    );
  }

  return (
    <div className={`${styles.page} bg-felt`}>
      <h1 className={styles.title}>CardSckole</h1>

      <div className={styles.menu}>
        <button onClick={() => router.push("/blackjack")}>
          Spela Blackjack
        </button>

        {user ? (
          <button onClick={() => router.push("/player")}>
            Mitt konto
          </button>
        ) : (
          <button onClick={() => router.push("/auth/login")}>
            Login
          </button>
        )}
      </div>

      {user && (
        <p className={styles.welcome}>
          Välkommen, <span className="text-gold">{user.username}</span>
        </p>
      )}
    </div>
  );
}
