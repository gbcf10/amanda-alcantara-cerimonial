"use client";

import { useTransition } from "react";
import { toggleReaction } from "@/lib/actions/community";
import { REACTION_TYPES, type ReactionType } from "@/lib/constants";

type ReactionRecord = { type: string; authorId: string };

export function ReactionBar({
  postId,
  reactions,
  currentUserId,
}: {
  postId: string;
  reactions: ReactionRecord[];
  currentUserId: string | null;
}) {
  const [isPending, startTransition] = useTransition();

  const counts = REACTION_TYPES.map((r) => ({
    ...r,
    count: reactions.filter((reaction) => reaction.type === r.value).length,
  }));

  const myReaction = currentUserId
    ? reactions.find((r) => r.authorId === currentUserId)?.type
    : undefined;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {counts.map((r) => (
        <button
          key={r.value}
          type="button"
          disabled={!currentUserId || isPending}
          onClick={() => {
            startTransition(() => {
              toggleReaction(postId, r.value as ReactionType);
            });
          }}
          title={currentUserId ? r.label : "Entre para reagir"}
          className={`flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs transition-colors ${
            myReaction === r.value
              ? "border-accent bg-accent/10 text-accent"
              : "border-border text-muted-foreground hover:bg-muted"
          } ${!currentUserId ? "cursor-not-allowed opacity-60" : ""}`}
        >
          <span>{r.emoji}</span>
          {r.count > 0 && <span>{r.count}</span>}
        </button>
      ))}
    </div>
  );
}
