"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import {
  createBrideSession,
  destroyBrideSession,
  hashPassword,
  verifyPassword,
} from "@/lib/brideAuth";
import { brideLoginSchema, brideSignupSchema } from "@/lib/validations";

export type BrideAuthState = {
  error?: string;
};

export async function signupAction(
  _prevState: BrideAuthState,
  formData: FormData
): Promise<BrideAuthState> {
  const parsed = brideSignupSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  const { name, email, password } = parsed.data;

  const existing = await prisma.brideUser.findUnique({
    where: { email: email.toLowerCase() },
  });
  if (existing) {
    return { error: "Já existe uma conta com esse e-mail." };
  }

  const passwordHash = await hashPassword(password);
  const user = await prisma.brideUser.create({
    data: { name, email: email.toLowerCase(), passwordHash },
  });

  await createBrideSession({ userId: user.id, name: user.name });
  redirect("/comunidade");
}

export async function loginAction(
  _prevState: BrideAuthState,
  formData: FormData
): Promise<BrideAuthState> {
  const parsed = brideLoginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  const { email, password } = parsed.data;

  const user = await prisma.brideUser.findUnique({
    where: { email: email.toLowerCase() },
  });

  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    return { error: "E-mail ou senha incorretos." };
  }

  if (user.banned) {
    return { error: "Esta conta foi bloqueada." };
  }

  await createBrideSession({ userId: user.id, name: user.name });
  redirect("/comunidade");
}

export async function logoutAction() {
  await destroyBrideSession();
  redirect("/comunidade");
}
