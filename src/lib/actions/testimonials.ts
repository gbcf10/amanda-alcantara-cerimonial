"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { testimonialSchema } from "@/lib/validations";

function parseForm(formData: FormData) {
  return testimonialSchema.parse({
    clientName: formData.get("clientName"),
    eventType: formData.get("eventType"),
    quote: formData.get("quote"),
    rating: formData.get("rating"),
    photoUrl: formData.get("photoUrl"),
    published: formData.get("published") === "on",
    order: formData.get("order") || 0,
  });
}

export async function createTestimonial(formData: FormData) {
  await requireAdmin();
  const data = parseForm(formData);
  await prisma.testimonial.create({
    data: {
      ...data,
      eventType: data.eventType || null,
      photoUrl: data.photoUrl || null,
    },
  });
  revalidatePath("/admin/depoimentos");
  revalidatePath("/depoimentos");
  revalidatePath("/");
}

export async function updateTestimonial(id: string, formData: FormData) {
  await requireAdmin();
  const data = parseForm(formData);
  await prisma.testimonial.update({
    where: { id },
    data: {
      ...data,
      eventType: data.eventType || null,
      photoUrl: data.photoUrl || null,
    },
  });
  revalidatePath("/admin/depoimentos");
  revalidatePath("/depoimentos");
  revalidatePath("/");
}

export async function deleteTestimonial(id: string) {
  await requireAdmin();
  await prisma.testimonial.delete({ where: { id } });
  revalidatePath("/admin/depoimentos");
  revalidatePath("/depoimentos");
  revalidatePath("/");
}
