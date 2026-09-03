const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

function avatarUrl(seed) {
  return `https://api.dicebear.com/9.x/notionists-neutral/svg?seed=${encodeURIComponent(
    seed
  )}&backgroundColor=f1e9e0`;
}

async function main() {
  const members = await prisma.teamMember.findMany({
    where: { photoUrl: null },
  });

  for (const member of members) {
    await prisma.teamMember.update({
      where: { id: member.id },
      data: { photoUrl: avatarUrl(member.name) },
    });
  }

  console.log(`Avatares ilustrados adicionados para ${members.length} membro(s) fictício(s).`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
