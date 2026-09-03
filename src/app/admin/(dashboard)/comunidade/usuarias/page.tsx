import { prisma } from "@/lib/prisma";
import { toggleBanBrideUser, deleteBrideUser } from "@/lib/actions/moderation";
import { DeleteButton } from "@/components/ui/DeleteButton";

export default async function AdminUsuariasPage() {
  const users = await prisma.brideUser.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { posts: true, comments: true } } },
  });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-serif-display text-2xl text-foreground">
          Noivas cadastradas
        </h1>
        <p className="text-sm text-muted-foreground">
          {users.length} conta(s) na comunidade.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {users.length === 0 && (
          <p className="text-muted-foreground">Nenhuma conta cadastrada ainda.</p>
        )}
        {users.map((user) => (
          <div
            key={user.id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card p-4"
          >
            <div>
              <p className="text-sm font-medium text-foreground">
                {user.name}{" "}
                {user.banned && (
                  <span className="ml-2 rounded-full bg-red-50 px-2 py-0.5 text-xs text-red-700">
                    Bloqueada
                  </span>
                )}
              </p>
              <p className="text-xs text-muted-foreground">
                {user.email} · {user._count.posts} post(s) · {user._count.comments}{" "}
                comentário(s) · desde {new Date(user.createdAt).toLocaleDateString("pt-BR")}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <form action={toggleBanBrideUser.bind(null, user.id, !user.banned)}>
                <button
                  type="submit"
                  className="text-xs font-medium text-accent hover:underline"
                >
                  {user.banned ? "Desbloquear" : "Bloquear"}
                </button>
              </form>
              <form action={deleteBrideUser.bind(null, user.id)}>
                <DeleteButton confirmText="Excluir esta conta e todo o conteúdo dela?" />
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
