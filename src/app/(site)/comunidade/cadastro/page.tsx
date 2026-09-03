import type { Metadata } from "next";
import { BrideSignupForm } from "@/components/community/BrideSignupForm";

export const metadata: Metadata = {
  title: "Criar conta | Amanda Alcântara Cerimonial",
};

export default function ComunidadeCadastroPage() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-6 py-16">
      <BrideSignupForm />
    </div>
  );
}
