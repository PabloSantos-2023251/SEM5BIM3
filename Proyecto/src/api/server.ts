import { createServer } from "http";
import { routes } from "./router.js";

const servidor = createServer(async (req, res) => {
  await routes(req, res);
});

servidor.listen(3000, () => {
  console.log("================================");
  console.log("Servidor iniciado");
  console.log("http://localhost:3000");
  console.log("================================");
});