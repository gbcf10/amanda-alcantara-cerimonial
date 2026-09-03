import { prisma } from "@/lib/prisma";
import { approvePost, deletePostAdmin } from "@/lib/actions/moderation";
import { DeleteButton } from "@/components/ui/DeleteButton";
import { MediaImage } from "@/components/site/MediaImage";

export default async function AdminPostsPage() {
  const posts = await prisma.post.findMany({
    orderBy: [{ published: "asc" }, { createdAt: "desc" }],
    include: { author: true, _count: { select: { comments: true, reactions: true } } },
  });

  const pending = posts.filter((p) => !p.published);
  const published = posts.filter((p) => p.published);

  return (
    <div className="flex flex-col gap-10">
      <div>
        <h1 className="font-serif-display text-2xl text-foreground">
          Posts da comunidade
        </h1>
        <p className="text-sm text-muted-foreground">
          {pending.length} post(s) aguardando aprovação.
        </p>
      </div>

      {pending.length > 0 && (
        <div className="flex flex-col gap-4">
          <h2 className="font-medium text-foreground">Pendentes</h2>
          {pending.map((post) => (
            <PostRow key={post.id} post={post} />
          ))}
        </div>
      )}

      <div className="flex flex-col gap-4">
        <h2 className="font-medium text-foreground">Publicados</h2>
        {published.length === 0 && (
          <p className="text-muted-foreground">Nenhum post publicado ainda.</p>
        )}
        {published.map((post) => (
          <PostRow key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}

function PostRow({
  post,
}: {
  post: {
    id: string;
    content: string;
    imageUrl: string | null;
    published: boolean;
    createdAt: Date;
    author: { name: string; email: string };
    _count: { comments: number; reactions: number };
  };
}) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-start">
      {post.imageUrl && (
        <MediaImage
          src={post.imageUrl}
          alt=""
          className="h-24 w-24 shrink-0 rounded-lg object-cover"
        />
      )}
      <div className="flex-1">
        <p className="text-sm font-medium text-foreground">
          {post.author.name}{" "}
          <span className="font-normal text-muted-foreground">
            · {post.author.email}
          </span>
        </p>
        <p className="mt-1 whitespace-pre-line text-sm text-foreground/90">
          {post.content}
        </p>
        <p className="mt-2 text-xs text-muted-foreground">
          {post._count.comments} comentário(s) · {post._count.reactions} reação(ões) ·{" "}
          {new Date(post.createdAt).toLocaleString("pt-BR")}
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-3">
        {!post.published && (
          <form action={approvePost.bind(null, post.id)}>
            <button
              type="submit"
              className="text-xs font-medium text-green-700 hover:underline"
            >
              Aprovar
            </button>
          </form>
        )}
        <form action={deletePostAdmin.bind(null, post.id)}>
          <DeleteButton confirmText="Excluir este post permanentemente?" />
        </form>
      </div>
    </div>
  );
}
