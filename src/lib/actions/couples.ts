"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { coupleMediaSchema, coupleSchema } from "@/lib/validations";

function parseCoupleForm(formData: FormData) {
  return coupleSchema.parse({
    names: formData.get("names"),
    slug: formData.get("slug"),
    weddingDate: formData.get("weddingDate"),
    coverUrl: formData.get("coverUrl"),
    story: formData.get("story"),
    published: formData.get("published") === "on",
    order: formData.get("order") || 0,
  });
}

export async function createCouple(formData: FormData) {
  await requireAdmin();
  const data = parseCoupleForm(formData);
  await prisma.couple.create({
    data: {
      ...data,
      weddingDate: data.weddingDate ? new Date(data.weddingDate) : null,
      coverUrl: data.coverUrl || null,
      story: data.story || null,
    },
  });
  revalidatePath("/admin/casais");
  revalidatePath("/casais");
}

export async function updateCouple(id: string, formData: FormData) {
  await requireAdmin();
  const data = parseCoupleForm(formData);
  const couple = await prisma.couple.update({
    where: { id },
    data: {
      ...data,
      weddingDate: data.weddingDate ? new Date(data.weddingDate) : null,
      coverUrl: data.coverUrl || null,
      story: data.story || null,
    },
  });
  revalidatePath("/admin/casais");
  revalidatePath(`/admin/casais/${id}`);
  revalidatePath("/casais");
  revalidatePath(`/casais/${couple.slug}`);
}

export async function deleteCouple(id: string) {
  await requireAdmin();
  const couple = await prisma.couple.delete({ where: { id } });
  revalidatePath("/admin/casais");
  revalidatePath("/casais");
  revalidatePath(`/casais/${couple.slug}`);
}

export async function addCoupleMedia(coupleId: string, formData: FormData) {
  await requireAdmin();
  const data = coupleMediaSchema.parse({
    type: formData.get("type"),
    url: formData.get("url"),
    caption: formData.get("caption"),
    order: formData.get("order") || 0,
  });

  await prisma.coupleMedia.create({
    data: { ...data, coupleId, caption: data.caption || null },
  });

  revalidatePath(`/admin/casais/${coupleId}`);

  const couple = await prisma.couple.findUnique({ where: { id: coupleId } });
  if (couple) revalidatePath(`/casais/${couple.slug}`);
}

export async function deleteCoupleMedia(id: string, coupleId: string) {
  await requireAdmin();
  await prisma.coupleMedia.delete({ where: { id } });
  revalidatePath(`/admin/casais/${coupleId}`);

  const couple = await prisma.couple.findUnique({ where: { id: coupleId } });
  if (couple) revalidatePath(`/casais/${couple.slug}`);
}
