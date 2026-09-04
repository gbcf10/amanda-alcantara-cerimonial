# Site — Amanda Alcântara Cerimonial

Site institucional + painel administrativo para assessoria de cerimonial de
casamentos e eventos. Feito com Next.js 16 (App Router), TypeScript, Tailwind
CSS v4 e Prisma (MySQL — banco da Hostinger em produção).

## O que tem no site

**Site público:**
- Home, Portfólio (galeria de fotos), Depoimentos, Parcerias, Equipe
- **O que inclui** (`/servicos`): escopo completo do serviço de cerimonial,
  organizado por etapa (planejamento, fornecedores, cronograma, cerimônia,
  financeiro, convidados, logística, produção do dia, pós-evento etc.)
- Página de orçamento com formulário + calendário de disponibilidade
- **Histórias reais** (`/casais`): perfil de cada casal com fotos, vídeos
  (YouTube/Vimeo ou arquivo direto) e a história do casamento
- **Comunidade Noivas AA** (`/comunidade`): feed onde noivas cadastradas
  podem postar, comentar e reagir (❤️ 🎉 🥰 👏) aos posts umas das outras

**Painel admin (`/admin`):**
- Login protegido (usuário único, definido no `.env`)
- Gerenciar depoimentos, equipe, parcerias e fotos do portfólio
- Gerenciar a agenda de disponibilidade (datas disponíveis / reservadas / indisponíveis)
- Ver e atualizar os pedidos de orçamento recebidos pelo site
- Editar textos e contatos do site (hero, sobre, Instagram, WhatsApp, e-mail)
- Gerenciar o Histórias reais (criar casal, adicionar fotos e vídeos)
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

Pré-requisito: um MySQL rodando (local ou remoto). No Windows/macOS o mais
fácil é rodar via Docker:
```bash
docker run --name amanda-mysql -e MYSQL_ROOT_PASSWORD=root -e MYSQL_DATABASE=amanda -p 3306:3306 -d mysql:8
```

1. Instale as dependências:
   ```bash
   npm install
   ```

2. Copie o `.env.example` para `.env` e preencha:
   ```bash
   cp .env.example .env
   ```
   - `DATABASE_URL` — conexão do seu MySQL (ex: `mysql://root:root@localhost:3306/amanda`)
   - `SESSION_SECRET` — gere com `openssl rand -base64 48`
   - `ADMIN_PASSWORD_HASH_B64` — gere com `npm run hash-password -- "sua-senha"`

3. Crie as tabelas no banco:
   ```bash
   npx prisma db push
   ```

4. (Opcional) Popule com dados de exemplo:
   ```bash
   npm run db:seed
   npm run db:seed-community
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

O projeto usa **MySQL** — em produção o banco vem incluído no plano
Business da Hostinger. Em desenvolvimento use Docker (veja seção "Como
rodar localmente" acima) ou qualquer MySQL 8+.

O schema fica em `prisma/schema.prisma`. Sempre que mudar o schema, rode:
```bash
npx prisma db push
```
para sincronizar o banco com o código.

## Fotos

As imagens (portfólio, depoimentos, equipe, parcerias) são cadastradas por
URL no painel admin — cole o link de uma imagem já hospedada (ex: um serviço
gratuito como [Cloudinary](https://cloudinary.com) ou [imgbb](https://imgbb.com)).
Se preferir upload direto de arquivos no futuro, dá pra integrar um serviço
de storage.

## Deploy na Hostinger (Business Web Hosting)

O plano Business inclui Node.js e MySQL — dá pra rodar o site inteiro
dentro dele.

### 1. Criar o banco MySQL

No **hPanel** → **Bancos de dados** → **Gerenciamento MySQL**:
- Crie um banco novo (anote nome, usuário e senha).
- Anote também o host (geralmente `localhost`).

### 2. Subir o código

Duas opções:
- **Via Git** (recomendado): hPanel → **Avançado** → **Git** → conecte o
  repositório e defina a pasta destino (ex: `domains/seudominio.com/app`).
- **Via SFTP/File Manager**: mande todos os arquivos exceto `node_modules/`
  e `.next/` para essa mesma pasta.

### 3. Configurar a aplicação Node.js

hPanel → **Avançado** → **Node.js** → **Criar aplicação**:
- **Versão do Node.js:** 20 (ou mais recente disponível)
- **Modo:** production
- **Pasta raiz da aplicação:** a mesma onde subiu o código
- **URL da aplicação:** seu domínio
- **Arquivo de inicialização:** `server.js`

Nas **Environment variables** da aplicação, adicione:
- `DATABASE_URL` — `mysql://usuario:senha@localhost:3306/nome_do_banco`
- `ADMIN_EMAIL` — e-mail de login do painel
- `ADMIN_PASSWORD_HASH_B64` — gere com `npm run hash-password -- "senha"`
- `SESSION_SECRET` — gere com `openssl rand -base64 48`
- `NEXT_PUBLIC_SITE_URL` — `https://seudominio.com`
- `NODE_ENV` — `production`

### 4. Instalar dependências e buildar

Via SSH (hPanel → **Avançado** → **Acesso SSH**), entre na pasta da aplicação e rode:
```bash
npm ci
npx prisma db push          # cria as tabelas no MySQL
npm run db:seed             # (opcional) popular com dados iniciais
npm run db:seed-community   # (opcional) contas fictícias da comunidade
npm run build
```

> **Dica:** o `npm run build` do Next é pesado de RAM. Se estourar memória
> na Hostinger, faça o build no seu computador (`npm run build`) e envie
> a pasta `.next/` inteira via SFTP pra pasta da aplicação.

### 5. Reiniciar

Volte pra tela da aplicação Node.js no hPanel e clique em **Restart App**.
Pronto — acesse `https://seudominio.com`.

### Atualizações futuras

A cada mudança no código:
```bash
git pull                    # ou reenvia arquivos via SFTP
npm ci                      # se alterou dependências
npx prisma db push          # se alterou schema.prisma
npm run build
```
E clique em **Restart App** no hPanel.
