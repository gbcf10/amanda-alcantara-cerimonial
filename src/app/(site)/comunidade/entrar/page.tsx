import type { Metadata } from "next";
import { BrideLoginForm } from "@/components/community/BrideLoginForm";

export const metadata: Metadata = {
  title: "Entrar na comunidade | Amanda Alcântara Cerimonial",
};

export default function ComunidadeEntrarPage() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-6 py-16">
      <BrideLoginForm />
    </div>
  );
}
