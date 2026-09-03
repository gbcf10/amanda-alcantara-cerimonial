# Site — Amanda Alcântara Cerimonial

Site institucional + painel administrativo para assessoria de cerimonial de
casamentos e eventos. Feito com Next.js 16 (App Router), TypeScript, Tailwind
CSS v4 e Prisma (SQLite em desenvolvimento).

## O que tem no site

**Site público:**
- Home, Portfólio (galeria de fotos), Depoimentos, Parcerias, Equipe
- **O que inclui** (`/servicos`): escopo completo do serviço de cerimonial,
  organizado por etapa (planejamento, fornecedores, cronograma, cerimônia,
  financeiro, convidados, logística, produção do dia, pós-evento etc.)
- Página de orçamento com formulário + calendário de disponibilidade
- **Book de Casais** (`/casais`): perfil de cada casal com fotos, vídeos
  (YouTube/Vimeo ou arquivo direto) e a história do casamento
- **Comunidade Noivas AA** (`/comunidade`): feed onde noivas cadastradas
  podem postar, comentar e reagir (❤️ 🎉 🥰 👏) aos posts umas das outras

**Painel admin (`/admin`):**
- Login protegido (usuário único, definido no `.env`)
- Gerenciar depoimentos, equipe, parcerias e fotos do portfólio
- Gerenciar a agenda de disponibilidade (datas disponíveis / reservadas / indisponíveis)
- Ver e atualizar os pedidos de orçamento recebidos pelo site
- Editar textos e contatos do site (hero, sobre, Instagram, WhatsApp, e-mail)
- Gerenciar o Book de Casais (criar casal, adicionar fotos e vídeos)
- Moderar a comunidade: aprovar/excluir posts e comentários, bloquear ou
  excluir contas de noivas

## Comunidade das noivas — como funciona

- Qualquer visitante pode criar uma conta em `/comunidade/cadastro` (nome,
  e-mail, senha) — é uma conta separada do login do admin.
- Posts e comentários novos ficam **pendentes** até a Amanda aprovar em
  `/admin/comunidade/posts` e `/admin/comunidade/comentarios`. A autora vê o
  próprio conteúdo marcado como "aguardando aprovação"; outras pessoas só
  veem depois de aprovado.
- Reações (❤️ amei, 🎉 parabéns, 🥰 fofo, 👏 bravo) são liberadas na hora,
  sem moderação — uma por pessoa por post.
- A Amanda pode bloquear ou excluir contas em `/admin/comunidade/usuarias`.

### Contas fictícias de demonstração

Para a comunidade não começar vazia, existe um script que cria 10 contas
fictícias com posts, comentários e reações simulando depoimentos de noivas
reais (além de um depoimento extra e 2 casais em rascunho no Book de
Casais). Rode quando quiser popular/repopular:
```bash
npm run db:seed-community
```
Essas contas usam e-mails `*.demo@exemplo.com` — dá pra identificar e
remover depois pelo painel admin (`/admin/comunidade/usuarias`) quando
tiver conteúdo real o suficiente.

## Como rodar localmente

1. Instale as dependências (já feito se você seguiu o setup inicial):
   ```bash
   npm install
   ```

2. Configure o `.env` (um arquivo `.env` já foi criado com valores padrão).
   Para gerar uma nova senha de admin:
   ```bash
   npm run hash-password -- "sua-nova-senha"
   ```
   Copie a linha `ADMIN_PASSWORD_HASH_B64=...` gerada para o `.env`.

3. Crie o banco de dados e rode as migrations:
   ```bash
   npm run db:migrate
   ```

4. (Opcional) Popule com dados de exemplo:
   ```bash
   npm run db:seed
   ```

5. Rode o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
   Site: http://localhost:3000
   Painel admin: http://localhost:3000/admin

## Login do painel admin

O e-mail e senha ficam no `.env` (`ADMIN_EMAIL` e `ADMIN_PASSWORD_HASH_B64`).
Não existe cadastro de múltiplos usuários — é pensado para uso da própria
Amanda. Para trocar a senha, gere um novo hash com `npm run hash-password`
e atualize o `.env`.

## Banco de dados

Em desenvolvimento o projeto usa **SQLite** (arquivo `prisma/dev.db`), sem
necessidade de instalar nada além do Node.js.

Para produção (ex: Vercel), o SQLite não é adequado, pois o sistema de
arquivos é temporário. Antes de fazer o deploy:

1. Crie um banco Postgres gratuito (ex: [Neon](https://neon.tech),
   [Supabase](https://supabase.com) ou Vercel Postgres).
2. Em `prisma/schema.prisma`, troque:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
3. Atualize `DATABASE_URL` no ambiente de produção com a connection string
   do Postgres.
4. Rode `npx prisma migrate deploy` para criar as tabelas no novo banco.

## Fotos

As imagens (portfólio, depoimentos, equipe, parcerias) são cadastradas por
URL no painel admin — cole o link de uma imagem já hospedada (ex: um serviço
gratuito como [Cloudinary](https://cloudinary.com) ou [ imgbb](https://imgbb.com)).
Se preferir upload direto de arquivos no futuro, dá pra integrar um serviço
de storage (Cloudinary, UploadThing, Vercel Blob etc).

## Deploy

O jeito mais simples é a [Vercel](https://vercel.com):
1. Suba o projeto para um repositório Git.
2. Importe o repositório na Vercel.
3. Configure as variáveis de ambiente (`DATABASE_URL` do Postgres, `ADMIN_EMAIL`,
   `ADMIN_PASSWORD_HASH_B64`, `SESSION_SECRET`, `NEXT_PUBLIC_SITE_URL`).
4. Rode as migrations no banco de produção (`npx prisma migrate deploy`).
