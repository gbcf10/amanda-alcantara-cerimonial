"use server";

import { redirect } from "next/navigation";
import { createSession, destroySession, verifyCredentials } from "@/lib/auth";

export type LoginState = {
  error?: string;
};

export async function loginAction(
  _prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "/admin");

  if (!email || !password) {
    return { error: "Preencha e-mail e senha." };
  }

  let valid: boolean;
  try {
    valid = await verifyCredentials(email, password);
  } catch {
    return { error: "Login não configurado. Verifique o arquivo .env." };
  }

  if (!valid) {
    return { error: "E-mail ou senha incorretos." };
  }

  await createSession(email);
  redirect(next.startsWith("/admin") ? next : "/admin");
}

export async function logoutAction() {
  await destroySession();
  redirect("/admin/login");
}
