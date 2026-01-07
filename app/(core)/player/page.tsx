"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./ProfilePage.module.css";
import { UserMeDTO } from "@/app/_types/auth/me";
import { getMe, logoutUser } from "@/app/_services/auth/authApi";

import { LogoutButton } from "@/app/_components/LogoutButton";
import { DeleteAccountButton } from "@/app/_components/DeleteAccountButton";
import { HomeButton } from "@/app/_components/HomeButton";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<UserMeDTO | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMe()
      .then(setUser)
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = async () => {
    await logoutUser();
    router.push("/");
  };

  if (loading || !user) {
    return (
      <div className={`${styles.page} bg-felt`}>
        <p>Laddar profil...</p>
      </div>
    );
  }

  return (
	
    <div className={`${styles.page} bg-felt`}>
      <HomeButton/>
      <h1 className={styles.title}>Mitt konto</h1>

      <div className={styles.card}>
        <p>
          <strong>Användarnamn:</strong> {user.username}
        </p>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <p>
          <strong>Score:</strong> {user.score}
        </p>
        <p>
          <strong>Roller:</strong> {user.roles.join(", ")}
        </p>
      </div>

      <div className={styles.menu}>
        <LogoutButton/>
		<DeleteAccountButton/>
      </div>
    </div>
  );
}
