"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { quoteRequestSchema } from "@/lib/validations";

export type QuoteFormState = {
  error?: string;
  success?: boolean;
  fieldErrors?: Record<string, string>;
};

export async function submitQuoteRequest(
  _prevState: QuoteFormState,
  formData: FormData
): Promise<QuoteFormState> {
  const raw = {
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    eventType: String(formData.get("eventType") ?? ""),
    eventDate: String(formData.get("eventDate") ?? ""),
    location: String(formData.get("location") ?? ""),
    guestCount: String(formData.get("guestCount") ?? ""),
    partnerName: String(formData.get("partnerName") ?? ""),
    message: String(formData.get("message") ?? ""),
  };

  const parsed = quoteRequestSchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (typeof key === "string" && !fieldErrors[key]) {
        fieldErrors[key] = issue.message;
      }
    }
    return { error: "Verifique os campos destacados.", fieldErrors };
  }

  const data = parsed.data;

  await prisma.quoteRequest.create({
    data: {
      name: data.name,
      email: data.email,
      phone: data.phone,
      eventType: data.eventType,
      eventDate: data.eventDate ? new Date(data.eventDate) : null,
      location: data.location || null,
      guestCount: data.guestCount || null,
      partnerName: data.partnerName || null,
      message: data.message || null,
    },
  });

  revalidatePath("/admin/orcamentos");
  return { success: true };
}

export async function updateQuoteStatus(id: string, status: string) {
  await requireAdmin();
  await prisma.quoteRequest.update({ where: { id }, data: { status } });
  revalidatePath("/admin/orcamentos");
}

export async function deleteQuoteRequest(id: string) {
  await requireAdmin();
  await prisma.quoteRequest.delete({ where: { id } });
  revalidatePath("/admin/orcamentos");
}
