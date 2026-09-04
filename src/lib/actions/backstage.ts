"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { backstageMediaSchema } from "@/lib/validations";

function parseForm(formData: FormData) {
  return backstageMediaSchema.parse({
    type: formData.get("type"),
    url: formData.get("url"),
    caption: formData.get("caption"),
    published: formData.get("published") === "on",
    order: formData.get("order") || 0,
  });
}

export async function createBackstageMedia(formData: FormData) {
  await requireAdmin();
  const data = parseForm(formData);
  await prisma.backstageMedia.create({
    data: { ...data, caption: data.caption || null },
  });
  revalidatePath("/admin/bastidores");
  revalidatePath("/bastidores");
}

export async function deleteBackstageMedia(id: string) {
  await requireAdmin();
  await prisma.backstageMedia.delete({ where: { id } });
  revalidatePath("/admin/bastidores");
  revalidatePath("/bastidores");
}
