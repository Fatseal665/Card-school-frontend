'use client';

import { useRouter } from "next/navigation";
import { logoutUser } from "@/app/_services/auth/authApi";

export function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await logoutUser();
    router.replace("/");
  };

  return <button onClick={handleLogout}>Logout</button>;
}