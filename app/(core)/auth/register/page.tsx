'use client';

import { useState } from "react";
import { registerUser } from "@/app/_services/auth/authApi";
import type { CustomUserRegisterDTO } from "@/app/_types/auth/register";
import styles from "./RegisterPage.module.css";
import { HomeButton } from "@/app/_components/HomeButton";

export default function RegisterPage() {
  const [form, setForm] = useState<CustomUserRegisterDTO>({
    username: "",
    email: "",
    password: "",
  });
  
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    try {
      await registerUser(form);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className={`${styles.page} bg-felt`}>
      <HomeButton/>
      <h1 className={styles.title}>Registrera</h1>

      <form className={styles.form} onSubmit={handleSubmit}>
        <input
          className={styles.input}
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
        />

        <input
          className={styles.input}
          name="email"
          type="email"
          placeholder="E-post"
          value={form.email}
          onChange={handleChange}
        />

        <input
          className={styles.input}
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
        />

        <button className={styles.button} type="submit">
          Registrera
        </button>
      </form>

      {error && <p className={`${styles.message} ${styles.error}`}>{error}</p>}
      {success && (
        <p className={`${styles.message} ${styles.success}`}>
          ✅ Account created
        </p>
      )}
    </div>
  );
}
