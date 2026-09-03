import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { approveComment, deleteCommentAdmin } from "@/lib/actions/moderation";
import { DeleteButton } from "@/components/ui/DeleteButton";

export default async function AdminComentariosPage() {
  const comments = await prisma.comment.findMany({
    orderBy: [{ published: "asc" }, { createdAt: "desc" }],
    include: { author: true, post: { select: { id: true, content: true } } },
  });

  const pending = comments.filter((c) => !c.published);
  const published = comments.filter((c) => c.published);

  return (
    <div className="flex flex-col gap-10">
      <div>
        <h1 className="font-serif-display text-2xl text-foreground">Comentários</h1>
        <p className="text-sm text-muted-foreground">
          {pending.length} comentário(s) aguardando aprovação.
        </p>
      </div>

      {pending.length > 0 && (
        <div className="flex flex-col gap-3">
          <h2 className="font-medium text-foreground">Pendentes</h2>
          {pending.map((comment) => (
            <CommentRow key={comment.id} comment={comment} />
          ))}
        </div>
      )}

      <div className="flex flex-col gap-3">
        <h2 className="font-medium text-foreground">Publicados</h2>
        {published.length === 0 && (
          <p className="text-muted-foreground">Nenhum comentário publicado ainda.</p>
        )}
        {published.map((comment) => (
          <CommentRow key={comment.id} comment={comment} />
        ))}
      </div>
    </div>
  );
}

function CommentRow({
  comment,
}: {
  comment: {
    id: string;
    content: string;
    published: boolean;
    createdAt: Date;
    author: { name: string };
    post: { id: string; content: string };
  };
}) {
  return (
    <div className="flex flex-col gap-2 rounded-xl border border-border bg-card p-4">
      <p className="text-sm text-foreground/90">
        <span className="font-medium text-foreground">{comment.author.name}:</span>{" "}
        {comment.content}
      </p>
      <p className="line-clamp-1 text-xs text-muted-foreground">
        Em resposta a:{" "}
        <Link href={`/comunidade/${comment.post.id}`} className="hover:text-accent">
          &ldquo;{comment.post.content}&rdquo;
        </Link>
      </p>
      <div className="flex items-center gap-4">
        {!comment.published && (
          <form action={approveComment.bind(null, comment.id)}>
            <button
              type="submit"
              className="text-xs font-medium text-green-700 hover:underline"
            >
              Aprovar
            </button>
          </form>
        )}
        <form action={deleteCommentAdmin.bind(null, comment.id)}>
          <DeleteButton confirmText="Excluir este comentário permanentemente?" />
        </form>
      </div>
    </div>
  );
}
