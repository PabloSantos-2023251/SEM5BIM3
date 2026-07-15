import { ClienteRepository } from "../data/clienteRepository.js";
import { APICliente } from "../client/cliente.js";
import { Cliente } from "../models/cliente.js";
import { APIError } from "../errors/APIError.js";

export class ClienteService {
  private repo = new ClienteRepository();
  private clienteAPI = new APICliente();

  async obtenerClientes(): Promise<Cliente[]> {
    return await this.repo.leer();
  }

  async obtenerClientePorId(id: number): Promise<Cliente> {
    const lista = await this.repo.leer();
    const cliente = lista.find(c => c.id === id);
    if (!cliente) {
      throw new APIError(`Cliente con ID ${id} no encontrado`, 404);
    }
    return cliente;
  }

  async crearCliente(nuevo: Omit<Cliente, "id">): Promise<Cliente> {
    const inicio = performance.now();
    const lista = await this.repo.leer();
    
    const clienteNuevo: Cliente = {
      id: Date.now(),
      ...nuevo
    };

    lista.push(clienteNuevo);
    await this.repo.guardar(lista);
    
    const fin = performance.now();
    console.log(`[CRUD] Cliente creado y persistido en: ${(fin - inicio).toFixed(2)} ms`);
    return clienteNuevo;
  }

  async actualizarCliente(id: number, datosActualizados: Partial<Omit<Cliente, "id">>): Promise<Cliente> {
    const inicio = performance.now();
    const lista = await this.repo.leer();
    const indice = lista.findIndex(c => c.id === id);

    if (indice === -1) {
      throw new APIError(`Cliente con ID ${id} no encontrado para actualizar`, 404);
    }

    lista[indice] = {
      ...lista[indice],
      ...datosActualizados
    };

    await this.repo.guardar(lista);
    
    const fin = performance.now();
    console.log(`[CRUD] Cliente actualizado y persistido en: ${(fin - inicio).toFixed(2)} ms`);
    return lista[indice];
  }

  async eliminarCliente(id: number): Promise<void> {
    const inicio = performance.now();
    const lista = await this.repo.leer();
    const longitudInicial = lista.length;
    
    const listaFiltrada = lista.filter(c => c.id !== id);

    if (listaFiltrada.length === longitudInicial) {
      throw new APIError(`Cliente con ID ${id} no encontrado para eliminar`, 404);
    }

    await this.repo.guardar(listaFiltrada);
    
    const fin = performance.now();
    console.log(`[CRUD] Cliente eliminado y JSON actualizado en: ${(fin - inicio).toFixed(2)} ms`);
  }

  async sincronizarYGuardar(): Promise<{ clientes: Cliente[]; tiempoTotalMs: string }> {
    const inicioProceso = performance.now();

    try {
      const clientesExternos = await this.clienteAPI.obtenerClientesExternos();

      const inicioEscritura = performance.now();
      await this.repo.guardar(clientesExternos);
      const finEscritura = performance.now();
      console.log(`[Archivo] Sincronización guardada localmente en: ${(finEscritura - inicioEscritura).toFixed(2)} ms`);

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