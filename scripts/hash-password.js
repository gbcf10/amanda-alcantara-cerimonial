const bcrypt = require("bcryptjs");

const password = process.argv[2];

if (!password) {
  console.error("Uso: npm run hash-password -- \"SUA_SENHA\"");
  process.exit(1);
}

bcrypt.hash(password, 10).then((hash) => {
  const b64 = Buffer.from(hash, "utf8").toString("base64");
  console.log("\nADMIN_PASSWORD_HASH_B64=" + b64 + "\n");
  console.log("Cole essa linha no seu arquivo .env");
  console.log(
    "\n(O hash é salvo em base64 porque o carregador de .env do Next.js\n" +
      "corrompe os caracteres '$' do formato bcrypt.)"
  );
});
