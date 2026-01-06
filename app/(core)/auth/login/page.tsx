'use client';

import { useState } from "react";
import { loginUser } from "@/app/_services/auth/authApi";
import type { CustomUserLoginDTO } from "@/app/_types/auth/login";
import { useSearchParams, useRouter } from "next/navigation";

import { useEffect } from "react";
import { checkAuth } from "@/app/_services/auth/authApi";


export default function LoginPage() {
  const router = useRouter();

  
  const [form, setForm] = useState<CustomUserLoginDTO>({
    email: "",
    password: "",
  });
  
  

  const searchParams = useSearchParams();

  const redirectParam = searchParams.get("redirect");
  const redirectTo =
    redirectParam && redirectParam.startsWith("/") ? redirectParam : "/";

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await loginUser(form);
      router.replace(redirectTo);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400 }}>
      <h1>Login</h1>

      <form onSubmit={handleSubmit}>
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
    )
}