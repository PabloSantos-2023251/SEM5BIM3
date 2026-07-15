import { IncomingMessage, ServerResponse } from "http";
import { ClienteService } from "../service/clienteService.js";
import { APIError } from "../errors/APIError.js";

const service = new ClienteService();

async function obtenerBody(req: IncomingMessage): Promise<any> {
  return new Promise((resolve, reject) => {
    let cuerpo = "";
    req.on("data", (chunk) => {
      cuerpo += chunk.toString();
    });
    req.on("end", () => {
      try {
        resolve(cuerpo ? JSON.parse(cuerpo) : {});
      } catch (err) {
        reject(new APIError("Formato JSON inválido en el cuerpo de la petición", 400));
      }
    });
  });
}

export async function routes(req: IncomingMessage, res: ServerResponse) {
  res.setHeader("Content-Type", "application/json");

  const urlParsed = new URL(req.url ?? "", `http://${req.headers.host}`);
  const ruta = urlParsed.pathname;
  const metodo = req.method ?? "";
  const idQuery = urlParsed.searchParams.get("id");
  const idNum = idQuery ? parseInt(idQuery) : null;

  try {
    // 1. OBTENER TODO O POR ID (GET)
    if (metodo === "GET" && ruta === "/clientes") {
      if (idNum !== null) {
        const cliente = await service.obtenerClientePorId(idNum);
        res.writeHead(200);
        res.end(JSON.stringify(cliente));
        return;
      }
      const clientes = await service.obtenerClientes();
      res.writeHead(200);
      res.end(JSON.stringify(clientes));
      return;
    }

    // 2. CREAR CLIENTE (POST)
    if (metodo === "POST" && ruta === "/clientes") {
      const body = await obtenerBody(req);
      if (!body.nombre || !body.email) {
        throw new APIError("El nombre y el email son campos obligatorios", 400);
      }
      const clienteCreado = await service.crearCliente(body);
      res.writeHead(201);
      res.end(JSON.stringify(clienteCreado));
      return;
    }

    // 3. ACTUALIZAR CLIENTE (PUT)
    if (metodo === "PUT" && ruta === "/clientes") {
      if (idNum === null || isNaN(idNum)) {
        throw new APIError("Es obligatorio proveer un ID de cliente válido (?id=VALOR)", 400);
      }
      const body = await obtenerBody(req);
      const clienteActualizado = await service.actualizarCliente(idNum, body);
      res.writeHead(200);
      res.end(JSON.stringify(clienteActualizado));
      return;
    }

    // 4. ELIMINAR CLIENTE (DELETE)
    if (metodo === "DELETE" && ruta === "/clientes") {
      if (idNum === null || isNaN(idNum)) {
        throw new APIError("Es obligatorio proveer un ID de cliente válido (?id=VALOR)", 400);
      }
      await service.eliminarCliente(idNum);
      res.writeHead(200);
      res.end(JSON.stringify({ mensaje: `Cliente con ID ${idNum} eliminado exitosamente` }));
      return;
    }

    // 5. SINCRONIZAR DESDE API EXTERNA (POST)
    if (metodo === "POST" && ruta === "/sincronizar") {
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