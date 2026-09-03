"use client";

export function DeleteButton({
  confirmText = "Tem certeza que deseja excluir?",
  label = "Excluir",
}: {
  confirmText?: string;
  label?: string;
}) {
  return (
    <button
      type="submit"
      onClick={(e) => {
        if (!confirm(confirmText)) e.preventDefault();
      }}
      className="text-xs font-medium text-red-600 hover:underline"
    >
      {label}
    </button>
  );
}
