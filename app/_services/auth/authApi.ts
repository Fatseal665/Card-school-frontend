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
    credentials: "include"
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Registrering misslyckades");
  }
  
  return res.json(); 
}
export async function loginUser(data: CustomUserLoginDTO) {
  const res = await fetch(`${API_BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: "include"
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Login failed");
  }

  return res.json();
}

export async function logoutUser() {
  await fetch(`${API_BASE_URL}/auth/logout`, {
    method: "POST",
    credentials: "include",
  });
}



export async function checkPlayerAccess() {
  const res = await fetch(`${API_BASE_URL}/auth/player-only`, {
    method: "GET",
    credentials: "include", 
  });

  if (res.status === 401) {
    throw new Error("UNAUTHORIZED");
  
  }

  if (res.status === 403) {
    throw new Error("FORBIDDEN");
  }

  if (!res.ok) {
    throw new Error("Something went wrong");
  }

  return true;
}

export async function checkAdminAccess() {
  const res = await fetch(`${API_BASE_URL}/auth/admin-only`, {
    method: "GET",
    credentials: "include",
  });

  if (res.status === 401) {
    throw new Error("UNAUTHORIZED");
  }

  if (res.status === 403) {
    throw new Error("FORBIDDEN");
  }

  if (!res.ok) {
    throw new Error("Something went wrong");
  }

  return true;
}