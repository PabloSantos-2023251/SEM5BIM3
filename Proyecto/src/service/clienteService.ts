import { ClienteRepository } from "../data/clienteRepository.js";
import { APICliente } from "../client/cliente.js";
import { Cliente } from "../models/cliente.js";

export class ClienteService {
  private repo = new ClienteRepository();
  private clienteAPI = new APICliente();

  async obtenerClientes(): Promise<Cliente[]> {
    return await this.repo.leer();
  }

  async sincronizarYGuardar(): Promise<{ clientes: Cliente[]; tiempoTotalMs: string }> {
    const inicioProceso = performance.now();

    try {
      const clientesExternos = await this.clienteAPI.obtenerClientesExternos();

      const inicioEscritura = performance.now();
      await this.repo.guardar(clientesExternos);
      const finEscritura = performance.now();
      console.log(`[Archivo] Datos guardados localmente en: ${(finEscritura - inicioEscritura).toFixed(2)} ms`);

      const finProceso = performance.now();
      const tiempoTotal = (finProceso - inicioProceso).toFixed(2);

      return {
        clientes: clientesExternos,
        tiempoTotalMs: tiempoTotal
      };

    } catch (error: any) {
      console.error("\n❌ [Servicio] Ocurrió un error al sincronizar los datos.");
      throw error;
    }
  }
}