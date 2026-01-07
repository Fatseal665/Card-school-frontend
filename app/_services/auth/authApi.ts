import { CustomUserLoginDTO } from "@/app/_types/auth/login";
import { UserMeDTO } from "@/app/_types/auth/me";
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
  await fetch(`${API_BASE_URL}/logout`, {
    method: "POST",
    credentials: "include",
  });
}



export async function checkPlayerAccess() {
  const res = await fetch(`${API_BASE_URL}/player-only`, {
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


export async function deleteSelf(password: string) {
  const res = await fetch(`${API_BASE_URL}/user/delete`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ password }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Delete account failed");
  }

  return true;
}

export async function getMe(): Promise<UserMeDTO> {
  const res = await fetch(`${API_BASE_URL}/me`, {
    method: "GET",
    credentials: "include",
  });

  if (res.status === 401) {
    throw new Error("UNAUTHORIZED");
  }
  
  if (!res.ok) {
    throw new Error("Failed to fetch user");
  }
  
  return res.json();
}