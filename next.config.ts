import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.join(__dirname),
  },
  // Garante que o banco SQLite (usado só nesta prévia) seja incluído no
  // pacote das funções serverless — senão rotas dinâmicas (que leem o
  // banco em tempo de requisição, não no build) não encontram o arquivo.
  outputFileTracingIncludes: {
    "/**": ["./prisma/dev.db"],
  },
};

export default nextConfig;
