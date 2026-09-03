"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

// status: "available" | "unavailable" | "booked"
export async function setAvailability(
  dateISO: string,
  status: "available" | "unavailable" | "booked",
  note?: string
) {
  await requireAdmin();
  const date = new Date(dateISO);
  await prisma.availabilityDate.upsert({
    where: { date },
    update: { status, note: note || null },
    create: { date, status, note: note || null },
  });
  revalidatePath("/admin/agenda");
  revalidatePath("/orcamento");
}

export async function clearAvailability(dateISO: string) {
  await requireAdmin();
  const date = new Date(dateISO);
  await prisma.availabilityDate.deleteMany({ where: { date } });
  revalidatePath("/admin/agenda");
  revalidatePath("/orcamento");
}
