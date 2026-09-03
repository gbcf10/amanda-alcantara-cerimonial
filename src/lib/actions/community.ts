"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireBride } from "@/lib/brideAuth";
import { commentSchema, postSchema } from "@/lib/validations";
import type { ReactionType } from "@/lib/constants";
import { REACTION_TYPES } from "@/lib/constants";

export type PostFormState = {
  error?: string;
  success?: boolean;
};

export async function createPost(
  _prevState: PostFormState,
  formData: FormData
): Promise<PostFormState> {
  const session = await requireBride();

  const parsed = postSchema.safeParse({
    content: formData.get("content"),
    imageUrl: formData.get("imageUrl"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  await prisma.post.create({
    data: {
      authorId: session.userId,
      content: parsed.data.content,
      imageUrl: parsed.data.imageUrl || null,
    },
  });

  revalidatePath("/comunidade");
  revalidatePath("/admin/comunidade/posts");
  return { success: true };
}

export async function deletePost(id: string) {
  const session = await requireBride();
  const post = await prisma.post.findUnique({ where: { id } });
  if (!post || post.authorId !== session.userId) {
    throw new Error("Não autorizado");
  }
  await prisma.post.delete({ where: { id } });
  revalidatePath("/comunidade");
}

export async function createComment(postId: string, formData: FormData) {
  const session = await requireBride();

  const parsed = commentSchema.safeParse({
    content: formData.get("content"),
  });
  if (!parsed.success) return;

  await prisma.comment.create({
    data: {
      postId,
      authorId: session.userId,
      content: parsed.data.content,
    },
  });

  revalidatePath(`/comunidade/${postId}`);
  revalidatePath("/admin/comunidade/comentarios");
}

export async function deleteComment(id: string, postId: string) {
  const session = await requireBride();
  const comment = await prisma.comment.findUnique({ where: { id } });
  if (!comment || comment.authorId !== session.userId) {
    throw new Error("Não autorizado");
  }
  await prisma.comment.delete({ where: { id } });
  revalidatePath(`/comunidade/${postId}`);
}

export async function toggleReaction(postId: string, type: ReactionType) {
  const session = await requireBride();

  const valid = REACTION_TYPES.some((r) => r.value === type);
  if (!valid) throw new Error("Reação inválida");

  const existing = await prisma.reaction.findUnique({
    where: { postId_authorId: { postId, authorId: session.userId } },
  });

  if (existing && existing.type === type) {
    await prisma.reaction.delete({ where: { id: existing.id } });
  } else if (existing) {
    await prisma.reaction.update({ where: { id: existing.id }, data: { type } });
  } else {
    await prisma.reaction.create({
      data: { postId, authorId: session.userId, type },
    });
  }

  revalidatePath("/comunidade");
  revalidatePath(`/comunidade/${postId}`);
}
