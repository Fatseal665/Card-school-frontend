'use client'

import { useState } from "react";
import { registerUser } from "@/app/_services/auth/authApi";
import type { CustomUserRegisterDTO } from "@/app/_types/auth/register";

export default function RegisterPage() {
  const [form, setForm] = useState<CustomUserRegisterDTO>({
    username: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await registerUser(form);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h1>Registrera</h1>

      <form onSubmit={handleSubmit}>
        <input
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
        />

        <input
          name="email"
          type="email"
          placeholder="E-post"
          value={form.email}
          onChange={handleChange}
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
        />

        <button type="submit">Registrera</button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p>✅ Account created</p>}
    </div>
  );
}
