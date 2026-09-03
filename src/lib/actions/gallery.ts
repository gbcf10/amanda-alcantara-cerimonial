"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { galleryImageSchema } from "@/lib/validations";

function parseForm(formData: FormData) {
  return galleryImageSchema.parse({
    url: formData.get("url"),
    caption: formData.get("caption"),
    category: formData.get("category"),
    published: formData.get("published") === "on",
    order: formData.get("order") || 0,
  });
}

export async function createGalleryImage(formData: FormData) {
  await requireAdmin();
  const data = parseForm(formData);
  await prisma.galleryImage.create({
    data: { ...data, caption: data.caption || null, category: data.category || null },
  });
  revalidatePath("/admin/galeria");
  revalidatePath("/portfolio");
  revalidatePath("/");
}

export async function updateGalleryImage(id: string, formData: FormData) {
  await requireAdmin();
  const data = parseForm(formData);
  await prisma.galleryImage.update({
    where: { id },
    data: { ...data, caption: data.caption || null, category: data.category || null },
  });
  revalidatePath("/admin/galeria");
  revalidatePath("/portfolio");
  revalidatePath("/");
}

export async function deleteGalleryImage(id: string) {
  await requireAdmin();
  await prisma.galleryImage.delete({ where: { id } });
  revalidatePath("/admin/galeria");
  revalidatePath("/portfolio");
  revalidatePath("/");
}
