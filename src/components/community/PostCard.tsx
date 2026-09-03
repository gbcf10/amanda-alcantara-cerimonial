import Link from "next/link";
import { MediaImage } from "@/components/site/MediaImage";
import { ReactionBar } from "@/components/community/ReactionBar";

type PostCardData = {
  id: string;
  content: string;
  imageUrl: string | null;
  published: boolean;
  createdAt: Date;
  author: { id: string; name: string; avatarUrl: string | null };
  reactions: { type: string; authorId: string }[];
  _count: { comments: number };
};

export function PostCard({
  post,
  currentUserId,
}: {
  post: PostCardData;
  currentUserId: string | null;
}) {
  const isMine = currentUserId === post.author.id;

  return (
    <article className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-6">
      <div className="flex items-center gap-3">
        <MediaImage
          src={post.author.avatarUrl}
          alt={post.author.name}
          className="h-10 w-10 shrink-0 rounded-full object-cover"
          placeholderLabel={post.author.name.charAt(0)}
        />
        <div>
          <p className="text-sm font-medium text-foreground">{post.author.name}</p>
          <p className="text-xs text-muted-foreground">
            {new Date(post.createdAt).toLocaleDateString("pt-BR", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </p>
        </div>
        {!post.published && (
          <span className="ml-auto rounded-full bg-amber-50 px-3 py-1 text-xs text-amber-700">
            {isMine ? "Aguardando aprovação" : "Pendente"}
          </span>
        )}
      </div>

      <p className="whitespace-pre-line text-foreground/90">{post.content}</p>

      {post.imageUrl && (
        <MediaImage
          src={post.imageUrl}
          alt="Foto do post"
          className="max-h-[480px] w-full rounded-xl object-cover"
        />
      )}

      <div className="flex items-center justify-between pt-1">
        <ReactionBar
          postId={post.id}
          reactions={post.reactions}
          currentUserId={currentUserId}
        />
        <Link
          href={`/comunidade/${post.id}`}
          className="text-sm text-muted-foreground hover:text-accent"
        >
          {post._count.comments} comentário(s)
        </Link>
      </div>
    </article>
  );
}
