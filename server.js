// Custom server usado pela Hostinger (Node.js app do hPanel).
// A Hostinger inicia o processo com `node server.js` e injeta a porta em
// process.env.PORT — o `next start` padrão também respeita, mas o custom
// server garante controle explícito de hostname e logs de boot.

const { createServer } = require("node:http");
const next = require("next");

const port = parseInt(process.env.PORT || "3000", 10);
const hostname = process.env.HOSTNAME || "0.0.0.0";

const app = next({ dev: false, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer((req, res) => handle(req, res)).listen(port, hostname, () => {
    console.log(`> Ready on http://${hostname}:${port}`);
  });
});
