'use client';

import { useState } from "react";
import { loginUser } from "@/app/_services/auth/authApi";
import type { CustomUserLoginDTO } from "@/app/_types/auth/login";
import { useSearchParams, useRouter } from "next/navigation";
import styles from "./LoginPage.module.css";
import { HomeButton } from "@/app/_components/HomeButton";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const redirectParam = searchParams.get("redirect");
  const redirectTo =
    redirectParam && redirectParam.startsWith("/") ? redirectParam : "/";

  const [form, setForm] = useState<CustomUserLoginDTO>({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await loginUser(form);
      router.replace(redirectTo);
    } catch (err: any)  {
      try {
        const parsed = JSON.parse(err.message);
        setError(parsed.message || "Ett fel uppstod");
      } catch {
        setError(err.message || "Ett fel uppstod");
      }
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className={`${styles.page} bg-felt`}>
      <HomeButton/>
      <h1 className={styles.title}>Login</h1>

      <form className={styles.form} onSubmit={handleSubmit}>
        <input
          className={styles.input}
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />

        <input
          className={styles.input}
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />

        <button className={styles.button} type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
      
      {error && <p className={`${styles.message} ${styles.error}`}>{error}</p>}

      <div className={styles.registerNav}>
        <p>Don't have an account?</p>
        <button
          className={styles.navButton}
          onClick={() => router.push("/auth/register")}
        >
          Register
        </button>
      </div>
    </div>
  );
}
