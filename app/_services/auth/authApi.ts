import { CustomUserLoginDTO } from "@/app/_types/auth/login";
import { CustomUserRegisterDTO } from "@/app/_types/auth/register";

const API_BASE_URL = "http://localhost:4000/auth";

export async function registerUser(data: CustomUserRegisterDTO) {
  const res = await fetch(`${API_BASE_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Registrering misslyckades");
  }

  return res.json(); // eller res.text() beroende på backend
}
export async function loginUser(data: CustomUserLoginDTO) {
  const res = await fetch(`${API_BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Login failed");
  }

  return res.json(); // token / user / whatever backend returns
}