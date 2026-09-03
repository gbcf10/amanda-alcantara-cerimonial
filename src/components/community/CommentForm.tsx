"use client";

import { useRef } from "react";
import { createComment } from "@/lib/actions/community";
import { Button } from "@/components/ui/Button";

export function CommentForm({ postId }: { postId: string }) {
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form
      ref={formRef}
      action={async (formData) => {
        await createComment(postId, formData);
        formRef.current?.reset();
      }}
      className="flex flex-col gap-2"
    >
      <textarea
        name="content"
        required
        rows={2}
        maxLength={1000}
        placeholder="Escreva um comentário..."
        className="input resize-none"
      />
      <div>
        <Button type="submit">Comentar</Button>
      </div>
    </form>
  );
}
