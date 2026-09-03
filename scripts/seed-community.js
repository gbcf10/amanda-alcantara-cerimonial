const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

const REACTION_TYPES = ["amei", "parabens", "fofo", "bravo"];

const USERS = [
  {
    name: "Beatriz Souza",
    email: "beatriz.souza.demo@exemplo.com",
    post: "Gente, ainda em êxtase com o nosso casamento! A Amanda pensou em cada detalhe do cronograma, desde a montagem até o último brinde. No dia eu não precisei me preocupar com absolutamente nada, só aproveitar. Recomendo demais! 🤍",
  },
  {
    name: "Camila Ferreira",
    email: "camila.ferreira.demo@exemplo.com",
    post: "Fechei com a Amanda faltando 4 meses pro casamento e foi a melhor decisão. Ela organizou os fornecedores, montou o cronograma do grande dia e ainda cuidou da minha lista de convidados. Tudo correu redondinho!",
  },
  {
    name: "Juliana Almeida",
    email: "juliana.almeida.demo@exemplo.com",
    post: "O que mais me surpreendeu foi a calma que ela transmite. Mesmo quando choveu de última hora e precisamos mudar o local da cerimônia, ela resolveu tudo sem que eu nem percebesse a crise rolando. Gratidão eterna!",
  },
  {
    name: "Larissa Costa",
    email: "larissa.costa.demo@exemplo.com",
    post: "Casamos há duas semanas e até hoje recebo mensagens de convidados elogiando a organização. Isso é mérito 100% da Amanda e da equipe dela. O cortejo, os horários, tudo no tempo certo!",
  },
  {
    name: "Mariana Rocha",
    email: "mariana.rocha.demo@exemplo.com",
    post: "Se tem uma coisa que não tem preço é chegar no seu próprio casamento e não precisar resolver nada. A Amanda cuidou até da planilha financeira com a gente, isso ajudou muito a manter o orçamento sob controle.",
  },
  {
    name: "Fernanda Lima",
    email: "fernanda.lima.demo@exemplo.com",
    post: "Alguém mais estava super perdida com a lista de fornecedores antes de contratar assessoria? Comigo foi assim, até a Amanda entrar e trazer indicações de confiança pra cada serviço. Facilitou muito nossa vida!",
  },
  {
    name: "Patrícia Gomes",
    email: "patricia.gomes.demo@exemplo.com",
    post: "Nosso casamento foi em um espaço bem desafiador em termos de logística, e a visita técnica que ela fez antes evitou vários perrengues no dia. Profissionalismo do início ao fim.",
  },
  {
    name: "Rafaela Martins",
    email: "rafaela.martins.demo@exemplo.com",
    post: "Eu e meu marido nem imaginávamos como funcionava o cortejo, a ordem de entrada, essas coisas todas. A Amanda orientou os padrinhos e madrinhas certinho e no dia ninguém ficou perdido. Muito grata!",
  },
  {
    name: "Bianca Oliveira",
    email: "bianca.oliveira.demo@exemplo.com",
    post: "O grupo de WhatsApp que ela cria pro casal facilita demais a comunicação durante o planejamento. Tirava dúvida na hora, sempre super solícita. Recomendo de olhos fechados!",
  },
  {
    name: "Débora Santos",
    email: "debora.santos.demo@exemplo.com",
    post: "Depois do casamento ela ainda fez questão de fechar tudo com os fornecedores e nos entregar a planilha financeira consolidada. Cuidado do início ao pós-evento mesmo, amei trabalhar com ela.",
  },
];

const COMMENTS = [
  "Que lindo! Também fechei com ela pro meu casamento em dezembro, super animada!",
  "Migaaaa, também senti isso! Ela é incrível.",
  "Fiquei emocionada lendo, é exatamente como foi comigo também 🤍",
  "Ainda estou decidindo a assessoria, isso me deixou ainda mais confiante!",
  "Que demais, parabéns pelo casamento!",
  "Concordo demais, o dia passa tão rápido que é ótimo não ter que se preocupar com nada.",
  "Amei o depoimento, salvando pra mostrar pro meu noivo!",
];

async function main() {
  const passwordHash = await bcrypt.hash("ComunidadeAA2026!", 10);

  const createdUsers = [];
  for (const u of USERS) {
    const user = await prisma.brideUser.upsert({
      where: { email: u.email },
      update: {},
      create: { name: u.name, email: u.email, passwordHash },
    });
    createdUsers.push({ ...user, postContent: u.post });
  }

  const createdPosts = [];
  for (const user of createdUsers) {
    const existing = await prisma.post.findFirst({
      where: { authorId: user.id, content: user.postContent },
    });
    const post =
      existing ??
      (await prisma.post.create({
        data: {
          authorId: user.id,
          content: user.postContent,
          published: true,
        },
      }));
    createdPosts.push(post);
  }

  let commentIndex = 0;
  for (const post of createdPosts) {
    const commenters = createdUsers.filter((u) => u.id !== post.authorId);
    const numComments = 1 + (commentIndex % 3); // 1 a 3 comentários por post
    for (let i = 0; i < numComments; i++) {
      const commenter = commenters[(commentIndex + i) % commenters.length];
      const content = COMMENTS[(commentIndex + i) % COMMENTS.length];
      const existing = await prisma.comment.findFirst({
        where: { postId: post.id, authorId: commenter.id, content },
      });
      if (!existing) {
        await prisma.comment.create({
          data: {
            postId: post.id,
            authorId: commenter.id,
            content,
            published: true,
          },
        });
      }
    }
    commentIndex++;
  }

  let reactionIndex = 0;
  for (const post of createdPosts) {
    const reactors = createdUsers.filter((u) => u.id !== post.authorId);
    const numReactions = 3 + (reactionIndex % 5); // 3 a 7 reações por post
    for (let i = 0; i < numReactions; i++) {
      const reactor = reactors[i % reactors.length];
      const type = REACTION_TYPES[(reactionIndex + i) % REACTION_TYPES.length];
      await prisma.reaction.upsert({
        where: { postId_authorId: { postId: post.id, authorId: reactor.id } },
        update: { type },
        create: { postId: post.id, authorId: reactor.id, type },
      });
    }
    reactionIndex++;
  }

  console.log(`Criadas/atualizadas ${createdUsers.length} contas fictícias.`);
  console.log(`Criados/atualizados ${createdPosts.length} posts.`);
  console.log("Comentários e reações adicionados.");

  const whatsappQuote =
    "Oi Amanda, eu agradeço você por todo cuidado, carinho e dedicação para o nosso sonho realizado. Tivemos um dia muito lindo e nos divertimos muito. ❤️";
  const existingTestimonial = await prisma.testimonial.findFirst({
    where: { quote: whatsappQuote },
  });
  if (!existingTestimonial) {
    await prisma.testimonial.create({
      data: {
        clientName: "Noiva (via WhatsApp)",
        eventType: "Casamento",
        quote: whatsappQuote,
        rating: 5,
        published: true,
        order: 0,
      },
    });
    console.log("Depoimento do WhatsApp adicionado.");
  }

  const placeholderCouples = [
    { names: "Casal 1", slug: "casal-1" },
    { names: "Casal 2", slug: "casal-2" },
  ];
  for (const c of placeholderCouples) {
    await prisma.couple.upsert({
      where: { slug: c.slug },
      update: {},
      create: {
        names: c.names,
        slug: c.slug,
        story:
          "Edite este perfil no painel admin com o nome real do casal, a história do casamento e as fotos/vídeos.",
        published: false,
      },
    });
  }
  console.log("Casais de exemplo (rascunho) criados em /admin/casais.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
