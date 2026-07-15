import { IncomingMessage, ServerResponse } from "http";
import { ClienteService } from "../service/clienteService.js";
import { APIError } from "../errors/APIError.js";

const service = new ClienteService();

export async function routes(req: IncomingMessage, res: ServerResponse) {
  res.setHeader("Content-Type", "application/json");

  const url = req.url ?? "";
  const metodo = req.method ?? "";

  try {
    if (metodo === "GET" && url === "/clientes") {
      const clientes = await service.obtenerClientes();
      res.writeHead(200);
      res.end(JSON.stringify(clientes));
      return;
    }

    if (metodo === "POST" && url === "/sincronizar") {
      const resultado = await service.sincronizarYGuardar();
      res.writeHead(200);
      res.end(JSON.stringify({
        mensaje: "Sincronización y persistencia completada con éxito.",
        tiempo_total_ejecucion: `${resultado.tiempoTotalMs} ms`,
        total_registros: resultado.clientes.length,
        datos: resultado.clientes
      }));
      return;
    }

    res.writeHead(404);
    res.end(JSON.stringify({ error: "Ruta no encontrada" }));

  } catch (error: any) {
    if (error instanceof APIError) {
      res.writeHead(error.statusCode);
      res.end(JSON.stringify({
        error: "APIError",
        mensaje: error.message
      }));
      return;
    }

    res.writeHead(500);
    res.end(JSON.stringify({
      error: "Error Interno del Servidor",
      detalles: error.message || "Error desconocido en el flujo asincrónico"
    }));
  }
}