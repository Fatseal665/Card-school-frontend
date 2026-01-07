'use client';

import { useRouter } from "next/navigation";
import { deleteSelf } from "@/app/_services/auth/authApi";

export function DeleteAccountButton() {
  const router = useRouter();

  const handleDelete = async () => {
    const confirmed = confirm(
      "Are you sure you want to permanently delete your account?"
    );
    if (!confirmed) return;

    const password = prompt("Please enter your password to confirm:");
    if (!password) return;

    try {
      await deleteSelf(password);
      router.replace("/auth/login");
    } catch (err: any) {
      alert(err.message || "Failed to delete account");
    }
  };

  return (
    <button onClick={handleDelete} style={{ color: "red" }}>
      Delete account
    </button>
  );
}